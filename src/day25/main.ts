import { getInputAsString } from '../getInput.ts';

export const day = 'day25';
export const testsPart1 = [
  { input: getInputAsString(`src/${day}/test.txt`), result: 3 },
];

export const testsPart2 = [];

type KL = [number, number, number, number, number];

export const input = getInputAsString(`src/${day}/input.txt`);

const getLocksAndKeys = (input: string): { locks: KL[]; keys: KL[] } => {
  const locks: KL[] = [];
  const keys: KL[] = [];
  input.split('\n\n').forEach((keyOrLock) => {
    const kl = keyOrLock.split('\n');
    if (kl[0] === '#####') {
      locks.push([-1, -1, -1, -1, -1]);
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 7; j++) {
          locks[locks.length - 1][i] += kl[j][i] === '#' ? 1 : 0;
        }
      }
    } else {
      keys.push([-1, -1, -1, -1, -1]);
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 7; j++) {
          keys[keys.length - 1][i] += kl[j][i] === '#' ? 1 : 0;
        }
      }
    }
  });
  return { locks, keys };
};
export const part1 = (input: string): number => {
  const { locks, keys } = getLocksAndKeys(input);
  let count = 0;
  locks.forEach((lock) => {
    keys.forEach((key) => {
      if (key.every((k, i) => k + lock[i] <= 5)) {
        count++;
      }
    });
  });
  return count;
};

(() => {
  console.log(`${day} part 1: ` + part1(input));
})();
