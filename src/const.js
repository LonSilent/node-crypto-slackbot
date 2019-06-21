const coinList = ["BTC", "ETH", "XRP", "BNB"];
const bitmexList = ["XBTUSD", "XBTU19", "XBTZ19", "ETHUSD"];

// alert param
const syncMinute = 2;
const userToNotify = "lonsilent";

const alertObj = [
  {
    trackSymbol: "eth",
    belowTarget: 240,
    aboveTarget: 250,
    targetMove: 5
  },
  {
    trackSymbol: "btc",
    belowTarget: 7900,
    aboveTarget: 8000,
    targetMove: 100
  }
];

const apiKey = "";

export { coinList, bitmexList };
export { syncMinute, userToNotify, alertObj, apiKey };
