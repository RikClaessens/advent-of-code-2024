import { getInput } from '../getInput.ts';

export const day = 'day18';

export const testsPart1 = [
  {
    input: {
      bytesInput: getInput(`src/${day}/test.txt`),
      mapSize: 7,
      noOfBytes: 12,
    },
    result: 22,
  },
];

export const testsPart2 = [
  {
    input: {
      bytesInput: getInput(`src/${day}/test.txt`),
      mapSize: 7,
    },
    result: '6,1',
  },
];

export const input = {
  bytesInput: getInput(`src/${day}/input.txt`),
  mapSize: 71,
  noOfBytes: 1024,
};

interface Position {
  x: number;
  y: number;
}

interface Node {
  x: number;
  y: number;
  f: number;
  g: number;
  h: number;
  children: Node[];
  path: Position[];
}

const heuristic = (
  x: number,
  y: number,
  goalX: number,
  goalY: number,
): number => Math.abs(goalX - x) + Math.abs(goalY - y);

const directions: Position[] = [
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 0, y: -1 },
];

const canMove = (_: string, next: string) => next === '.';

const aStar = (
  map: string[][],
  direction: Position = { x: -1, y: 0 },
): { result: number; nodes: Node[] } => {
  const openList: Node[] = [];
  const closedList: Node[] = [];

  let goalPos: Position = { x: 0, y: 0 };

  for (let y = 0; y < map.length; y += 1) {
    for (let x = 0; x < map[y].length; x += 1) {
      if (map[y][x] === 'E') {
        goalPos = { x, y };
        map[y][x] = '.';
      }
    }
  }

  for (let y = 0; y < map.length; y += 1) {
    for (let x = 0; x < map[y].length; x += 1) {
      if (map[y][x] === 'S') {
        openList.push({
          x,
          y,
          f: 0,
          g: 0,
          h: heuristic(x, y, goalPos.x, goalPos.y),
          children: [],
          path: [{ x: x + direction.x, y: y + direction.y }],
        });
      }
    }
  }

  while (openList.length > 0) {
    let currentNode: Node = {
      x: 0,
      y: 0,
      f: Infinity,
      g: 0,
      h: 0,
      children: [],
      path: [{ x: 0, y: 0 }],
    };
    let nodeIndexToRemove = -1;
    openList.forEach((node, nodeIndex) => {
      if (node.f < currentNode.f) {
        currentNode = node;
        nodeIndexToRemove = nodeIndex;
      }
    });
    openList.splice(nodeIndexToRemove, 1);
    closedList.push(currentNode);
    if (currentNode.x === goalPos.x && currentNode.y === goalPos.y) {
      return { result: currentNode.f, nodes: closedList };
    }
    directions.forEach((direction) => {
      const newX = currentNode.x + direction.x;
      const newY = currentNode.y + direction.y;
      if (newX < map[0].length && newY < map.length && newX >= 0 && newY >= 0) {
        if (canMove(map[currentNode.y][currentNode.x], map[newY][newX])) {
          currentNode.children.push({
            x: newX,
            y: newY,
            f: 0,
            g: 0,
            h: 0,
            children: [],
            path: [...currentNode.path, { x: currentNode.x, y: currentNode.y }],
          });
        }
      }
    });

    currentNode.children.forEach((child) => {
      const isInClosedList = !!closedList.find(
        (closedChild) => closedChild.x === child.x && closedChild.y === child.y,
      );
      if (!isInClosedList) {
        child.g = currentNode.g + 1;
        child.h = heuristic(child.x, child.y, goalPos.x, goalPos.y);
        child.f = child.g + child.h;
        const openListNode = openList.find(
          (openChild) => openChild.x === child.x && openChild.y === child.y,
        );
        if (!openListNode || child.g < openListNode.g) {
          openList.push(child);
        }
      }
    });
  }
  return { result: 0, nodes: [] };
};

type Input = {
  bytesInput: string[];
  mapSize: number;
  noOfBytes: number;
};
export const part1 = ({ bytesInput, mapSize, noOfBytes }: Input): number => {
  const bytes: Position[] = bytesInput.map((byte) => ({
    x: Number(byte.split(',')[0]),
    y: Number(byte.split(',')[1]),
  }));

  const map = new Array(mapSize)
    .fill('')
    .map(() => new Array(mapSize).fill('.'));
  map[0][0] = 'S';
  map[mapSize - 1][mapSize - 1] = 'E';
  for (let i = 0; i < noOfBytes; i += 1) {
    map[bytes[i].y][bytes[i].x] = '#';
  }
  return aStar(map).result;
};

export const part2 = ({ bytesInput, mapSize }: Input): string => {
  const bytes: Position[] = bytesInput.map((byte) => ({
    x: Number(byte.split(',')[0]),
    y: Number(byte.split(',')[1]),
  }));

  const map = new Array(mapSize)
    .fill('')
    .map(() => new Array(mapSize).fill('.'));
  map[0][0] = 'S';
  for (let i = 0; i < bytesInput.length; i += 1) {
    map[mapSize - 1][mapSize - 1] = 'E';
    map[bytes[i].y][bytes[i].x] = '#';
    if (i > 0) {
      const { result } = aStar(map);
      if (result === 0) {
        return `${bytes[i].x},${bytes[i].y}`;
      }
    }
  }
  return `-1,-1`;
};

(() => {
  console.log(`${day} part 1: ` + part1(input));
  console.log(`${day} part 2: ` + part2(input));
})();
