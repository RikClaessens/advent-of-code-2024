import { getInput } from '../getInput.ts';

export const day = 'day09';
export const testsPart1 = [
  { input: getInput(`src/${day}/test.txt`), result: 1928 },
];

export const testsPart2 = [
  { input: getInput(`src/${day}/test.txt`), result: 2858 },
];

export const input = getInput(`src/${day}/input.txt`);

type FileBlock = {
  id: number;
  size: number;
  empty: number;
};

const parseFileBlocks = (
  input: string,
): { fileBlocks: number[]; blocks: FileBlock[] } => {
  const fileBlocks: number[] = [];
  const blocks: FileBlock[] = [];
  let id = 0;
  for (let i = 0; i < input.length; i += 2) {
    fileBlocks.push(...new Array(parseInt(input[i])).fill(1).map((_) => id));
    blocks.push({
      id,
      size: parseInt(input[i]),
      empty: parseInt(input[i + 1] ?? 0),
    });
    input[i + 1] &&
      fileBlocks.push(...new Array(parseInt(input[i + 1])).fill(-1));
    id += 1;
  }
  return { fileBlocks, blocks };
};

const compact = (fileBlocks: number[]): number[] => {
  let readFrom = fileBlocks.length - 1;
  let writeTo = 0;

  while (readFrom > writeTo) {
    while (fileBlocks[readFrom] === -1) {
      readFrom -= 1;
    }
    while (fileBlocks[writeTo] !== -1) {
      writeTo += 1;
    }
    if (readFrom > writeTo) {
      fileBlocks[writeTo] = fileBlocks[readFrom];
      fileBlocks[readFrom] = -1;
      readFrom -= 1;
      writeTo += 1;
    }
  }

  return fileBlocks;
};

const compactBlocks = (fileBlocks: FileBlock[]): FileBlock[] => {
  let fromId = fileBlocks[fileBlocks.length - 1].id;
  while (fromId > 0) {
    const from = fileBlocks.findIndex((x) => x.id === fromId);
    const to = fileBlocks.findIndex((x) => x.empty >= fileBlocks[from].size);

    if (to > -1 && to < from && fileBlocks[to].empty >= fileBlocks[from].size) {
      const {
        id: fromBlockId,
        size: fromBlockSize,
        empty: fromBlockEmpty,
      } = fileBlocks[from];
      const { empty: toBlockEmpty } = fileBlocks[to];
      const newBlock = {
        id: fromBlockId,
        size: fromBlockSize,
        empty: toBlockEmpty - fromBlockSize,
      };
      fileBlocks[to].empty = 0;
      if (to === from - 1) {
        newBlock.empty = fromBlockEmpty + toBlockEmpty;
      } else {
        fileBlocks[from - 1].empty += fromBlockSize + fromBlockEmpty;
      }
      fileBlocks.splice(to + 1, 0, newBlock);
      fileBlocks.splice(from + 1, 1);
    }
    fromId--;
  }

  return fileBlocks;
};

const checkSum = (fileBlocks: FileBlock[]): number => {
  let result = 0;
  let block = 0;
  const blocks: number[] = [];
  fileBlocks.forEach((fileBlock) => {
    for (let i = 0; i < fileBlock.size; i++) {
      result += block * fileBlock.id;
      block++;
    }
    for (let i = 0; i < fileBlock.empty; i++) {
      blocks.push(-1);
    }
    block += fileBlock.empty;
  });
  return result;
};

export const part1 = (input: string[]): number =>
  compact(parseFileBlocks(input[0]).fileBlocks).reduce(
    (acc, x, i) => acc + (x === -1 ? 0 : x * i),
    0,
  );

export const part2 = (input: string[]): number =>
  checkSum(compactBlocks(parseFileBlocks(input[0]).blocks));

(() => {
  console.log(`${day} part 1: ` + part1(input));
  console.log(`${day} part 2: ` + part2(input));
})();
