import { getInputAsString } from '../getInput.ts';

export const day = 'day19';
export const testsPart1 = [
  { input: getInputAsString(`src/${day}/test.txt`), result: 6 },
];

export const testsPart2 = [
  { input: getInputAsString(`src/${day}/test.txt`), result: 16 },
];

export const input = getInputAsString(`src/${day}/input.txt`);

const parseInput = (input: string): { towels: string[]; designs: string[] } => {
  const towels = input.split('\n\n')[0].split(', ');
  const designs = input.split('\n\n')[1].split('\n');
  return { towels, designs };
};

const matchDesign = (
  towels: string[],
  design: string,
  returnOnMatch: boolean = false,
): number => {
  if (design === '') {
    return 1;
  }
  if (cache[design] !== undefined) {
    return cache[design];
  }
  let count = 0;
  for (let i = 0; i < towels.length; i++) {
    const towel = towels[i];
    if (design.startsWith(towel)) {
      count += matchDesign(towels, design.slice(towel.length), returnOnMatch);
      if (returnOnMatch && count > 0) {
        return count;
      }
    }
  }
  cache[design] = count;
  return count;
};

export const part1 = (input: string): number => {
  const { towels, designs } = parseInput(input);
  let count = 0;

  cache = {};
  for (let i = 0; i < designs.length; i++) {
    const matched = matchDesign(towels, designs[i], true);
    if (matched > 0) {
      count += 1;
    }
  }

  return count;
};

let cache: { [key: string]: number } = {};

export const part2 = (input: string): number => {
  const { towels, designs } = parseInput(input);
  let count = 0;

  cache = {};
  for (let i = 0; i < designs.length; i++) {
    const matched = matchDesign(towels, designs[i]);
    if (matched > 0) {
      count += matched;
    }
  }

  return count;
};

(() => {
  console.log(`${day} part 1: ` + part1(input));
  console.log(`${day} part 2: ` + part2(input));
})();
