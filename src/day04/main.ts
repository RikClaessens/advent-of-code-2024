import { getInput } from '../getInput.ts';

export const day = 'day04';
export const testsPart1 = [
  { input: getInput(`src/${day}/test.txt`), result: 18 },
];

export const testsPart2 = [
  { input: getInput(`src/${day}/test.txt`), result: 9 },
];

export const input = getInput(`src/${day}/input.txt`);

const get = (l: string[][], i: number, j: number) => {
  if (i < 0 || i >= l.length || j < 0 || j >= l[0].length) {
    return '0';
  }
  return l[i][j];
};

const sort = (s: string) => s.split('').sort().join('');

export const part1 = (input: string[]): number => {
  const l = input.map((line) => line.split(''));
  let count = 0;

  for (let i = 0; i < l.length; i++) {
    for (let j = 0; j < l[0].length; j++) {
      if (l[i][j] === 'X') {
        // search right
        if (
          get(l, i, j + 1) === 'M' &&
          get(l, i, j + 2) === 'A' &&
          get(l, i, j + 3) === 'S'
        ) {
          count++;
        }
        // search down
        if (
          get(l, i + 1, j) === 'M' &&
          get(l, i + 2, j) === 'A' &&
          get(l, i + 3, j) === 'S'
        ) {
          count++;
        }
        // search left
        if (
          get(l, i, j - 1) === 'M' &&
          get(l, i, j - 2) === 'A' &&
          get(l, i, j - 3) === 'S'
        ) {
          count++;
        }
        // search up
        if (
          get(l, i - 1, j) === 'M' &&
          get(l, i - 2, j) === 'A' &&
          get(l, i - 3, j) === 'S'
        ) {
          count++;
        }
        // search diagonal down right
        if (
          get(l, i + 1, j + 1) === 'M' &&
          get(l, i + 2, j + 2) === 'A' &&
          get(l, i + 3, j + 3) === 'S'
        ) {
          count++;
        }
        // search diagonal down left
        if (
          get(l, i + 1, j - 1) === 'M' &&
          get(l, i + 2, j - 2) === 'A' &&
          get(l, i + 3, j - 3) === 'S'
        ) {
          count++;
        }
        // search diagonal up right
        if (
          get(l, i - 1, j + 1) === 'M' &&
          get(l, i - 2, j + 2) === 'A' &&
          get(l, i - 3, j + 3) === 'S'
        ) {
          count++;
        }
        // search diagonal up left
        if (
          get(l, i - 1, j - 1) === 'M' &&
          get(l, i - 2, j - 2) === 'A' &&
          get(l, i - 3, j - 3) === 'S'
        ) {
          count++;
        }
      }
    }
  }
  return count;
};

export const part2 = (input: string[]): number => {
  const l = input.map((line) => line.split(''));
  let count = 0;

  for (let i = 0; i < l.length; i++) {
    for (let j = 0; j < l[0].length; j++) {
      if (l[i][j] === 'A') {
        const ltbr = sort(`${get(l, i - 1, j - 1)}${get(l, i + 1, j + 1)}`);
        const rtbl = sort(`${get(l, i - 1, j + 1)}${get(l, i + 1, j - 1)}`);
        if (ltbr === 'MS' && rtbl === 'MS') {
          count++;
        }
      }
    }
  }
  return count;
};

(() => {
  console.log(`${day} part 1: ` + part1(input));
  console.log(`${day} part 2: ` + part2(input));
})();
