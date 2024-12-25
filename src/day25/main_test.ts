import { assertEquals } from '@std/assert';
import { day, part1, testsPart1 } from './main.ts';

Deno.test(`${day} part 1`, () => {
  testsPart1.forEach(({ input, result }) => {
    assertEquals(part1(input), result);
  });
});
