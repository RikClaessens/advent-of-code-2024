import { getInputAsString } from '../getInput.ts';

export const day = 'day24';
export const testsPart1 = [
  { input: getInputAsString(`src/${day}/test.txt`), result: 4 },
  { input: getInputAsString(`src/${day}/test2.txt`), result: 2024 },
];

export const testsPart2 = [];

export const input = getInputAsString(`src/${day}/input.txt`);

type Wires = { [key: string]: number };

type Gate = {
  wiresIn: string[];
  output: number | undefined;
  type: 'AND' | 'XOR' | 'OR';
};

type Gates = {
  [key: string]: Gate;
};

const parseInput = (input: string): { wires: Wires; gates: Gates } => {
  const wires: Wires = {};
  input
    .split('\n\n')[0]
    .split('\n')
    .forEach((wire) => {
      wires[wire.split(':')[0]] = Number(wire.split(' ')[1]);
    });

  const gates: Gates = {};
  input
    .split('\n\n')[1]
    .split('\n')
    .forEach((gate) => {
      gates[gate.split(' ')[4]] = {
        wiresIn: [gate.split(' ')[0], gate.split(' ')[2]],
        output: undefined,
        type: gate.split(' ')[1] as 'AND' | 'XOR' | 'OR',
      };
    });

  return { wires, gates };
};

const activateGates = (wires: Wires, gates: Gates): void => {
  let queue = Object.keys(gates);

  while (queue.length > 0) {
    const gateId = queue.shift() as string;
    const gate = gates[gateId];
    const [wi1, wi2] = gate.wiresIn;
    if (wires[wi1] !== undefined && wires[wi2] !== undefined) {
      switch (gate.type) {
        case 'AND':
          wires[gateId] = wires[wi1] & wires[wi2];
          break;
        case 'OR':
          wires[gateId] = wires[wi1] | wires[wi2];
          break;
        case 'XOR':
          wires[gateId] = wires[wi1] ^ wires[wi2];
          break;
      }
    } else {
      queue.push(gateId);
    }
    queue = queue.filter((id) => !wires[id]);
  }
};

const doubleDigit = (n: number): string => {
  return n.toString().padStart(2, '0');
};

export const part1 = (input: string): number => {
  const { wires, gates } = parseInput(input);
  activateGates(wires, gates);
  let z = 0;
  let result = '';
  while (wires[`z${doubleDigit(z)}`] !== undefined) {
    result = wires[`z${doubleDigit(z)}`] + result;
    z += 1;
  }
  return parseInt(result, 2);
};

export const part2 = (input: string): string => {
  const { gates } = parseInput(input);
  const gateIds = Object.keys(gates);

  const findGate = (wiresIn: string[], type: string): string => {
    return (
      gateIds.find((gateId) => {
        const gate = gates[gateId];
        return (
          gate.wiresIn.includes(wiresIn[0]) &&
          gate.wiresIn.includes(wiresIn[1]) &&
          gate.type === type
        );
      }) || ''
    );
  };

  const countZGates = Object.keys(gates).filter((key) =>
    key.startsWith('z'),
  ).length;

  const swappedGates: string[] = [];

  let c0: string | null = null;
  for (let i = 0; i < countZGates; i++) {
    const n = doubleDigit(i);
    let m1 = '',
      n1 = '',
      r1 = '',
      z1 = '',
      c1 = '';

    m1 = findGate([`x${n}`, `y${n}`], 'XOR');
    n1 = findGate([`x${n}`, `y${n}`], 'AND');

    if (c0 && m1 && n1) {
      r1 = findGate([c0, m1], 'AND');
      if (!r1) {
        [n1, m1] = [m1, n1];
        swappedGates.push(m1, n1);
        r1 = findGate([c0, m1], 'AND');
      }

      z1 = findGate([c0, m1], 'XOR');

      if (m1?.startsWith('z')) {
        [m1, z1] = [z1, m1];
        swappedGates.push(m1, z1);
      }

      if (n1?.startsWith('z')) {
        [n1, z1] = [z1, n1];
        swappedGates.push(n1, z1);
      }

      if (r1?.startsWith('z')) {
        [r1, z1] = [z1, r1];
        swappedGates.push(r1, z1);
      }

      c1 = findGate([r1, n1], 'OR');
    }

    if (c1?.startsWith('z') && c1 !== `z${doubleDigit(countZGates)}`) {
      [c1, z1] = [z1, c1];
      swappedGates.push(c1, z1);
    }

    c0 = c0 ? c1 : n1;
  }

  return swappedGates.sort().join(',');
};

(() => {
  console.log(`${day} part 1: ` + part1(input));
  console.log(`${day} part 2: ` + part2(input));
})();
