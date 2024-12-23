import { getInput } from '../getInput.ts';

export const day = 'day23';
export const testsPart1 = [
  { input: getInput(`src/${day}/test.txt`), result: 7 },
];

export const testsPart2 = [
  { input: getInput(`src/${day}/test.txt`), result: 'co,de,ka,ta' },
];

export const input = getInput(`src/${day}/input.txt`);

const findCliquesOf3 = (connections: string[][]): string[] => {
  const cliquesOf3: Set<string> = new Set();
  const computers: { [key: string]: string[] } = {};
  connections.forEach(([from, to]) => {
    if (!computers[from]) {
      computers[from] = [];
    }
    if (!computers[to]) {
      computers[to] = [];
    }
    computers[from].push(to);
    computers[to].push(from);
  });
  Object.keys(computers).forEach((c1Id) => {
    const c1 = computers[c1Id];
    c1.forEach((c2Id) => {
      computers[c2Id].forEach((c3Id) => {
        if (c3Id !== c1Id && c3Id !== c2Id && c1.includes(c3Id)) {
          if (
            c1Id.startsWith('t') ||
            c2Id.startsWith('t') ||
            c3Id.startsWith('t')
          ) {
            cliquesOf3.add([c1Id, c2Id, c3Id].sort().join(','));
          }
        }
      });
    });
  });

  return Array.from(cliquesOf3);
};

const findMaxClique = (
  r: Set<string>,
  p: Set<string>,
  x: Set<string>,
  nodes: string[],
  edges: { [key: string]: Set<string> },
  maxClique: Set<string>,
): Set<string> => {
  if (p.size === 0 && x.size === 0) {
    if (r.size > maxClique.size) {
      maxClique.clear();
      r.forEach((node) => maxClique.add(node));
    }
    return r;
  }
  for (const v of p) {
    r.add(v);
    const neighbors = edges[v];
    const newP = new Set([...p].filter((v) => neighbors.has(v)));
    const newX = new Set([...x].filter((v) => neighbors.has(v)));
    findMaxClique(r, newP, newX, nodes, edges, maxClique);
    r.delete(v);
    p.delete(v);
    x.add(v);
  }
  return new Set();
};

export const part1 = (input: string[]): number => {
  const connections = input.map((line) => line.split('-'));
  const triplets = findCliquesOf3(connections);
  return triplets.length;
};

export const part2 = (input: string[]): string => {
  const connections = input.map((line) => line.split('-'));
  const edges: { [key: string]: Set<string> } = {};
  connections.forEach(([from, to]) => {
    if (!edges[from]) {
      edges[from] = new Set();
    }
    if (!edges[to]) {
      edges[to] = new Set();
    }
    edges[from].add(to);
    edges[to].add(from);
  });
  const nodes = Array.from(Object.keys(edges));
  const maxClique = new Set<string>();
  findMaxClique(new Set(), new Set(nodes), new Set(), nodes, edges, maxClique);
  return Array.from(maxClique).sort().join(',');
};

(() => {
  console.log(`${day} part 1: ` + part1(input));
  console.log(`${day} part 2: ` + part2(input));
})();
