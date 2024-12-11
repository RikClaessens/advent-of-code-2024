import { getInput } from '../getInput.ts';

export const day = 'day11';
export const testsPart1 = [
  { input: getInput(`src/${day}/test.txt`), result: 55312 },
];

export const testsPart2 = [
  // { input: getInput(`src/${day}/test.txt`), result: 55312 },
];

export const input = getInput(`src/${day}/input.txt`);

const getStones = (input: string): number[] => {
  return input.split(' ').map((s) => parseInt(s));
};

const blink = (stones: number[]): number[] => {
  const result: number[] = [];

  for (const stone of stones) {
    if (stone === 0) {
      // Rule 1
      result.push(1);
    } else if (stone.toString().length % 2 === 0) {
      // Rule 2
      const stoneStr = stone.toString();
      const half = stoneStr.length / 2;
      const left = parseInt(stoneStr.slice(0, half));
      const right = parseInt(stoneStr.slice(half));
      result.push(left, right);
    } else {
      // Rule 3
      result.push(stone * 2024);
    }
  }

  return result;
};

const doBlinks = (stones: number[], numberOfBlinks: number): number[] => {
  for (let i = 0; i < numberOfBlinks; i++) {
    stones = blink(stones);
  }
  return stones;
};

const recursiveResults = new Map<string, number>();
const blinkRecursive = (stone: number, numberOfBlinks: number): number => {
  if (numberOfBlinks === 0) {
    return 1;
  }
  const recursiveResult = recursiveResults.get(`${stone}-${numberOfBlinks}`);
  if (recursiveResult) {
    return recursiveResult;
  }
  if (stone === 0) {
    const result = blinkRecursive(1, numberOfBlinks - 1);
    recursiveResults.set(`${stone}-${numberOfBlinks}`, result);
    return result;
  }
  if (stone.toString().length % 2 === 0) {
    const stoneStr = stone.toString();
    const half = stoneStr.length / 2;
    const left = parseInt(stoneStr.slice(0, half));
    const right = parseInt(stoneStr.slice(half));
    const resultLeft = blinkRecursive(left, numberOfBlinks - 1);
    const resultRight = blinkRecursive(right, numberOfBlinks - 1);
    recursiveResults.set(`${left}-${numberOfBlinks - 1}`, resultLeft);
    recursiveResults.set(`${right}-${numberOfBlinks - 1}`, resultRight);
    return (
      blinkRecursive(left, numberOfBlinks - 1) +
      blinkRecursive(right, numberOfBlinks - 1)
    );
  }
  const result = blinkRecursive(stone * 2024, numberOfBlinks - 1);
  recursiveResults.set(`${stone}-${numberOfBlinks}`, result);
  return blinkRecursive(stone * 2024, numberOfBlinks - 1);
};

const doBlinksRecursive = (
  stones: number[],
  numberOfBlinks: number,
): number => {
  recursiveResults.clear();
  return stones.reduce(
    (acc, stone) => (acc += blinkRecursive(stone, numberOfBlinks)),
    0,
  );
};

export const part1 = (input: string[]): number => {
  const stones = getStones(input[0]);
  return doBlinks(stones, 25).length;
};

export const part2 = (input: string[]): number => {
  const stones = getStones(input[0]);
  return doBlinksRecursive(stones, 75);
};

(() => {
  console.log(`${day} part 1: ` + part1(input));
  console.log(`${day} part 2: ` + part2(input));
})();

// 65601038650482 too low
// 99661069994256 too low
// 394290930420488 not right
