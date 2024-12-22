import { getInput } from '../getInput.ts';

export const day = 'day22';
export const testsPart1 = [
  { input: getInput(`src/${day}/test.txt`), result: 37327623 },
];

export const testsPart2 = [
  { input: getInput(`src/${day}/test2.txt`), result: 23 },
];

export const input = getInput(`src/${day}/input.txt`);

const cache = new Map<number, number>();

const mix = (n: number, n2: number): number => n ^ n2;

const prune = (n: number): number => n & ((1 << 24) - 1);

const generateSecret = (n: number): number => {
  if (cache.has(n)) {
    return cache.get(n)!;
  }
  let s = n;
  s = prune(mix(s, s << 6));
  s = mix(s, s >>> 5);
  s = prune(mix(s, s << 11));

  cache.set(n, s);
  return s;
};

const sellPrice = (n: number): number => n % 10;

export const part1 = (input: string[]): number => {
  const numbers = input.map((n) => Number(n));
  let result = 0;
  numbers.forEach((n) => {
    let secret = n;
    for (let i = 0; i < 2000; i += 1) {
      secret = generateSecret(secret);
    }
    result += secret;
  });
  return result;
};

export const part2 = (input: string[]): number => {
  const numbers = input.map((n) => Number(n));
  let result = 0;
  const sequencePrices: { [key: string]: number[] } = {};
  numbers.forEach((n) => {
    let secret = n;
    const previousPrices: number[] = [];
    const priceDifferences: number[] = [];
    const sequencesAlreadyFound: Set<string> = new Set();
    previousPrices.push(sellPrice(secret));
    for (let i = 0; i < 2000; i += 1) {
      secret = generateSecret(secret);
      const price = sellPrice(secret);
      previousPrices.push(price);
      priceDifferences.push(previousPrices[i + 1] - previousPrices[i]);
      if (i >= 3) {
        const [a, b, c, d] = priceDifferences.slice(-4);
        const key = `${a},${b},${c},${d}`;
        if (!sequencesAlreadyFound.has(key)) {
          if (!sequencePrices[key]) {
            sequencePrices[key] = [];
          }
          sequencePrices[key].push(price);
          sequencesAlreadyFound.add(key);
        }
      }
    }
    result += secret;
  });
  let max = 0;
  for (const key in sequencePrices) {
    const prices = sequencePrices[key];
    if (prices.length > 1) {
      const sum = prices.reduce((acc, n) => acc + n, 0);
      if (sum > max) {
        max = Math.max(max, sum);
      }
    }
  }
  return max;
};

(() => {
  console.log(`${day} part 1: ` + part1(input));
  console.log(`${day} part 2: ` + part2(input));
})();
