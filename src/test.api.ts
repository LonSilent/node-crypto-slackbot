import { PriceFetcher } from "./api";

async function main() {
  const result = await Promise.all([
    // PriceFetcher.getPriceBySymbol("eth"),
    // PriceFetcher.getBinancePrice(),
    // PriceFetcher.getBitmexPrice()
    PriceFetcher.getBinanceFuture()
  ]);

  console.log(result);
}

main();
