import config from "config";

const coinList: Array<string> = config.get("ticket.general");
const bitmexList: Array<string> = config.get("ticket.bitmex");

// alert param
const syncMinute: number = config.get("ticket.syncMinute");
const userToNotify: string = config.get("bot.userToNotify");

const btcTargetMove: number = config.get("ticket.targetMove.BTC");
const ethTargetMove: number = config.get("ticket.targetMove.ETH");

const apiKey: string = config.get("key.minApi");
const SLACK_BOT_TOKEN: string = config.get("key.slackbot");

export { coinList, bitmexList };
export { syncMinute, userToNotify, apiKey, SLACK_BOT_TOKEN };
export { btcTargetMove, ethTargetMove };
