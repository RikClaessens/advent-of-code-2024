import { getInput, writeToFile, makeDir } from '../getInput.ts';

export const day = 'day14';
export const testsPart1 = [
  {
    input: { map: getInput(`src/${day}/test.txt`), width: 11, height: 7 },
    result: 12,
  },
];

export const testsPart2 = [
  {
    input: { map: getInput(`src/${day}/test.txt`), width: 11, height: 7 },
    result: 0,
  },
];

export const input = {
  map: getInput(`src/${day}/input.txt`),
  width: 101,
  height: 103,
  writeOutput: true,
};

type XY = {
  x: number;
  y: number;
};

type Robot = {
  p: XY;
  v: XY;
};

const getRobots = (input: string[]): Robot[] => {
  return input.map((line) => {
    const robot = line.split(' ');
    const readXY = (str: string): XY => {
      const splitted = str.substring(2).split(',');
      return {
        x: Number.parseInt(splitted[0]),
        y: Number.parseInt(splitted[1]),
      };
    };
    return {
      p: readXY(robot[0]),
      v: readXY(robot[1]),
    };
  });
};

const moveRobot = (
  robot: Robot,
  steps: number,
  width: number,
  height: number,
): Robot => {
  const { p, v } = robot;
  const finalX = p.x + v.x * steps;
  const finalY = p.y + v.y * steps;

  return {
    p: {
      x: finalX - width * Math.floor(finalX / width),
      y: finalY - height * Math.floor(finalY / height),
    },
    v,
  };
};

const printMap = (robots: Robot[], width: number, height: number) => {
  let print = '';
  const map = new Array(height).fill(' ').map(() => new Array(width).fill(0));
  robots.forEach((robot) => {
    map[robot.p.y][robot.p.x] += 1;
  });
  map.forEach((line) => {
    print += line.join('').replaceAll('0', '.') + '\n';
  });
  return print;
};

const printTree = (robots: Robot[], width: number, height: number) => {
  let print = '';
  const map = new Array(height).fill(' ').map(() => new Array(width).fill(' '));
  robots.forEach((robot) => {
    map[robot.p.y][robot.p.x] = '*';
  });
  map.forEach((line) => {
    print += line.join('') + '\n';
  });
  return print;
};

const getSafetyFactor = (robots: Robot[], w: number, h: number): number => {
  const halfW = (w - 1) / 2;
  const halfH = (h - 1) / 2;
  const quadrants: { min: XY; max: XY }[] = [
    { min: { x: 0, y: 0 }, max: { x: halfW - 1, y: halfH - 1 } },
    { min: { x: halfW + 1, y: 0 }, max: { x: w - 1, y: halfH - 1 } },
    { min: { x: 0, y: halfH + 1 }, max: { x: halfW - 1, y: h - 1 } },
    { min: { x: halfW + 1, y: halfH + 1 }, max: { x: w - 1, y: h - 1 } },
  ];
  return quadrants.reduce((acc, quadrant) => {
    const count = robots.filter((robot) => {
      return (
        robot.p.x >= quadrant.min.x &&
        robot.p.x <= quadrant.max.x &&
        robot.p.y >= quadrant.min.y &&
        robot.p.y <= quadrant.max.y
      );
    }).length;
    return acc * count;
  }, 1);
};

export const part1 = ({
  map,
  width,
  height,
  numberOfSteps = 100,
}: {
  map: string[];
  width: number;
  height: number;
  numberOfSteps?: number;
}): number => {
  const robots = getRobots(map);
  robots.forEach((robot) => {
    robot.p = moveRobot(robot, numberOfSteps, width, height).p;
  });
  return getSafetyFactor(robots, width, height);
};

export const part2 = ({
  map,
  width,
  height,
  writeOutput = false,
}: {
  map: string[];
  width: number;
  height: number;
  numberOfSteps?: number;
  writeOutput?: boolean;
}): number => {
  const robots = getRobots(map);
  robots.forEach((robot) => {
    robot.p = moveRobot(robot, 8280, width, height).p;
  });
  if (writeOutput) {
    writeToFile(
      `src/${day}/christmasTree.txt`,
      printTree(robots, width, height),
    );
    console.log(printTree(robots, width, height));
  }

  return 0;
};

export const findPart2 = ({
  map,
  width,
  height,
  writeOutput = false,
}: {
  map: string[];
  width: number;
  height: number;
  numberOfSteps?: number;
  writeOutput?: boolean;
}): number => {
  if (writeOutput) {
    makeDir(`src/${day}/steps`);
  }
  for (let i = 1; i <= 10000; i++) {
    const robots = getRobots(map);
    robots.forEach((robot) => {
      robot.p = moveRobot(robot, i, width, height).p;
    });
    const left = Number.parseInt(i.toString().slice(0, 2));
    const right = Number.parseInt(i.toString().slice(2));
    // noticed a pattern at steps like 2220, 2321, 2422 etc.
    if (writeOutput && left === right + 2) {
      writeToFile(
        `src/${day}/steps/${i}.txt`,
        printTree(robots, width, height),
      );
    }
  }
  return 0;
};

(() => {
  console.log(`${day} part 1: ` + part1(input));
  // switch to findPart2 to find the right step, this function prints the christmas tree
  console.log(`${day} part 2: ` + part2(input));
})();
