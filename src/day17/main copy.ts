import { getInput } from '../getInput.ts';

export const day = 'day17';
export const testsPart1 = [
  { input: getInput(`src/${day}/test2.txt`), result: '' },
  { input: getInput(`src/${day}/test.txt`), result: '4,6,3,5,6,3,5,2,1,0' },
];

/*
If register C contains 9, the program 2,6 would set register B to 1.
If register A contains 10, the program 5,0,5,1,5,4 would output 0,1,2.
If register A contains 2024, the program 0,1,5,4,3,0 would output 4,2,5,6,7,7,7,7,3,1,0 and leave 0 in register A.
If register B contains 29, the program 1,7 would set register B to 26.
If register B contains 2024 and register C contains 43690, the program 4,0 would set register B to 44354.
*/

/*
opcodes
0: The adv instruction (opcode 0) performs division. The numerator is the value in the A register. The denominator is found by raising 2 to the power of the instruction's combo operand. (So, an operand of 2 would divide A by 4 (2^2); an operand of 5 would divide A by 2^B.) The result of the division operation is truncated to an integer and then written to the A register.
1: The bxl instruction (opcode 1) calculates the bitwise XOR of register B and the instruction's literal operand, then stores the result in register B.
2: calculates the value of its combo operand modulo 8 (thereby keeping only its lowest 3 bits), then writes that value to the B register.
3: The jnz instruction (opcode 3) does nothing if the A register is 0. However, if the A register is not zero, it jumps by setting the instruction pointer to the value of its literal operand; if this instruction jumps, the instruction pointer is not increased by 2 after this instruction.
4: The bxc instruction (opcode 4) calculates the bitwise XOR of register B and register C, then stores the result in register B. (For legacy reasons, this instruction reads an operand but ignores it.)
5: The out instruction (opcode 5) calculates the value of its combo operand modulo 8, then outputs that value. (If a program outputs multiple values, they are separated by commas.)
6: The bdv instruction (opcode 6) works exactly like the adv instruction except that the result is stored in the B register. (The numerator is still read from the A register.)
7: The cdv instruction (opcode 7) works exactly like the adv instruction except that the result is stored in the C register. (The numerator is still read from the A register.)
*/

export const testsPart2 = [
  { input: getInput(`src/${day}/test.txt`), result: 0 },
];

export const input = getInput(`src/${day}/test2.txt`);

type State = {
  a: number;
  b: number;
  c: number;
  program: number[];
  output: number[];
  pointer: number;
  halted: boolean;
};

const parseInput = (input: string[]): State => ({
  a: parseInt(input[0].substring(12)),
  b: parseInt(input[1].substring(12)),
  c: parseInt(input[2].substring(12)),
  program: input[4]
    .substring(9)
    .split(',')
    .map((n) => Number.parseInt(n)),
  output: [],
  pointer: 0,
  halted: false,
});

const getComboOperand = (state: State, operand: number): number => {
  switch (operand) {
    case 0:
    case 1:
    case 2:
    case 3:
      return operand;
    case 4:
      return state.a;
    case 5:
      return state.b;
    case 6:
      return state.c;
  }
  return 0;
};

const doOperation = (state: State): State => {
  const { a, b, c, program, output, pointer, halted } = state;
  if (pointer >= program.length) {
    state.halted = true;
    return state;
  }
  const opcode = state.program[pointer];
  if (opcode === 4 && pointer + 1 >= program.length) {
    state.halted = true;
    return state;
  }
  const operand = state.program[pointer + 1];
  const comboOperand = getComboOperand(state, operand);
  let shouldJump = true;

  console.log('➡️', pointer, opcode, operand, comboOperand);

  if (opcode === 0) {
    state.a = Math.floor(a / (2 ^ comboOperand));
  } else if (opcode === 1) {
    state.b = b ^ operand;
  } else if (opcode === 2) {
    state.b = comboOperand % 8;
  } else if (opcode === 3) {
    if (a !== 0) {
      if (state.pointer !== operand) {
        shouldJump = false;
      }
      state.pointer = operand;
    }
  } else if (opcode === 4) {
    state.b = b ^ c;
  } else if (opcode === 5) {
    state.output.push(comboOperand % 8);
  } else if (opcode === 6) {
    state.b = Math.floor(a / (2 ^ comboOperand));
  } else if (opcode === 7) {
    state.c = Math.floor(a / (2 ^ comboOperand));
  }
  if (shouldJump) {
    state.pointer += 2;
  }
  // console.log(state, '\n------\n');
  return state;
};

export const part1 = (input: string[]): string => {
  const state = parseInput(input);
  console.log(state);
  while (!state.halted) {
    doOperation(state);
  }
  console.log(state);
  return state.output.join(',');
};

export const part2 = (input: string[]): string => {
  return '';
};

(() => {
  console.log(`${day} part 1: ` + part1(input));
  console.log(`${day} part 2: ` + part2(input));
})();
