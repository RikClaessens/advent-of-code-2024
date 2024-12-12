import { getInput } from '../getInput.ts';

export const day = 'day12';
export const testsPart1 = [
  // { input: getInput(`src/${day}/test.txt`), result: 140 },
  // { input: getInput(`src/${day}/test2.txt`), result: 772 },
  // { input: getInput(`src/${day}/test3.txt`), result: 1930 },
];

export const testsPart2 = [
  { input: getInput(`src/${day}/test.txt`), result: 80 },
  { input: getInput(`src/${day}/test2.txt`), result: 436 },
  { input: getInput(`src/${day}/test3.txt`), result: 1206 },
  { input: getInput(`src/${day}/test4.txt`), result: 236 },
  { input: getInput(`src/${day}/test5.txt`), result: 368 },
];

export const input = getInput(`src/${day}/input.txt`);

type Pos = { x: number; y: number };
type Region = Pos[];
type Regions = { [key: string]: Region[] };
const dirs = {
  N: { x: 0, y: -1 },
  E: { x: 1, y: 0 },
  S: { x: 0, y: 1 },
  W: { x: -1, y: 0 },
} as const;
type DirKey = keyof typeof dirs;
type Side = { pos: Pos; side: DirKey };

const parseMap = (input: string[]): string[][] => {
  return input.map((line) => line.split(''));
};

const isNeighbour = (a: Pos, b: Pos): boolean => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;
};

const getRegions = (map: string[][]): Regions => {
  const regions: Regions = {};
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const char = map[y][x];

      if (!regions[char]) {
        regions[char] = [];
      }
      regions[char].push([{ x, y }]);
    }
  }
  for (const regionKey in regions) {
    for (let i = 0; i < regions[regionKey].length; i++) {
      for (let j = i + 1; j < regions[regionKey].length; j++) {
        if (
          regions[regionKey][i].some((pos) =>
            regions[regionKey][j].some((pos2) => isNeighbour(pos, pos2)),
          )
        ) {
          regions[regionKey][i] = [
            ...regions[regionKey][i],
            ...regions[regionKey][j],
          ];
          regions[regionKey].splice(j, 1);
          i = -1;
          break;
        }
      }
    }
  }
  return regions;
};

const getOuterPerimeter = (
  region: Region,
  regionKey: string,
  map: string[][],
): number => {
  let outerPerimeter = 0;
  region.forEach((pos) => {
    outerPerimeter +=
      4 -
      Object.values(dirs).reduce((acc, dir) => {
        const newPos = { x: pos.x + dir.x, y: pos.y + dir.y };
        if (
          newPos.x >= 0 &&
          newPos.x < map[0].length &&
          newPos.y >= 0 &&
          newPos.y < map.length &&
          map[newPos.y][newPos.x] === regionKey
        ) {
          return acc + 1;
        }
        return acc;
      }, 0);
  });
  return outerPerimeter;
};

const getOuterSides = (
  region: Region,
  regionKey: string,
  map: string[][],
): number => {
  const sides: Side[][] = [];
  region.forEach((pos) => {
    Object.entries(dirs).forEach(([sideValue, dir]) => {
      const side = sideValue as DirKey;
      const newPos = { x: pos.x + dir.x, y: pos.y + dir.y };
      if (
        newPos.x < 0 ||
        newPos.x >= map[0].length ||
        newPos.y < 0 ||
        newPos.y >= map.length ||
        map[newPos.y][newPos.x] !== regionKey
      ) {
        sides.push([{ pos, side }]);
      }
    });
  });
  for (let i = 0; i < sides.length; i++) {
    for (let j = i + 1; j < sides.length; j++) {
      if (
        sides[i].some((pos) =>
          sides[j].some(
            (pos2) => isNeighbour(pos.pos, pos2.pos) && pos.side === pos2.side,
          ),
        )
      ) {
        sides[i] = [...sides[i], ...sides[j]];
        sides.splice(j, 1);
        i = -1;
        break;
      }
    }
  }
  return sides.length;
};

const isEnclosed = (regionToCheck: Region, region: Region): boolean => {
  return region.every((pos) =>
    Object.values(dirs).every((dir) =>
      regionToCheck.some(
        (pos2) => pos2.x === pos.x + dir.x && pos2.y === pos.y + dir.y,
      ),
    ),
  );
};

const getInnerPerimeter = (
  regionKey: string,
  regionIndex: number,
  regions: Regions,
  map: string[][],
): number => {
  let result = 0;
  const regionToCheck = regions[regionKey][regionIndex];
  for (const key in regions) {
    regions[key].forEach((region, index) => {
      if (key !== regionKey || index !== regionIndex) {
        if (isEnclosed(regionToCheck, region)) {
          result += getOuterPerimeter(region, regionKey, map);
        }
      }
    });
  }
  return result;
};

export const part1 = (input: string[]): number => {
  const map = parseMap(input);
  const regions = getRegions(map);

  let result = 0;
  for (const regionKey in regions) {
    result += regions[regionKey].reduce(
      (acc, region, regionIndex) =>
        (acc +=
          region.length *
          (getOuterPerimeter(region, regionKey, map) +
            getInnerPerimeter(regionKey, regionIndex, regions, map))),
      0,
    );
  }

  return result;
};

export const part2 = (input: string[]): number => {
  const map = parseMap(input);
  const regions = getRegions(map);

  let result = 0;
  for (const regionKey in regions) {
    result += regions[regionKey].reduce(
      (acc, region, regionIndex) =>
        (acc +=
          region.length *
          (getOuterSides(region, regionKey, map) +
            getInnerPerimeter(regionKey, regionIndex, regions, map))),
      0,
    );
  }

  return result;
};

(() => {
  console.log(`${day} part 1: ` + part1(input));
  console.log(`${day} part 2: ` + part2(input));
})();
