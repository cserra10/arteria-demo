import chalk from 'chalk';

// ----------------------------------------------------------------------

const styleLabel = (label: string) => chalk.white.bgMagenta.bold(label);

const styleValue = (value: unknown, prettyPrint: boolean) => {
  const stringValue =
    typeof value === 'string' ? value : JSON.stringify(value, null, prettyPrint ? 2 : undefined);

  return chalk.yellowBright(stringValue);
};

export function logger(label: string, value: unknown, breakLine: boolean = false) {
  const logLabel = styleLabel(label);
  const logValue = styleValue(value, breakLine);

  console.log(logLabel, logValue);
}
