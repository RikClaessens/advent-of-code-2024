import { getInput } from '../getInput.ts';

export const day = 'day21';
export const testsPart1 = [
  { input: getInput(`src/${day}/test.txt`), result: 126384 },
];

export const testsPart2 = [];

export const input = getInput(`src/${day}/input.txt`);

const numPad = [
  ['#', '#', '#', '#', '#'],
  ['#', '7', '8', '9', '#'],
  ['#', '4', '5', '6', '#'],
  ['#', '1', '2', '3', '#'],
  ['#', '#', '0', 'A', '#'],
  ['#', '#', '#', '#', '#'],
];

const dirPad = [
  ['#', '#', '#', '#', '#'],
  ['#', '#', '^', 'A', '#'],
  ['#', '<', 'v', '>', '#'],
  ['#', '#', '#', '#', '#'],
];

const dirs = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

const dirChars = ['^', '>', 'v', '<'];

type Node = {
  x: number;
  y: number;
  path: string[];
  cost: number;
  dirId?: number;
};

const bfs = (map: string[][], startKey: string, endKey: string): string[] => {
  const startY = map.findIndex((line) => line.includes(startKey));
  const startX = map[startY].indexOf(startKey);

  let current: Node | undefined = undefined;
  const visited: { [key: string]: number } = {};
  let paths: string[][] = [];
  const queue: Node[] = [
    {
      x: startX,
      y: startY,
      path: [],
      cost: 0,
      dirId: undefined,
    },
  ];
  let minLength = Infinity;

  while ((current = queue.shift())) {
    if (!current) {
      break;
    }
    if (current.dirId !== undefined) {
      current.path.push(dirChars[current.dirId]);
    }
    if (map[current.y][current.x] === endKey) {
      if (current.cost < minLength) {
        paths = [];
        minLength = current.cost;
      }
      if (current.cost === minLength) {
        paths.push(current.path);
      }
      continue;
    }

    const key = [current.x, current.y].join('_');
    if (visited[key] < current.cost) {
      continue;
    }
    visited[key] = current.cost;
    if (current.cost > minLength) {
      continue;
    }

    dirs.forEach((d, dirId) => {
      if (!current) return;
      const p = [current.x + d[0], current.y + d[1]];
      if (map[p[1]][p[0]] == '#') return true;
      queue.push({
        path: current.path.slice(),
        x: p[0],
        y: p[1],
        dirId,
        cost: current.cost + 1,
      });
    });
  }

  return paths.map((p) => p.join('') + 'A');
};

const typeCode = (code: string, pad: string[][], depth: number = 2): number => {
  const cacheKey = `${code}-${depth}`;
  if (cache[cacheKey] !== undefined) {
    return cache[cacheKey];
  }

  let currentC = 'A';
  let length = 0;

  code.split('').forEach((c) => {
    const paths = bfs(pad, currentC, c);
    if (depth === 0) {
      length += paths[0].length;
    } else {
      length += Math.min(
        ...paths.map((path) => typeCode(path, dirPad, depth - 1)),
      );
    }
    currentC = c;
  });

  cache[cacheKey] = length;

  return length;
};

let cache: { [key: string]: number } = {};

export const part1 = (input: string[]): number => {
  cache = {};
  return input.reduce(
    (acc, code) =>
      acc + parseInt(code.substring(0, 3)) * typeCode(code, numPad, 2),
    0,
  );
};

export const part2 = (input: string[]): number => {
  cache = {};
  return input.reduce(
    (acc, code) =>
      acc + parseInt(code.substring(0, 3)) * typeCode(code, numPad, 25),
    0,
  );
};

(() => {
  console.log(`${day} part 1: ` + part1(input));
  console.log(`${day} part 2: ` + part2(input));
})();
