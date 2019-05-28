import { getPrice, getBinancePrice, getBitoPrice, getBitmexPrice } from "./api";

async function main() {
  const result = await Promise.all([
    getPrice("eth"),
    getBinancePrice(),
    getBitoPrice(),
    getBitmexPrice()
  ]);

  console.log(result);
}

main();
