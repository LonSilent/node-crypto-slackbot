import slackBot from "slackbots";
import { PriceFetcher } from "./api";
import { SLACK_BOT_TOKEN } from "./api/const";

interface priceInfo {
  symbol: string;
  USD: number;
  BTC: number;
}

const bot = new slackBot({
  token: SLACK_BOT_TOKEN,
  name: "キャルちゃん",
});

const params = {
  icon_emoji: ":kyaru2:",
};

bot.on("message", async (data) => {
  if (data.type === "message") {
    const message = data.text.toLowerCase();
    // get api with cryptocompare
    if (message.startsWith("bot")) {
      const splitMessage = message.split(" ");
      if (splitMessage.length > 1) {
        const target = splitMessage.slice(1);
        const price = (
          await Promise.all(target.map((x) => PriceFetcher.getPriceBySymbol(x)))
        ).filter((x) => x !== undefined) as priceInfo[];
        console.log("=====================");
        console.log("symbol price\n", price);
        console.log("=====================");
        const result = price
          .map(
            (x) => `${x.symbol.toUpperCase()}\n[USD] ${x.USD}\n[BTC] ${x.BTC}`
          )
          .join("\n")
          .trim();
        bot.postMessage(data.channel, result, params);
      } else {
        const price = await PriceFetcher.getBinancePrice();
        console.log("=====================");
        console.log("binance price\n", price);
        console.log("=====================");
        if (price) {
          const result = price
            .map(
              (x) =>
                `${x.symbol.toUpperCase()}\n[price] ${x.price} ${
                  x.percentage
                }\n[high_24hr] ${x.highOf24hr}\n[low_24hr] ${x.lowOf24hr}`
            )
            .join("\n")
            .trim();
          bot.postMessage(data.channel, result, params);
        }
      }
    } else if (message.startsWith("mex")) {
      const price = await PriceFetcher.getBitmexPrice();
      console.log("=====================");
      console.log("mex price\n", price);
      console.log("=====================");
      if (price) {
        const result = price
          .map(
            (x) =>
              `${x.symbol.toUpperCase()}\n[price] ${x.price}\n[high_24hr] ${
                x.highOf24hr
              }\n[low_24hr] ${x.lowOf24hr}\n[fundingRate] ${x.fundingRate} ${
                x.indicativeFundingRate
              }`
          )
          .join("\n")
          .trim();
        bot.postMessage(data.channel, result, params);
      }
    } else if (message.startsWith("bf")) {
      const price = await PriceFetcher.getBinanceFuture();
      console.log("=====================");
      console.log("binance future price\n", price);
      console.log("=====================");
      if (price) {
        const result = price
          .map(
            (x) =>
              `${x.symbol.toUpperCase()}\n[price] ${x.price} ${
                x.percentage
              }\n[high_24hr] ${x.highOf24hr}\n[low_24hr] ${x.lowOf24hr}`
          )
          .join("\n")
          .trim();
        bot.postMessage(data.channel, result, params);
      }
    }
  }
});
