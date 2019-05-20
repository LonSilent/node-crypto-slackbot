import axios from "axios";
import { coinList } from "./const";

function addPlus(str) {
  return !str.includes("-") ? `(+${str}%)` : `(${str}%)`;
}

function toFixedTwo(str) {
  return Number(str)
    .toFixed(2)
    .toString();
}

async function getPrice(symbol) {
  const upperSymbol = symbol.toUpperCase();
  const response = await axios.get(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${upperSymbol}&tsyms=USD,BTC`
  );
  if (!response.data === undefined || response.data.HasWarning) {
    return undefined;
  }
  const resultMapping = Object.assign(
    { symbol: symbol },
    Object.values(response.data)[0]
  );
  return resultMapping;
}

async function getBinancePrice() {
  const response = await axios.get(
    `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${coinList.join(
      ","
    )}&tsyms=USDT&e=Binance`
  );
  if (!response.data === undefined || response.data.HasWarning) {
    return undefined;
  }
  const resultMapping = Object.entries(response.data["DISPLAY"]).map(x => {
    return {
      symbol: x[0],
      price: x[1].USDT.PRICE.slice(2),
      highOf24hr: x[1].USDT.HIGH24HOUR.slice(2),
      lowOf24hr: x[1].USDT.LOW24HOUR.slice(2),
      percentage: addPlus(x[1].USDT.CHANGEPCT24HOUR)
    };
  });
  // console.log(resultMapping);

  return resultMapping;
}

async function getBitoPrice() {
  const response = (await Promise.all([
    axios.get(`https://api.bitopro.com/v2/tickers/btc_twd`),
    axios.get(`https://api.bitopro.com/v2/tickers/eth_twd`)
  ]))
    .filter(e => e.status === 200)
    .map(e => e.data.data);
  if (response.length === 0) {
    return undefined;
  }
  const resultMapping = response.map(x => {
    return {
      symbol: x.pair,
      price: toFixedTwo(x.lastPrice),
      highOf24hr: toFixedTwo(x.high24hr),
      lowOf24hr: toFixedTwo(x.low24hr),
      percentage: addPlus(x.priceChange24hr)
    };
  });
  return resultMapping;
}

export { getPrice, getBinancePrice, getBitoPrice };
