import { assertEquals } from '@std/assert';

if (Deno.args[0]?.startsWith('day')) {
  const { day, part1, part2, testsPart1, testsPart2 } = await import(
    `./${Deno.args[0].toString()}/main.ts`
  );

  type TestPart = {
    input: string[];
    result: number;
  };

  Deno.test(`${day} part 1`, () => {
    (testsPart1 as TestPart[]).forEach(({ input, result }) => {
      assertEquals(part1(input), result);
    });
  });

  Deno.test(`${day} part 2`, () => {
    (testsPart2 as TestPart[]).forEach(({ input, result }) => {
      assertEquals(part2(input), result);
    });
  });
}
