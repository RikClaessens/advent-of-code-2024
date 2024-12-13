import { getInput } from '../getInput.ts';

export const day = 'day13';
export const testsPart1 = [
  { input: getInput(`src/${day}/test.txt`), result: 480 },
];

export const testsPart2 = [];

export const input = getInput(`src/${day}/input.txt`);

type Pos = { x: number; y: number };

type ClawMachine = {
  a: Pos;
  b: Pos;
  prize: Pos;
};

const getPos = (input: string, extraPos: number): Pos => {
  const x =
    Number.parseInt(
      input.substring(input.indexOf('X') + 2, input.indexOf(',')),
    ) + extraPos;
  const y = Number.parseInt(input.substring(input.indexOf('Y') + 2)) + extraPos;
  return { x, y };
};

const parseInput = (input: string[], extraPos = 0): ClawMachine[] => {
  const clawMachines: ClawMachine[] = [];
  for (let i = 0; i < input.length; i += 4) {
    clawMachines.push({
      a: getPos(input[i], 0),
      b: getPos(input[i + 1], 0),
      prize: getPos(input[i + 2], extraPos),
    });
  }
  return clawMachines;
};

const getTokensToWin = (clawMachine: ClawMachine) => {
  const { a, b, prize: p } = clawMachine;

  const pushA = (p.x * b.y - p.y * b.x) / (a.x * b.y - a.y * b.x);
  const pushB = (a.x * p.y - a.y * p.x) / (a.x * b.y - a.y * b.x);

  if (Number.isInteger(pushA) && Number.isInteger(pushB)) {
    return pushA * 3 + pushB;
  }
  return 0;
};

export const part1 = (input: string[]): number => {
  const clawMachines = parseInput(input);
  return clawMachines.reduce(
    (acc, clawMachine) => acc + getTokensToWin(clawMachine),
    0,
  );
};

export const part2 = (input: string[]): number => {
  const clawMachines = parseInput(input, 10000000000000);
  return clawMachines.reduce(
    (acc, clawMachine) => acc + getTokensToWin(clawMachine),
    0,
  );
};

(() => {
  console.log(`${day} part 1: ` + part1(input));
  console.log(`${day} part 2: ` + part2(input));
})();
