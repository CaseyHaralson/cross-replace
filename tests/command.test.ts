import {execSync} from 'child_process';
import os from 'os';

test('example output', async () => {
  const expected = 'worked1 and worked2 and worked3 and worked4';
  const output = execSync(
    'npm run example --test1=worked1 --test2=worked2 --test3=worked3 --test4=worked4'
  );
  const cleanedOutput = cleanOutput(output.toString());
  expect(cleanedOutput).toBe(expected);
});

test('example:multiple-of-same output', async () => {
  const expected = 'worked1 and worked1 and worked1 and worked1';
  const output = execSync('npm run example:multiple-of-same --test1=worked1');
  const cleanedOutput = cleanOutput(output.toString());
  expect(cleanedOutput).toBe(expected);
});

// each OS handles special chars differently...
// macos: ++ and worked1
// ubuntu: ++ and %npm_config_Notepad++%
// windows: worked1 and worked1
// test('example:with-special-chars output', async () => {
//   const expected = 'worked1 and worked1';
//   const output = execSync(
//     'npm run example:with-special-chars --Notepad++=worked1'
//   );
//   const cleanedOutput = cleanOutput(output.toString());
//   expect(cleanedOutput).toBe(expected);
// });

test('example:replacement-not-found output', async () => {
  const expected = ' and  and  and ';
  const output = execSync('npm run example:replacement-not-found');
  const cleanedOutput = cleanOutput(output.toString());
  expect(cleanedOutput).toBe(expected);
});

test('example:dollar-brackets output', async () => {
  const expected = 'worked1 and worked2 and worked3';
  const output = execSync(
    'npm run example:dollar-brackets --test1=worked1 --test2=worked2 --test3=worked3'
  );
  const cleanedOutput = cleanOutput(output.toString());
  expect(cleanedOutput).toBe(expected);
});

test('example:empty-command output', async () => {
  const expected = '';
  const output = execSync('npm run example:empty-command');
  const cleanedOutput = cleanOutput(output.toString());
  expect(cleanedOutput).toBe(expected);
});

// =======================================
//          helper functions
// =======================================

function cleanOutput(output: string) {
  const commandLineRegex = new RegExp(/^> cross-replace/);
  const lines = output.split('\n');
  const cleanedLines = lines.filter(
    (line) => !commandLineRegex.test(line) && !(line.trim().length === 0)
  );
  return cleanedLines.join(os.EOL);
}
