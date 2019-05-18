import { getPrice, getBinancePrice } from "./api";

async function main() {
  const result = await Promise.all([
    getPrice("eth"),
    getBinancePrice("binance")
  ]);

  console.log(result);
}

main();
