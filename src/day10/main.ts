import { getInput } from '../getInput.ts';

export const day = 'day10';
export const testsPart1 = [
  { input: getInput(`src/${day}/test.txt`), result: 1 },
  { input: getInput(`src/${day}/test2.txt`), result: 2 },
  { input: getInput(`src/${day}/test3.txt`), result: 4 },
  { input: getInput(`src/${day}/test4.txt`), result: 3 },
  { input: getInput(`src/${day}/test5.txt`), result: 36 },
];

export const testsPart2 = [
  { input: getInput(`src/${day}/test6.txt`), result: 3 },
  { input: getInput(`src/${day}/test3.txt`), result: 13 },
  { input: getInput(`src/${day}/test7.txt`), result: 227 },
  { input: getInput(`src/${day}/test5.txt`), result: 81 },
];

export const input = getInput(`src/${day}/input.txt`);

const parseMap = (input: string[]): number[][] => {
  return input.map((line) =>
    line.split('').map((n) => (n === '.' ? -1 : Number.parseInt(n))),
  );
};

type Pos = { x: number; y: number };

const directions: Pos[] = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
];

const explore = (
  map: number[][],
  x: number,
  y: number,
  route: Set<string>,
  trailEnds: string[],
): string[] => {
  if (map[y][x] === 9) {
    return [...trailEnds, `${x},${y}`];
  }

  const h = map[y][x];
  directions.forEach((dir) => {
    const newX = x + dir.x,
      newY = y + dir.y;
    if (newX >= 0 && newX < map[0].length && newY >= 0 && newY < map.length) {
      if (map[newY][newX] === h + 1 && !route.has(`${newX},${newY}`)) {
        const newRoute = new Set(route).add(`${newX},${newY}`);
        trailEnds = explore(map, newX, newY, newRoute, trailEnds);
      }
    }
  });

  return trailEnds;
};

const getTrailHeads = (map: number[][]): Pos[] => {
  const trailHeads = [];
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === 0) {
        trailHeads.push({ x, y });
      }
    }
  }
  return trailHeads;
};

export const part1 = (input: string[]): number => {
  const map = parseMap(input);
  let count = 0;

  getTrailHeads(map).forEach(({ x, y }) => {
    const highpoints = new Set<string>(
      explore(map, x, y, new Set<string>(), []),
    );
    count += highpoints.size;
  });

  return count;
};

export const part2 = (input: string[]): number => {
  const map = parseMap(input);
  let count = 0;

  getTrailHeads(map).forEach(({ x, y }) => {
    count += explore(map, x, y, new Set<string>(), []).length;
  });

  return count;
};

(() => {
  console.log(`${day} part 1: ` + part1(input));
  console.log(`${day} part 2: ` + part2(input));
})();
