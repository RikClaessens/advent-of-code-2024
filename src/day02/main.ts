import { getInput } from '../getInput.ts';

export const day = 'day02';
export const testsPart1 = [
  { input: getInput(`src/${day}/test.txt`), result: 2 },
];

export const testsPart2 = [
  { input: getInput(`src/${day}/test.txt`), result: 4 },
];

export const input = getInput(`src/${day}/input.txt`);

const isSafeReport = (
  numbers: number[],
  problemDampener: boolean = false,
): boolean => {
  const increase = numbers[1] > numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    if (
      (increase && numbers[i] < numbers[i - 1]) ||
      (!increase && numbers[i] > numbers[i - 1]) ||
      numbers[i] === numbers[i - 1] ||
      Math.abs(numbers[i] - numbers[i - 1]) > 3
    ) {
      if (problemDampener) {
        for (let j = 0; j < numbers.length; j++) {
          if (isSafeReport(numbers.slice(0, j).concat(numbers.slice(j + 1)))) {
            return true;
          }
        }
      }
      return false;
    }
  }
  return true;
};

export const part1 = (input: string[]): number => {
  let numberOfSafeReports = 0;
  const reports = input.map((line) =>
    line.split(' ').map((x) => Number.parseInt(x)),
  );

  reports.forEach((report) => {
    if (isSafeReport(report)) {
      numberOfSafeReports++;
    }
  });
  return numberOfSafeReports;
};

export const part2 = (input: string[]): number => {
  let numberOfSafeReports = 0;
  const reports = input.map((line) =>
    line.split(' ').map((x) => Number.parseInt(x)),
  );

  reports.forEach((report) => {
    if (isSafeReport(report, true)) {
      numberOfSafeReports++;
    }
  });
  return numberOfSafeReports;
};

(() => {
  console.log(`${day} part 1: ` + part1(input));
  console.log(`${day} part 2: ` + part2(input));
})();
