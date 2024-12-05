import { getInput } from '../getInput.ts';

export const day = 'day05';
export const testsPart1 = [
  { input: getInput(`src/${day}/test.txt`), result: 143 },
];

export const testsPart2 = [
  { input: getInput(`src/${day}/test.txt`), result: 123 },
];

export const input = getInput(`src/${day}/input.txt`);

type Rule = { before: number; after: number };
type ParsedRules = { [key: number]: number[] };

const parseInput = (
  input: string[],
): { rules: ParsedRules; orders: number[][] } => {
  const rules: Rule[] = [];
  const orders = [] as number[][];

  input.forEach((line) => {
    if (line.indexOf('|') !== -1) {
      const [before, after] = line.split('|').map(Number);
      rules.push({ before, after });
    } else if (line.indexOf(',') !== -1) {
      orders.push(line.split(',').map(Number));
    }
  });

  let parsedRules = {} as { [key: number]: number[] };
  rules.forEach((rule) => {
    if (!parsedRules[rule.before]) {
      parsedRules[rule.before] = [];
    }
    parsedRules[rule.before].push(rule.after);
  });

  return { rules: parsedRules, orders };
};

const isInCorrectOrder = (rules: ParsedRules, order: number[]): boolean => {
  let isCorrect = true;
  order.forEach((num, i) => {
    if (rules[num]) {
      rules[num].forEach((next) => {
        if (order.indexOf(next) !== -1 && order.indexOf(next) < i) {
          isCorrect = false;
        }
      });
    }
  });
  return isCorrect;
};

const isInCorrectOrderWithExtraInfo = (
  rules: ParsedRules,
  order: number[],
): { isCorrect: boolean; index: number; nextIndex: number } => {
  let index = -1;
  let nextIndex = -1;
  for (let i = 0; i < order.length; i++) {
    const num = order[i];
    if (rules[num]) {
      for (let j = 0; j < rules[num].length; j++) {
        const next = rules[num][j];
        if (order.indexOf(next) !== -1 && order.indexOf(next) < i) {
          index = i;
          nextIndex = j;
          return { isCorrect: false, index, nextIndex: order.indexOf(next) };
        }
      }
    }
  }
  return { isCorrect: true, index, nextIndex };
};

const getCorrectness = (
  rules: ParsedRules,
  orders: number[][],
): { correctOrders: number[][]; inCorrectOrders: number[][] } => {
  const correctOrders = [] as number[][];
  const inCorrectOrders = [] as number[][];
  orders.forEach((order) => {
    if (isInCorrectOrder(rules, order)) {
      correctOrders.push(order);
    } else {
      inCorrectOrders.push(order);
    }
  });
  return { correctOrders, inCorrectOrders };
};

export const part1 = (input: string[]): number => {
  const { rules, orders } = parseInput(input);

  const { correctOrders } = getCorrectness(rules, orders);

  return correctOrders.reduce(
    (acc, order) => acc + order[(order.length - 1) / 2],
    0,
  );
};

export const part2 = (input: string[]): number => {
  const { rules, orders } = parseInput(input);

  const correctOrders = [] as number[][];
  const { inCorrectOrders } = getCorrectness(rules, orders);

  inCorrectOrders.forEach((order) => {
    let fixed = false;
    while (!fixed) {
      const { isCorrect, index, nextIndex } = isInCorrectOrderWithExtraInfo(
        rules,
        order,
      );
      fixed = isCorrect;
      if (!isCorrect) {
        const temp = order[nextIndex];
        order[nextIndex] = order[index];
        order[index] = temp;
      } else {
        correctOrders.push(order);
      }
    }
  });

  return correctOrders.reduce(
    (acc, order) => acc + order[(order.length - 1) / 2],
    0,
  );
};

(() => {
  console.log(`${day} part 1: ` + part1(input));
  console.log(`${day} part 2: ` + part2(input));
})();
