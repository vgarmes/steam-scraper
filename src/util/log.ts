import pc from 'picocolors';

const symbols = {
  info: pc.blue('ℹ'),
  success: pc.green('✔'),
  warning: pc.yellow('⚠'),
  error: pc.red('✖'),
};

export const logInfo = (input: string | number) =>
  console.log(`${symbols.info} ${pc.blue(input)}`);
export const logError = (input: string | number) =>
  console.log(`${symbols.error} ${pc.red(input)}`);
export const logSuccess = (input: string | number) =>
  console.log(`${symbols.success} ${pc.green(input)}`);
export const logWarning = (input: string | number) =>
  console.log(`${symbols.warning} ${pc.yellow(input)}`);
