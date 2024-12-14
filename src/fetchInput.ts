const day = Deno.args[0];
const AOC_SESSION = Deno.env.get('AOC_SESSION');

if (!AOC_SESSION) {
  console.log('Please set the AOC_SESSION environment variable');
}
if (!day || !day.startsWith('day')) {
  console.log('Please provide a valid day');
}

if (day?.startsWith('day') && AOC_SESSION) {
  const textResponse = await fetch(
    `https://adventofcode.com/2024/day/${day.substring(3)}/input`,
    { headers: { Cookie: AOC_SESSION } },
  );
  const textData = await textResponse.text();
  const outputFile = `src/${day}/input.txt`;
  const data = new TextEncoder().encode(textData);
  Deno.writeFileSync(outputFile, data.slice(0, data.length - 1));
  console.log(`🎄 Input written to ${outputFile}`);
}
