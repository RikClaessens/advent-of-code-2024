import { getInput } from '../getInput.ts';

export const day = 'dayxx';
export const testsPart1 = [
  { input: getInput(`src/${day}/test.txt`), result: 0 },
];

export const testsPart2 = [
  { input: getInput(`src/${day}/test.txt`), result: 0 },
];

export const input = getInput(`src/${day}/input.txt`);

export const part1 = (input: string[]): number => {
  return 0;
};

export const part2 = (input: string[]): number => {
  return 0;
};

(() => {
  console.log(`${day} part 1: ` + part1(input));
  console.log(`${day} part 2: ` + part2(input));
})();
