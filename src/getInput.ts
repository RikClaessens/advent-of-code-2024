const decoder = new TextDecoder('utf-8');

export const getInput = (path: string) =>
  decoder.decode(Deno.readFileSync(path)).split('\n');

export const getInputAsString = (path: string) =>
  decoder.decode(Deno.readFileSync(path));

export const makeDir = (path: string) => {
  try {
    Deno.mkdirSync(path);
  } catch (e) {
    console.log(e);
  }
};
export const writeToFile = (path: string, data: string) => {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);
  Deno.writeFileSync(path, encodedData);
};
