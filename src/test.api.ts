import {
  getPrice,
  getBinancePrice,
  // getBitoPrice,
  // getBitmexPrice,
  getBitmexPrice
} from "./api";

async function main() {
  const result = await Promise.all([
    getPrice("eth"),
    getBinancePrice(),
    getBitmexPrice()
  ]);

  console.log(result);
}

main();
