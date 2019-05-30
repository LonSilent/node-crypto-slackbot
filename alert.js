import slackBot from "slackbots";
import { SLACK_BOT_TOKEN } from "./src/slackAuthToken";
import { getPrice } from "./src/api";
import moment from "moment";
import {
  syncMinute,
  trackSymbol,
  aboveTarget,
  belowTarget,
  userToNotify,
  targetMove
} from "./src/const";

const bot = new slackBot({
  token: SLACK_BOT_TOKEN,
  name: "node-crypto-slackbot"
});

const params = {
  icon_emoji: ":miku2:"
};

let belowPrice = belowTarget;
let abovePrice = aboveTarget;

bot.on("start", function() {
  const syncer = setInterval(async () => {
    // const price = await getBinancePrice();
    const price = await getPrice(trackSymbol);
    // console.log(price, moment().format("llll"));
    if (price && price.USD <= belowPrice) {
      console.log(
        `在 ${moment().format(
          "lll"
        )} 的時候，${trackSymbol.toUpperCase()} 跌到 ${belowPrice} 以下囉~買起來買起來`
      );
      bot.postMessageToUser(
        userToNotify,
        `在 ${moment().format(
          "lll"
        )} 的時候，${trackSymbol.toUpperCase()} 跌到 ${belowPrice} 以下囉~買起來買起來`,
        params
      );
      belowPrice -= targetMove;
      bot.postMessageToUser(
        userToNotify,
        `Next notification will be at price: ${belowPrice}`,
        params
      );
      // console.log(belowPrice);
    }
    if (price && price.USD >= abovePrice) {
      console.log(
        `在 ${moment().format(
          "lll"
        )} 的時候，${trackSymbol.toUpperCase()} 漲到 ${abovePrice} 以上辣~虎阿起來嗨!!!`
      );
      bot.postMessageToUser(
        userToNotify,
        `在 ${moment().format(
          "lll"
        )} 的時候，${trackSymbol.toUpperCase()} 漲到 ${abovePrice} 以上辣~虎阿起來嗨!!!`,
        params
      );
      abovePrice += targetMove;
      bot.postMessageToUser(
        userToNotify,
        `Next notification will be at price: ${abovePrice}`,
        params
      );
    }
  }, syncMinute * 60 * 1000);
});
