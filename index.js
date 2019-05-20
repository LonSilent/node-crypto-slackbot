import slackBot from "slackbots";
import { SLACK_BOT_TOKEN } from "./src/slackAuthToken";
import { getBinancePrice, getPrice } from "./src/api";

const bot = new slackBot({
  token: SLACK_BOT_TOKEN,
  name: "node-crypto-slackbot"
});

const params = {
  icon_emoji: ":miku2:"
};

bot.on("message", async data => {
  if (data.type === "message") {
    // console.log(data);
    const message = data.text;
    if (message.startsWith("bot")) {
      const splitMessage = message.split(" ");
      if (splitMessage.length > 1) {
        const target = splitMessage.slice(1);
        // console.log(target);
        const price = (await Promise.all(target.map(x => getPrice(x)))).filter(
          x => x !== undefined
        );
        console.log(price);
        const result = price
          .map(x => `${x.symbol.toUpperCase()}\n[USD] ${x.USD}\n[BTC] ${x.BTC}`)
          .join("\n")
          .trim();
        // console.log("result", result);
        bot.postMessage(data.channel, result, params);
      } else {
        const price = await getBinancePrice();
        console.log(price);
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
          // console.log("result", result);
          bot.postMessage(data.channel, result, params);
        }
      }
    }
  }
});
