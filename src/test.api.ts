import {
  getPrice,
  getBinancePrice,
  // getBitoPrice,
  // getBitmexPrice,
  getBitmexPrice_v2
} from "./api";

async function main() {
  const result = await Promise.all([
    getPrice("eth"),
    getBinancePrice(),
    getBitmexPrice_v2()
  ]);

  console.log(result);
}

main();
