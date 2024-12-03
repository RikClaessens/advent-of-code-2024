import { getInput } from '../getInput.ts';

export const day = 'day03';
export const testsPart1 = [
  { input: getInput(`src/${day}/test.txt`), result: 161 },
];

export const testsPart2 = [
  { input: getInput(`src/${day}/test2.txt`), result: 48 },
];

export const input = getInput(`src/${day}/input.txt`);

export const part1 = (input: string[]): number => {
  let sum = 0;
  input.forEach((line) => {
    const matches = line.matchAll(/mul\((\d+),(\d+)\)/g);
    matches.forEach((match) => {
      sum += parseInt(match[1]) * parseInt(match[2]);
    });
  });
  return sum;
};

export const part2 = (input: string[]): number => {
  let startIndex = 0;
  let doMul = true;

  let sum = 0;
  input.forEach((line) => {
    startIndex = 0;
    while (startIndex < line.length) {
      const lineToMatch = line.substring(startIndex);
      const mulMatch = lineToMatch.matchAll(/mul\((\d+),(\d+)\)/g).next();
      const doMatch = lineToMatch.matchAll(/do\(\)/g).next();
      const dontMatch = lineToMatch.matchAll(/don\'t\(\)/g).next();

      const mulMatchIndex = mulMatch.done
        ? Number.MAX_SAFE_INTEGER
        : mulMatch.value.index;
      const doMatchIndex = doMatch.done
        ? Number.MAX_SAFE_INTEGER
        : doMatch.value.index;
      const dontMatchIndex = dontMatch.done
        ? Number.MAX_SAFE_INTEGER
        : dontMatch.value.index;
      if (
        doMul &&
        mulMatchIndex < doMatchIndex &&
        mulMatchIndex < dontMatchIndex &&
        mulMatch.value
      ) {
        sum += parseInt(mulMatch.value?.[1]) * parseInt(mulMatch.value?.[2]);
        startIndex += mulMatchIndex + mulMatch.value?.[0].length;
      } else if (doMatchIndex < dontMatchIndex) {
        doMul = true;
        startIndex += doMatchIndex + 4;
      } else {
        doMul = false;
        startIndex += dontMatchIndex + 7;
      }
    }
  });
  return sum;
};

(() => {
  console.log(`${day} part 1: ` + part1(input));
  console.log(`${day} part 2: ` + part2(input));
})();
