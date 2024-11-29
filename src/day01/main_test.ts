import { assertEquals } from "@std/assert";
import { day, part1, part2, testsPart1, testsPart2 } from "./main.ts";

Deno.test(`${day} part 1`, () => {
  testsPart1.forEach(({ input, result }) => {
    assertEquals(part1(input), result);
  });
});

Deno.test(`${day} part 2`, () => {
  testsPart2.forEach(({ input, result }) => {
    assertEquals(part2(input), result);
  });
});
