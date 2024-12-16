import { getInputAsString } from '../getInput.ts';

export const day = 'day15';
export const testsPart1 = [
  // { input: getInputAsString(`src/${day}/test.txt`), result: 10092 },
  // { input: getInputAsString(`src/${day}/test2.txt`), result: 2028 },
];

export const testsPart2 = [
  // { input: getInputAsString(`src/${day}/test3.txt`), result: 0 },
  // { input: getInputAsString(`src/${day}/test.txt`), result: 9021 },
];

export const input = getInputAsString(`src/${day}/test.txt`);

type XY = {
  x: number;
  y: number;
};

type Map = string[][];

const dirs: Record<string, XY> = {
  '^': { x: 0, y: -1 },
  '>': { x: 1, y: 0 },
  v: { x: 0, y: 1 },
  '<': { x: -1, y: 0 },
} as const;

const getMap = (input: string): Map =>
  input.split('\n').map((row) => row.split(''));

const getInstructions = (input: string): string => input.split('\n').join('');

const getRobotPosition = (map: Map): XY => {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === '@') {
        return { x, y };
      }
    }
  }
  return { x: -1, y: -1 };
};

const move = (
  map: Map,
  robot: XY,
  instruction: string,
): { map: Map; robot: XY } => {
  const boxesToMove = [];
  const { x: ix, y: iy } = dirs[instruction];
  let x = robot.x + ix,
    y = robot.y + iy;

  while (map[y][x] === 'O') {
    boxesToMove.push({ x, y });
    x += ix;
    y += iy;
  }

  if (map[y][x] === '#') {
    return { map, robot };
  }
  boxesToMove.forEach((box) => {
    map[box.y + iy][box.x + ix] = 'O';
  });
  map[robot.y + iy][robot.x + ix] = '@';
  map[robot.y][robot.x] = '.';
  robot.x += ix;
  robot.y += iy;

  return { map, robot };
};

const move2 = (
  map: Map,
  robot: XY,
  instruction: string,
): { map: Map; robot: XY } => {
  const { x: ix, y: iy } = dirs[instruction];

  if (map[robot.y + iy][robot.x + ix] === '#') {
    return { map, robot };
  } else if (map[robot.y + iy][robot.x + ix] === '.') {
    map[robot.y + iy][robot.x + ix] = '@';
    map[robot.y][robot.x] = '.';
    robot.x += ix;
    robot.y += iy;
    return { map, robot };
  }

  let robotCanMove = true;
  const boxesToMove: XY[] = [];

  if (map[robot.y + iy][robot.x + ix] === '[') {
    boxesToMove.push({ x: robot.x + ix, y: robot.y + iy });
  } else if (map[robot.y + iy][robot.x + ix] === ']') {
    boxesToMove.push({ x: robot.x + ix - 1, y: robot.y + iy });
  }

  const finalBoxes = new Set<string>(
    boxesToMove.map((box) => `${box.x},${box.y}`),
  );

  const isVertical = Math.abs(iy) > 0;

  while (boxesToMove.length > 0) {
    const boxToMove = boxesToMove.shift();
    if (!boxToMove) break;
    if (
      map[boxToMove.y + iy][boxToMove.x + 2 * ix] === '#' ||
      map[boxToMove.y + iy][boxToMove.x + 2 * ix + 1] === '#'
    ) {
      robotCanMove = false;
      break;
    } else if (isVertical) {
      [-1, 0, 1].forEach((dx) => {
        if (map[boxToMove.y + iy][boxToMove.x + dx] === '[') {
          boxesToMove.push({ x: boxToMove.x + dx, y: boxToMove.y + iy });
          finalBoxes.add(`${boxToMove.x + dx},${boxToMove.y + iy}`);
        }
      });
    } else {
      if (map[boxToMove.y][boxToMove.x + 2 * ix] === '[') {
        boxesToMove.push({ x: boxToMove.x + 2 * ix, y: boxToMove.y });
        finalBoxes.add(`${boxToMove.x + 2 * ix},${boxToMove.y}`);
      }
    }
  }

  const finalMoves = Array.from(finalBoxes).map((box) => {
    const [x, y] = box.split(',').map(Number);
    return { x, y };
  });

  console.log(finalMoves, robotCanMove);

  if (robotCanMove) {
    finalMoves.forEach((box) => {
      map[box.y][box.x] = '.';
      map[box.y][box.x + 1] = '.';
    });
    finalMoves.forEach((box) => {
      map[box.y + iy][box.x + ix] = '[';
      map[box.y + iy][box.x + ix + 1] = ']';
    });
    map[robot.y + iy][robot.x + ix] = '@';
    map[robot.y][robot.x] = '.';
    robot.x += ix;
    robot.y += iy;
  }

  return { map, robot };
};

const getGPS = (map: Map): number => {
  let gps = 0;
  for (let y = 1; y < map.length - 1; y++) {
    for (let x = 1; x < map[0].length - 1; x++) {
      if (map[y][x] === 'O' || map[y][x] === '[') {
        gps += 100 * y + x;
      }
    }
  }
  return gps;
};

const expandMap = (map: Map): Map => {
  const expandedMap = new Array(map.length)
    .fill('.')
    .map(() => new Array(map[0].length * 2).fill('.'));
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === '#') {
        expandedMap[y][2 * x] = '#';
        expandedMap[y][2 * x + 1] = '#';
      } else if (map[y][x] === 'O') {
        expandedMap[y][2 * x] = '[';
        expandedMap[y][2 * x + 1] = ']';
      } else if (map[y][x] === '@') {
        expandedMap[y][2 * x] = '@';
      }
    }
  }
  return expandedMap;
};

const printMap = (map: string[][]) => {
  map.forEach((row) => {
    console.log(row.join(''));
  });
};

export const part1 = (input: string): number => {
  const map = getMap(input.split('\n\n')[0]);
  let mapState = {
    map,
    robot: getRobotPosition(map),
  };
  const instructions = getInstructions(input.split('\n\n')[1]);
  instructions.split('').forEach((instruction) => {
    mapState = move(mapState.map, mapState.robot, instruction);
  });
  return getGPS(mapState.map);
};

export const part2 = (input: string): number => {
  const map = getMap(input.split('\n\n')[0]);
  let mapState = {
    map,
    robot: { x: 0, y: 0 },
  };
  const instructions = getInstructions(input.split('\n\n')[1]);
  mapState.map = expandMap(map);
  mapState.robot = getRobotPosition(mapState.map);
  printMap(mapState.map);
  instructions
    .split('')
    .slice(0, 200)
    .forEach((instruction, i) => {
      console.log(`\nMove ${i}: ${instruction}`);
      mapState = move2(mapState.map, mapState.robot, instruction);
      printMap(mapState.map);
    });
  printMap(mapState.map);
  return getGPS(mapState.map);
};

(() => {
  console.log(`${day} part 1: ` + part1(input));
  console.log(`${day} part 2: ` + part2(input)); // 1512860
})();
