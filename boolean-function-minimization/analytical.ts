import { abs, isNegative, merge, stringify } from './utils.ts';

export const analyticalMinimize = (constituents: string[][], reverse: boolean) => {
  const implicants = merge(merge(constituents));
  if (implicants.length === 1) return implicants;
  return implicants.filter((group) => {
    const dict: Record<string, boolean> = {};
    group.map((variable) => {
      dict[abs(variable)] = isNegative(variable) === reverse;
      dict['!' + abs(variable)] = isNegative(variable) !== reverse;
    });
    return !and(
      implicants.map((implicant) =>
        group !== implicant && or(implicant.map((variable) => dict[variable] ?? variable), reverse)
      ),
      reverse,
    );
  });
};

export const or = (args: Array<string | boolean>, reverse: boolean) => {
  if (args.includes(true)) return true;
  const result = merge(args.filter((arg) => arg !== false).map((vars) => [vars as string]));
  return result.length ? stringify(result, reverse) : false;
};

export const and = (args: Array<string | boolean>, reverse: boolean) => {
  if (args.includes(false)) return false;
  const result = merge([args.filter((arg) => arg !== true) as string[]]);
  return result.length ? stringify(result, reverse) : true;
};
