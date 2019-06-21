import slackBot from "slackbots";
import { SLACK_BOT_TOKEN } from "./src/slackAuthToken";
import {
  getBinancePrice,
  getPrice,
  getBitoPrice,
  getBitmexPrice,
  getBitmexPrice_v2
} from "./src/api";

const bot = new slackBot({
  token: SLACK_BOT_TOKEN,
  name: "node-crypto-slackbot"
});

const params = {
  icon_emoji: ":miku2:"
};

bot.on("message", async data => {
  if (data.type === "message") {
    const message = data.text.toLowerCase();
    // get api with cryptocompare
    if (message.startsWith("bot")) {
      const splitMessage = message.split(" ");
      if (splitMessage.length > 1) {
        const target = splitMessage.slice(1);
        const price = (await Promise.all(target.map(x => getPrice(x)))).filter(
          x => x !== undefined
        );
        console.log("=====================");
        console.log("symbol price\n", price);
        console.log("=====================");
        const result = price
          .map(x => `${x.symbol.toUpperCase()}\n[USD] ${x.USD}\n[BTC] ${x.BTC}`)
          .join("\n")
          .trim();
        bot.postMessage(data.channel, result, params);
      } else {
        const price = await getBinancePrice();
        console.log("=====================");
        console.log("binance price\n", price);
        console.log("=====================");
        if (price) {
          const result = price
            .map(
              x =>
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
  }
});

bot.on("message", async data => {
  if (data.type === "message") {
    // console.log(data);
    const message = data.text.toLowerCase();
    // get api with cryptocompare
    if (message.startsWith("bito")) {
      const price = await getBitoPrice();
      console.log("=====================");
      console.log("bito price\n", price);
      console.log("=====================");
      if (price) {
        const result = price
          .map(
            x =>
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

bot.on("message", async data => {
  if (data.type === "message") {
    const message = data.text.toLowerCase();
    if (message.startsWith("mex")) {
      const price = await getBitmexPrice_v2();
      console.log("=====================");
      console.log("mex price\n", price);
      console.log("=====================");
      if (price) {
        const result = price
          .map(
            x =>
              `${x.symbol.toUpperCase()}\n[price] ${x.price}\n[high_24hr] ${
                x.highOf24hr
              }\n[low_24hr] ${x.lowOf24hr}`
          )
          .join("\n")
          .trim();
        bot.postMessage(data.channel, result, params);
      }
    }
  }
});
