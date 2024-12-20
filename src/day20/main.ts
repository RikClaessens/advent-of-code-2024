import { getInput } from '../getInput.ts';

export const day = 'day20';
export const testsPart1 = [
  { input: getInput(`src/${day}/test.txt`), result: 0 },
];

export const testsPart2 = [
  { input: getInput(`src/${day}/test.txt`), result: 0 },
];

export const input = getInput(`src/${day}/input.txt`);

const dirs = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

type Graph = { [key: string]: Vertex };

type Vertex = {
  key: string;
  d: number;
  neighbors: string[];
  previous?: string;
};

const getGraph = (map: string[][]) => {
  const graph: Graph = {};
  for (let y = 0; y < map.length; y += 1) {
    for (let x = 0; x < map[y].length; x += 1) {
      const key = `${x},${y}`;
      if (map[y][x] === '.') {
        graph[key] = {
          key,
          d: Infinity,
          neighbors: [],
        };
        dirs.forEach(([dx, dy]) => {
          if (map[y + dy] && map[y + dy][x + dx] === '.') {
            graph[key].neighbors.push(`${x + dx},${y + dy}`);
          }
        });
      }
    }
  }
  return graph;
};

const dijkstra = (graph: Graph, startKey: string, endKey: string) => {
  graph[startKey].d = 0;
  const queue = Object.values(graph);
  const visited = new Set<string>();

  while (queue.length) {
    queue.sort((a, b) => a.d - b.d);

    const vertex = queue.shift()!;
    visited.add(vertex.key);
    if (vertex.key === endKey) {
      break;
    }
    vertex.neighbors.forEach((neighborKey) => {
      const neighbor = graph[neighborKey];
      if (!visited.has(neighbor.key)) {
        const alt = vertex.d + 1;
        if (alt < neighbor.d) {
          graph[neighbor.key].d = alt;
          graph[neighbor.key].previous = vertex.key;
        }
      }
    });
  }
  return graph;
};

const findShortcuts = (
  map: string[][],
  graph: Graph,
): { [key: string]: number } => {
  const shortcuts: { [key: string]: number } = {};
  for (let y = 0; y < map.length; y += 1) {
    for (let x = 0; x < map[y].length; x += 1) {
      if (map[y][x] === '#') {
        const neighbors: string[] = [];

        dirs.forEach(([dx, dy]) => {
          const newX = x + dx;
          const newY = y + dy;
          if (
            newX < map[0].length &&
            newY < map.length &&
            newX >= 0 &&
            newY >= 0
          ) {
            if (map[newY][newX] === '.') {
              neighbors.push(`${newX},${newY}`);
            }
          }
        });
        if (neighbors.length === 2) {
          shortcuts[`${x},${y}`] =
            Math.abs(graph[neighbors[0]].d - graph[neighbors[1]].d) - 2;
        }
      }
    }
  }
  return shortcuts;
};

const findShortcuts2 = (
  graph: Graph,
  maxD: number,
  minSaving: number,
): number => {
  const vertices = Object.values(graph);
  let shortcuts = 0;
  for (let i = 0; i < vertices.length; i += 1) {
    for (let j = i + 1; j < vertices.length; j += 1) {
      const vertex = vertices[i];
      const vertex2 = vertices[j];
      const manhattan =
        Math.abs(
          parseInt(vertex.key.split(',')[0]) -
            parseInt(vertex2.key.split(',')[0]),
        ) +
        Math.abs(
          parseInt(vertex.key.split(',')[1]) -
            parseInt(vertex2.key.split(',')[1]),
        );
      if (
        manhattan <= maxD &&
        Math.abs(graph[vertex.key].d - graph[vertex2.key].d) - manhattan >=
          minSaving
      ) {
        shortcuts++;
      }
    }
  }
  return shortcuts;
};

const getStartAndEnd = (map: string[][]) => {
  const startY = map.findIndex((line) => line.includes('S'));
  const startX = map[startY].indexOf('S');
  const endY = map.findIndex((line) => line.includes('E'));
  const endX = map[endY].indexOf('E');
  return { startX, startY, endX, endY };
};

export const part1 = (input: string[]): number => {
  const map = input.map((line) => line.split(''));
  const { startX, startY, endX, endY } = getStartAndEnd(map);
  map[startY][startX] = '.';
  map[endY][endX] = '.';
  const graph = getGraph(map);
  const result = dijkstra(graph, `${startX},${startY}`, `${endX},${endY}`);
  const shortcuts = findShortcuts(map, result);
  return Object.values(shortcuts).reduce(
    (acc, shortcut) => (acc += shortcut >= 100 ? 1 : 0),
    0,
  );
};

export const part2 = (input: string[]): number => {
  const map = input.map((line) => line.split(''));
  const { startX, startY, endX, endY } = getStartAndEnd(map);
  map[startY][startX] = '.';
  map[endY][endX] = '.';
  const graph = getGraph(map);
  const result = dijkstra(graph, `${startX},${startY}`, `${endX},${endY}`);
  const noOfShortcuts = findShortcuts2(result, 20, 100);
  return noOfShortcuts;
};

(() => {
  console.log(`${day} part 1: ` + part1(input));
  console.log(`${day} part 2: ` + part2(input));
})();

// 1280669 too high
// 977665
