const coinList = ["BTC", "ETH", "XRP", "BNB"];
const bitmexList = ["XBTUSD", "ETHUSD"];

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

const btcTargetMove = 100;
const ethTargetMove = 5;

const apiKey = "";

export { coinList, bitmexList };
export { syncMinute, userToNotify, alertObj, apiKey };
export { btcTargetMove, ethTargetMove };
