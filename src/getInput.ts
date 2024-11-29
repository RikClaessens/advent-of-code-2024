const decoder = new TextDecoder("utf-8");

export const getInput = (path: string) =>
  decoder.decode(Deno.readFileSync(path)).split("\n");

export const getInputAsString = (path: string) =>
  decoder.decode(Deno.readFileSync(path));
