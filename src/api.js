import axios from "axios";

function addPlus(str) {
  return !str.includes("-") ? `(+${str}%)` : `(${str}%)`;
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
  const coinList = ["BTC", "ETH", "XRP"];
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

export { getPrice, getBinancePrice };
