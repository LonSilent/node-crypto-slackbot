import slackBot from "slackbots";
import { SLACK_BOT_TOKEN } from "./src/slackAuthToken";
import { getPrice } from "./src/api";
import moment from "moment";
import {
  syncMinute,
  trackSymbol,
  aboveTarget,
  belowTarget,
  userToNotify
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
      // console.log(
      //   `${trackSymbol.toUpperCase()} 跌到 ${belowPrice} 以下囉~買起來買起來`
      // );
      bot.postMessageToUser(
        userToNotify,
        `在 ${moment().format(
          "llll"
        )} 的時候，${trackSymbol.toUpperCase()} 跌到 ${belowPrice} 以下囉~買起來買起來`,
        params
      );
      belowPrice -= 10;
      // console.log(belowPrice);
    }
    if (price && price.USD >= abovePrice) {
      // console.log(
      //   `${trackSymbol.toUpperCase()} 漲到 ${abovePrice} 以上辣~虎阿起來嗨!!!`
      // );
      bot.postMessageToUser(
        userToNotify,
        `在 ${moment().format(
          "llll"
        )} 的時候，${trackSymbol.toUpperCase()} 漲到 ${abovePrice} 以上辣~虎阿起來嗨!!!`,
        params
      );
      abovePrice += 10;
      // console.log(abovePrice);
    }
  }, syncMinute * 60 * 1000);
});
