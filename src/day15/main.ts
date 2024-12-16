import { getInputAsString } from '../getInput.ts';

export const day = 'day15';
export const testsPart1 = [
  { input: getInputAsString(`src/${day}/test.txt`), result: 10092 },
  { input: getInputAsString(`src/${day}/test2.txt`), result: 2028 },
];

export const testsPart2 = [
  { input: getInputAsString(`src/${day}/test.txt`), result: 9021 },
];

export const input = getInputAsString(`src/${day}/input.txt`);

type XY = {
  x: number;
  y: number;
};

type Rect = {
  id: number;
  pos: XY;
  size: XY;
};

type Map = {
  walls: Rect[];
  boxes: Rect[];
  robot: Rect;
};

const dirs: Record<string, XY> = {
  '^': { x: 0, y: -1 },
  '>': { x: 1, y: 0 },
  v: { x: 0, y: 1 },
  '<': { x: -1, y: 0 },
} as const;

const getMap = (input: string): Map => {
  const m = input.split('\n');
  const map: Map = {
    walls: [],
    boxes: [],
    robot: { id: 0, pos: { x: 0, y: 0 }, size: { x: 1, y: 1 } },
  };
  for (let y = 0; y < m.length; y++) {
    for (let x = 0; x < m[0].length; x++) {
      if (m[y][x] === '#') {
        map.walls.push({
          id: map.walls.length,
          pos: { x, y },
          size: { x: 1, y: 1 },
        });
      } else if (m[y][x] === 'O') {
        map.boxes.push({
          id: map.boxes.length,
          pos: { x, y },
          size: { x: 1, y: 1 },
        });
      } else if (m[y][x] === '@') {
        map.robot = { id: 0, pos: { x, y }, size: { x: 1, y: 1 } };
      }
    }
  }
  return map;
};

const getInstructions = (input: string): string => input.split('\n').join('');

const doesCollide = (rect1: Rect, rect2: Rect): boolean => {
  return (
    rect1.pos.x < rect2.pos.x + rect2.size.x &&
    rect1.pos.x + rect1.size.x > rect2.pos.x &&
    rect1.pos.y < rect2.pos.y + rect2.size.y &&
    rect1.pos.y + rect1.size.y > rect2.pos.y
  );
};

const move = (map: Map, instruction: string): Map => {
  const i = dirs[instruction];

  const newRobot = {
    ...map.robot,
    pos: { x: map.robot.pos.x + i.x, y: map.robot.pos.y + i.y },
  };

  // if the robot collides with a wall, return the map as is
  if (map.walls.some((wall) => doesCollide(wall, newRobot))) {
    return map;
  }

  // if the robot does not collide with a box, move the robot
  const boxCollission = map.boxes.find((box) => doesCollide(box, newRobot));
  if (!boxCollission) {
    map.robot = newRobot;
    return map;
  }

  let robotCanMove = true;
  let boxesToMove = [boxCollission];
  let boxToMoveIndex = 0;

  while (boxToMoveIndex < boxesToMove.length) {
    const boxToMove = boxesToMove[boxToMoveIndex];
    const newBox = {
      ...boxToMove,
      pos: { x: boxToMove.pos.x + i.x, y: boxToMove.pos.y + i.y },
    };

    if (map.walls.some((wall) => doesCollide(wall, newBox))) {
      robotCanMove = false;
      break;
    }

    const boxCollissions = map.boxes.filter(
      (box) => box.id !== boxToMove.id && doesCollide(box, newBox),
    );
    boxesToMove.push(...boxCollissions);
    boxToMoveIndex += 1;
  }

  boxesToMove = Array.from(new Set(boxesToMove));

  if (robotCanMove) {
    map.robot = newRobot;
    boxesToMove.forEach((box) => {
      const boxToMove = map.boxes.find(
        (b) => b.pos.x === box.pos.x && b.pos.y === box.pos.y,
      );
      if (boxToMove) {
        boxToMove.pos.x += i.x;
        boxToMove.pos.y += i.y;
      }
    });
  }

  return map;
};

const getGPS = (map: Map): number =>
  map.boxes.reduce((acc, box) => acc + box.pos.x + 100 * box.pos.y, 0);

const expandMap = (map: Map): Map => {
  return {
    walls: map.walls.map((wall) => ({
      id: wall.id,
      pos: { x: 2 * wall.pos.x, y: wall.pos.y },
      size: { x: 2 * wall.size.x, y: wall.size.y },
    })),
    boxes: map.boxes.map((box) => ({
      id: box.id,
      pos: { x: 2 * box.pos.x, y: box.pos.y },
      size: { x: 2 * box.size.x, y: box.size.y },
    })),
    robot: {
      id: map.robot.id,
      pos: { x: 2 * map.robot.pos.x, y: map.robot.pos.y },
      size: { x: map.robot.size.x, y: map.robot.size.y },
    },
  };
};

const printMap = (map: Map, mapSize: XY) => {
  const size = map.walls[0].size.x;
  const print = new Array(mapSize.y)
    .fill('')
    .map((_) => new Array(mapSize.x * size).fill('.'));
  map.walls.forEach((wall) => {
    print[wall.pos.y][wall.pos.x] = '#';
    size === 2 && (print[wall.pos.y][wall.pos.x + 1] = '#');
  });
  map.boxes.forEach((box) => {
    size === 1 && (print[box.pos.y][box.pos.x] = 'O');
    size === 2 &&
      (print[box.pos.y][box.pos.x] = 'O') &&
      (print[box.pos.y][box.pos.x + 1] = 'O');
  });
  print[map.robot.pos.y][map.robot.pos.x] = '@';
  return print.map((row) => row.join('')).join('\n');
};

const getMapSize = (input: string) => ({
  x: input.split('\n\n')[0].split('\n')[0].length,
  y: input.split('\n\n')[0].split('\n').length,
});

export const part1 = (input: string): number => {
  let map = getMap(input.split('\n\n')[0]);
  const instructions = getInstructions(input.split('\n\n')[1]);
  instructions.split('').forEach((instruction, i) => {
    map = move(map, instruction);
  });
  return getGPS(map);
};

export const part2 = (input: string): number => {
  let map = expandMap(getMap(input.split('\n\n')[0]));
  const instructions = getInstructions(input.split('\n\n')[1]);
  // const mapSize = getMapSize(input);
  instructions.split('').forEach((instruction, i) => {
    map = move(map, instruction);
  });
  // console.log(printMap(map, mapSize));
  return getGPS(map);
};

(() => {
  console.log(`${day} part 1: ` + part1(input));
  console.log(`${day} part 2: ` + part2(input));
})();
