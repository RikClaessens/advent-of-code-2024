import { getInput } from '../getInput.ts';

export const day = 'day16';
export const testsPart1 = [
  { input: getInput(`src/${day}/test.txt`), result: 7036 },
  { input: getInput(`src/${day}/test2.txt`), result: 11048 },
];

export const testsPart2 = [
  { input: getInput(`src/${day}/test.txt`), result: 45 },
  { input: getInput(`src/${day}/test2.txt`), result: 64 },
];

export const input = getInput(`src/${day}/input.txt`);

type XY = {
  x: number;
  y: number;
};

const parseInput = (
  input: string[],
): {
  grid: string[][];
  start: XY;
  end: XY;
} => {
  const grid = input.map((line) => line.split(''));
  const startY = input.findIndex((line) => line.includes('S'));
  const startX = input[startY].split('').findIndex((char) => char === 'S');
  const endY = input.findIndex((line) => line.includes('E'));
  const endX = input[endY].split('').findIndex((char) => char === 'E');
  return {
    grid,
    start: { x: startX, y: startY },
    end: {
      x: endX,
      y: endY,
    },
  };
};

function getKey(c: XY, dir: number) {
  return `${c.x},${c.y},${dir}`;
}

const dirs = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

const getScore = (grid: string[][], start: XY, end: XY) => {
  const score = 0;

  const queue: [number, number, number, number][] = [[start.x, start.y, 1, 0]];
  const visited = new Set<string>();

  while (queue.length) {
    queue.sort((a, b) => a[3] - b[3]);

    const [x, y, dir, score] = queue.shift()!;
    const key = getKey({ x, y }, dir);

    if (x === end.x && y === end.y) {
      return score;
    }
    if (visited.has(key)) {
      continue;
    }

    visited.add(key);

    const newX = x + dirs[dir][0];
    const newY = y + dirs[dir][1];
    if (grid[newY]?.[newX] !== '#') {
      queue.push([newX, newY, dir, score + 1]);
    }

    queue.push([x, y, (dir + 1) % 4, score + 1000]);
    queue.push([x, y, (dir + 3) % 4, score + 1000]);
  }

  return score;
};

const getPaths = (
  grid: string[][],
  start: XY,
  end: XY,
  lowestScore: number,
): XY[][] => {
  const queue: [[number, number, number, number, XY[]]] = [
    [start.x, start.y, 1, 0, [start]],
  ];
  const visited = new Map<string, number>();
  const paths: XY[][] = [];

  while (queue.length) {
    const [x, y, dir, score, path] = queue.shift()!;
    const key = getKey({ x, y }, dir);

    if (score > lowestScore) continue;
    if (visited.has(key) && visited.get(key)! < score) continue;
    visited.set(key, score);

    if (x === end.x && y === end.y && score === lowestScore) {
      paths.push(path);
      continue;
    }

    const nx = x + dirs[dir][0];
    const ny = y + dirs[dir][1];
    if (grid[ny]?.[nx] !== '#') {
      queue.push([nx, ny, dir, score + 1, [...path, { x: nx, y: ny }]]);
    }

    queue.push([x, y, (dir + 1) % 4, score + 1000, [...path]]);
    queue.push([x, y, (dir + 3) % 4, score + 1000, [...path]]);
  }

  return paths;
};

export const part1 = (input: string[]): number => {
  const { grid, start, end } = parseInput(input);
  return getScore(grid, start, end);
};

export const part2 = (input: string[]) => {
  const { grid, start, end } = parseInput(input);
  const lowestScore = getScore(grid, start, end);
  const paths = getPaths(grid, start, end, lowestScore);
  const uniquePaths = new Set<string>();
  paths.forEach((path) => {
    path.forEach((p) => uniquePaths.add(getKey(p, 0)));
  });
  return uniquePaths.size;
};

(() => {
  console.log(`${day} part 1: ` + part1(input));
  console.log(`${day} part 2: ` + part2(input));
})();
