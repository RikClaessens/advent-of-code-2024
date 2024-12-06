import { getInput } from '../getInput.ts';

export const day = 'day06';
export const testsPart1 = [
  { input: getInput(`src/${day}/test.txt`), result: 41 },
];

export const testsPart2 = [
  { input: getInput(`src/${day}/test.txt`), result: 6 },
];

export const input = getInput(`src/${day}/input.txt`);

type Position = {
  x: number;
  y: number;
};

type Direction = {
  dx: number;
  dy: number;
};

const parseMap = (
  input: string[],
): { map: string[][]; guardPos: Position; guardDir: Direction } => {
  const map = [] as string[][];
  const guardDir = { dx: 0, dy: -1 };
  let guardPos = { x: 0, y: 0 };

  input.forEach((line) => {
    map.push(line.split('').map((s) => s.replace('^', '.')));
    if (line.includes('^')) {
      guardPos = { x: line.indexOf('^'), y: map.length - 1 };
    }
  });

  return { map, guardPos, guardDir };
};

const printMap = (map: string[][], pos: Position): void => {
  map.forEach((line, y) => {
    let print = '';
    line.forEach((c, x) => {
      if (pos.x === x && pos.y === y) {
        print += 'G';
      } else {
        print += c;
      }
    });
    console.log(print);
  });
  console.log('\n');
};

const printMapVisits = (
  map: string[][],
  mapVisits: Set<string>,
  pos: Position,
): void => {
  const mapWithVisits = [] as string[][];
  map.forEach((line) => {
    mapWithVisits.push(line.map((s) => s));
  });
  mapVisits.forEach((visit) => {
    const x = parseInt(visit.split(',')[0]);
    const y = parseInt(visit.split(',')[1]);
    mapWithVisits[y][x] = 'X';
  });
  printMap(mapWithVisits, pos);
};

// top 0 -1 -> 1 0
// right 1 0 -> 0 1
// bottom 0 1 -> -1 0
// left -1 0 -> 0 -1
const turnRight = (dir: Direction): Direction => ({ dx: -dir.dy, dy: dir.dx });

const explore = (guardDir: Direction, guardPos: Position, map: string[][]) => {
  let dir = { ...guardDir };
  const pos = { ...guardPos };
  const mapVisits = new Set<string>();
  mapVisits.add(`${pos.x},${pos.y}`);
  const steps = new Set<string>();
  steps.add(`${pos.x},${pos.y},${dir.dx},${dir.dy}`);
  let loop = false;

  while (
    pos.x >= 0 &&
    pos.x < map[0].length &&
    pos.y >= 0 &&
    pos.y < map.length &&
    pos.x + dir.dx >= 0 &&
    pos.x + dir.dx < map[0].length &&
    pos.y + dir.dy >= 0 &&
    pos.y + dir.dy < map.length
  ) {
    if (map[pos.y + dir.dy][pos.x + dir.dx] === '#') {
      dir = turnRight(dir);
    } else {
      pos.x += dir.dx;
      pos.y += dir.dy;
      mapVisits.add(`${pos.x},${pos.y}`);
      const newStep = `${pos.x},${pos.y},${dir.dx},${dir.dy}`;
      if (steps.has(newStep)) {
        loop = true;
        break;
      }
      steps.add(newStep);
    }
  }

  return { mapVisits, steps, loop };
};

export const part1 = (input: string[]): number => {
  const { map, guardPos, guardDir } = parseMap(input);
  const { mapVisits } = explore(guardDir, guardPos, map);

  return mapVisits.size;
};

export const parseStep = (
  step: string,
): { x: number; y: number; dx: number; dy: number } => {
  const [x, y, dx, dy] = step.split(',').map((s) => parseInt(s));
  return { x, y, dx, dy };
};

export const part2 = (input: string[]): number => {
  const { map, guardPos, guardDir } = parseMap(input);

  const loops = new Set<string>();
  for (let dy = 0; dy < map.length; dy++) {
    for (let dx = 0; dx < map[0].length; dx++) {
      if (dx >= 0 && dx < map[0].length && dy >= 0 && dy < map.length) {
        const newMap = [] as string[][];
        map.forEach((line) => {
          newMap.push(line.map((s) => s));
        });
        newMap[dy][dx] = '#';
        const { loop } = explore(guardDir, guardPos, newMap);
        if (loop) {
          loops.add(`${dx},${dy}`);
        }
      }
    }
  }

  return loops.size;
};

(() => {
  console.log(`${day} part 1: ` + part1(input));
  console.log(`${day} part 2: ` + part2(input));
})();
