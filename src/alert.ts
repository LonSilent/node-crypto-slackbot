import slackBot from "slackbots";
import { getPrice, buildAlertObject } from "./api";
import moment from "moment";
import { syncMinute, userToNotify, SLACK_BOT_TOKEN } from "./api/const";

const bot = new slackBot({
  token: SLACK_BOT_TOKEN,
  name: "node-crypto-slackbot"
});

const params = {
  icon_emoji: ":miku2:"
};

let alertPrice;

async function alertCheck(obj, index) {
  const price = await getPrice(obj.trackSymbol);
  // console.log(price);
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
    alertPrice[index] = Object.assign(
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
    alertPrice[index] = Object.assign(
      {},
      { ...obj, aboveTarget: obj.aboveTarget + obj.targetMove }
    );
  }
}

async function main() {
  alertPrice = await buildAlertObject();
  console.info(alertPrice);
}

main();
bot.on("start", function() {
  const syncer = setInterval(async () => {
    alertPrice.forEach(async (e, index) => {
      await alertCheck(e, index);
    });
  }, syncMinute * 60 * 1000);
});
