import {exec} from 'child_process';
import {exit} from 'process';
import spawn from 'cross-spawn';

function sanitizeKeyForRegex(key: string) {
  // return key.replace(/([.^$*+?{}()|\[\]\\\/\-&])/g, '\\$1');
  return key.replace(/([.^$*+?{}()|[\]\\/\-&])/g, '\\$1');
}
function fillCommandWithValues(args: string[]) {
  return args.map((arg) => {
    Object.keys(process.env)
      .sort((x, y) => y.length - x.length) // sort by descending length to prevent partial replacement
      .forEach((key) => {
        const sKey = sanitizeKeyForRegex(key);
        console.log(sKey);
        const regex = new RegExp(`\\$${sKey}|\${${sKey}}|%${sKey}%`, 'ig');
        arg = arg.replace(regex, process.env[key]);
      });
    return arg;
  });
}

let args = process.argv.slice(2);
if (args.length === 1) {
  const [command] = fillCommandWithValues(args);
  const proc = exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    process.stdout.write(stdout);
    process.stderr.write(stderr);
    exit(proc.exitCode);
  });
} else if (args.length > 1) {
  args = fillCommandWithValues(args);
  const command = args.shift();
  const proc = spawn.sync(command, args, {stdio: 'inherit'});
  exit(proc.status);
}
