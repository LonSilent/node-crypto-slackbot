import axios from "axios";
import _ from "lodash";
import {
  coinList,
  apiKey,
  bitmexList,
  btcTargetMove,
  ethTargetMove,
  binanceFutureList,
} from "./const";

interface cryptoInfo {
  USDT: {
    PRICE: string;
    HIGH24HOUR: string;
    LOW24HOUR: string;
    CHANGEPCT24HOUR: string;
  };
}

type DISPLAY = [string, cryptoInfo];

interface priceInfo {
  symbol: string;
  USD: number;
  BTC: number;
}

interface bitmexInfo {
  symbol: string;
  lastPrice: number;
  lowPrice: number;
  highPrice: number;
  fundingRate: number;
  lastChangePcnt: number;
  indicativeFundingRate: number;
}

function addPlus(str) {
  return !str.includes("-") ? `(+${str}%)` : `(${str}%)`;
}

function toFixed(str: string | number, fixed: number) {
  return Number(str).toFixed(fixed).toString();
}

class PriceFetcher {
  static async getPriceBySymbol(symbol) {
    const upperSymbol = symbol.toUpperCase();
    const response = await axios.get(
      `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${upperSymbol}&tsyms=USD,BTC&api_key=${apiKey}`
    );
    if (!response.data === undefined || response.data.HasWarning) {
      return undefined;
    }
    const resultMapping = Object.assign(
      { symbol: symbol },
      Object.values(response.data)[0]
    );
    return resultMapping as priceInfo;
  }

  static async getBinancePrice() {
    const response = await axios.get(
      `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${coinList.join(
        ","
      )}&tsyms=USDT&e=Binance&api_key=${apiKey}`
    );
    if (!response.data === undefined || response.data.HasWarning) {
      return undefined;
    }
    const resultMapping = Object.entries(response.data["DISPLAY"]).map(
      (x: DISPLAY) => {
        return {
          symbol: x[0],
          price: x[1].USDT.PRICE.slice(2),
          highOf24hr: x[1].USDT.HIGH24HOUR.slice(2),
          lowOf24hr: x[1].USDT.LOW24HOUR.slice(2),
          percentage: addPlus(x[1].USDT.CHANGEPCT24HOUR),
        };
      }
    );
  }
  // console.log(resultMapping);

  static async getBitmexPrice() {
    const columns = [
      "lastPrice",
      "lowPrice",
      "highPrice",
      "fundingRate",
      "lastChangePcnt",
      "indicativeFundingRate",
    ];
    const queryString = bitmexList.map(
      (x) =>
        `https://www.bitmex.com/api/v1/instrument?symbol=${x}&columns=${columns.join(
          "%2C"
        )}&count=1&reverse=false`
    );
    const response = await Promise.all(
      queryString.map(async (x) => {
        let result: bitmexInfo = (await axios.get(x)).data[0];
        return {
          symbol: result.symbol,
          price: result.lastPrice.toString(),
          highOf24hr: result.highPrice.toString(),
          lowOf24hr: result.lowPrice.toString(),
          fundingRate: `${toFixed(result.fundingRate * 100, 4)}%`,
          indicativeFundingRate: `${toFixed(
            result.indicativeFundingRate * 100,
            4
          )}%`,
          percentage: `${toFixed(result.fundingRate * 100, 2)}%`,
        };
      })
    );

    return response;
  }

  static async getBinanceFuture() {
    const response = await axios.get(
      "https://fapi.binance.com/fapi/v1/ticker/24hr"
    );
    if (!response.data === undefined || response.data.HasWarning) {
      return undefined;
    }
    // console.log(binanceFutureList);
    const responseMapping = (response.data as Array<any>)
      .filter((x) => binanceFutureList.includes(x.symbol))
      .map((x) => {
        return {
          symbol: x.symbol,
          price: x.lastPrice,
          highOf24hr: x.highPrice,
          lowOf24hr: x.lowPrice,
          percentage: addPlus(x.priceChangePercent),
        };
      });
    return responseMapping;
  }
}

async function buildAlertObject() {
  const btcPrice = await PriceFetcher.getPriceBySymbol("btc");
  const ethPrice = await PriceFetcher.getPriceBySymbol("eth");

  if (btcPrice.USD && ethPrice.USD) {
    return [
      {
        trackSymbol: "btc",
        belowTarget: Math.floor(btcPrice.USD / btcTargetMove) * btcTargetMove,
        aboveTarget: Math.ceil(btcPrice.USD / btcTargetMove) * btcTargetMove,
        targetMove: btcTargetMove,
      },
      {
        trackSymbol: "eth",
        belowTarget: Math.floor(ethPrice.USD / ethTargetMove) * ethTargetMove,
        aboveTarget: Math.ceil(ethPrice.USD / ethTargetMove) * ethTargetMove,
        targetMove: ethTargetMove,
      },
    ];
  }
  return undefined;
}

export { PriceFetcher, buildAlertObject };
