import { getInput } from '../getInput.ts';

export const day = 'day08';
export const testsPart1 = [
  { input: getInput(`src/${day}/test.txt`), result: 14 },
];

export const testsPart2 = [
  { input: getInput(`src/${day}/test.txt`), result: 34 },
];

export const input = getInput(`src/${day}/input.txt`);

type Pos = { x: number; y: number };
type Antennas = { [key: string]: Pos[] };

const getAntennas = (input: string[]): Antennas => {
  const antennas: Antennas = {};

  input.forEach((line, y) => {
    line.split('').forEach((char, x) => {
      if (char !== '.') {
        if (!antennas[char]) {
          antennas[char] = [];
        }
        antennas[char].push({ x, y });
      }
    });
  });

  return antennas;
};

const findAntinodes = (
  antennas: Antennas,
  mapWidth: number,
  mapHeight: number,
): Set<string> => {
  const antinodes: Set<string> = new Set();
  Object.keys(antennas).forEach((freq) => {
    const positions = antennas[freq];
    // all pairs of positions
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const pos1 = positions[i];
        const pos2 = positions[j];
        const dx = pos2.x - pos1.x;
        const dy = pos2.y - pos1.y;

        if (
          pos1.x - dx >= 0 &&
          pos1.x - dx < mapWidth &&
          pos1.y - dy >= 0 &&
          pos1.y - dy < mapHeight
        ) {
          antinodes.add(`${pos1.x - dx},${pos1.y - dy}`);
        }
        if (
          pos2.x + dx >= 0 &&
          pos2.x + dx < mapWidth &&
          pos2.y + dy >= 0 &&
          pos2.y + dy < mapHeight
        ) {
          antinodes.add(`${pos2.x + dx},${pos2.y + dy}`);
        }
      }
    }
  });
  return antinodes;
};

const getCommonMultiplier = (a: number, b: number): number => {
  let common = 1;
  let i = 2;
  while (i <= Math.min(a, b)) {
    if (a % i === 0 && b % i === 0) {
      common = i;
    }
    i++;
  }
  return common;
};

const findAntinodes2 = (
  antennas: Antennas,
  mapWidth: number,
  mapHeight: number,
): Set<string> => {
  const antinodes: Set<string> = new Set();
  Object.keys(antennas).forEach((freq) => {
    const positions = antennas[freq];
    // all pairs of positions
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const pos1 = positions[i];
        const pos2 = positions[j];
        let dx = pos2.x - pos1.x;
        let dy = pos2.y - pos1.y;

        const lcm = getCommonMultiplier(Math.abs(dx), Math.abs(dy));
        dx = dx / lcm;
        dy = dy / lcm;

        let posToCheck = { x: pos1.x - dx, y: pos1.y - dy };

        while (
          posToCheck.x >= 0 &&
          posToCheck.x < mapWidth &&
          posToCheck.y >= 0 &&
          posToCheck.y < mapHeight
        ) {
          antinodes.add(`${posToCheck.x},${posToCheck.y}`);
          posToCheck = { x: posToCheck.x - dx, y: posToCheck.y - dy };
        }
        posToCheck = { x: pos2.x + dx, y: pos2.y + dy };

        while (
          posToCheck.x >= 0 &&
          posToCheck.x < mapWidth &&
          posToCheck.y >= 0 &&
          posToCheck.y < mapHeight
        ) {
          antinodes.add(`${posToCheck.x},${posToCheck.y}`);
          posToCheck = { x: posToCheck.x + dx, y: posToCheck.y + dy };
        }
      }
    }
  });
  return antinodes;
};

const printMap = (
  antinodes: Set<string>,
  mapWidth: number,
  mapHeight: number,
) => {
  for (let y = 0; y < mapHeight; y++) {
    let row = '';
    for (let x = 0; x < mapWidth; x++) {
      if (antinodes.has(`${x},${y}`)) {
        row += '#';
      } else {
        row += '.';
      }
    }
    console.log(row);
  }
};

export const part1 = (input: string[]): number => {
  const antennas = getAntennas(input);
  const antinodes = findAntinodes(antennas, input[0].length, input.length);
  return antinodes.size;
};

export const part2 = (input: string[]): number => {
  const antennas = getAntennas(input);
  const antinodes = findAntinodes2(antennas, input[0].length, input.length);
  let noOfAntenneas = 0;
  Object.keys(antennas).forEach((key) => {
    noOfAntenneas += antennas[key].length;
    antennas[key].forEach((pos) => {
      antinodes.add(`${pos.x},${pos.y}`);
    });
  });
  return antinodes.size;
};

(() => {
  console.log(`${day} part 1: ` + part1(input));
  console.log(`${day} part 2: ` + part2(input));
})();
