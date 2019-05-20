import { getPrice, getBinancePrice, getBitoPrice } from "./api";

async function main() {
  const result = await Promise.all([
    getPrice("eth"),
    getBinancePrice(),
    getBitoPrice()
  ]);

  console.log(result);
}

main();
