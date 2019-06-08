import slackBot from "slackbots";
import { SLACK_BOT_TOKEN } from "./src/slackAuthToken";
import { getPrice } from "./src/api";
import moment from "moment";
import { syncMinute, userToNotify, alertObj } from "./src/const";

const bot = new slackBot({
  token: SLACK_BOT_TOKEN,
  name: "node-crypto-slackbot"
});

const params = {
  icon_emoji: ":miku2:"
};

let alertPrice = alertObj;

async function alertCheck(obj, index) {
  const price = await getPrice(obj.trackSymbol);
  if (price && price.USD <= obj.belowTarget) {
    console.log(
      `在 ${moment().format(
        "lll"
      )} 的時候，${obj.trackSymbol.toUpperCase()} 跌到 ${
        obj.belowTarget
      } 以下囉~買起來買起來`
    );
    bot.postMessageToUser(
      userToNotify,
      `在 ${moment().format(
        "lll"
      )} 的時候，${obj.trackSymbol.toUpperCase()} 跌到 ${
        obj.belowTarget
      } 以下囉~買起來買起來\nNext notification will be at price: ${obj.belowTarget -
        obj.targetMove}`,
      params
    );
    // belowPrice -= targetMove;
    alertObj[index] = Object.assign(
      {},
      { ...obj, belowTarget: obj.belowTarget - obj.targetMove }
    );
  }
  if (price && price.USD >= obj.aboveTarget) {
    console.log(
      `在 ${moment().format(
        "lll"
      )} 的時候，${obj.trackSymbol.toUpperCase()} 漲到 ${
        obj.aboveTarget
      } 以上辣~虎阿起來嗨!!!`
    );
    bot.postMessageToUser(
      userToNotify,
      `在 ${moment().format(
        "lll"
      )} 的時候，${obj.trackSymbol.toUpperCase()} 漲到 ${
        obj.aboveTarget
      } 以上辣~虎阿起來嗨!!!\nNext notification will be at price: ${obj.aboveTarget +
        obj.targetMove}`,
      params
    );
    // abovePrice += targetMove;
    alertObj[index] = Object.assign(
      {},
      { ...obj, aboveTarget: obj.aboveTarget + obj.targetMove }
    );
  }
}

bot.on("start", function() {
  const syncer = setInterval(async () => {
    alertPrice.forEach(async (e, index) => {
      await alertCheck(e, index);
      console.log(alertObj);
    });
  }, syncMinute * 60 * 1000);
});
