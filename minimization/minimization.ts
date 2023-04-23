import { analyticalMinimize } from './analytical.ts';
import { karnaughMinimize } from './karnaugh.ts';
import { quineMcCluskeyMinimize } from './quine-mc-cluskey.ts';
import { stringify } from './utils.ts';
import { abs } from './utils.ts';

const parse = (formula: string, reverse: boolean) => {
  const regex = reverse
    ? /(!?x\d)( \+ (!?x\d))?( \+ (!?x\d))?( \+ (!?x\d))?( \+ (!?x\d))?/g
    : /(!?x\d)( \* (!?x\d))?( \* (!?x\d))?( \* (!?x\d))?( \* (!?x\d))?/g;
  let constituents = Array.from(formula.matchAll(regex)).map((vars) => vars.filter((_, i) => i % 2));
  const variables: string[] = [];
  constituents.forEach((group) => {
    for (const variable of group) {
      if (variable && !variables.includes(abs(variable))) variables.push(abs(variable));
    }
  });
  constituents = constituents.map((vars) => vars.slice(0, variables.length));
  return { constituents, variables };
};

const methods = {
  Analytical: analyticalMinimize,
  QuineMcCluskey: quineMcCluskeyMinimize,
  Karnaugh: karnaughMinimize,
};

export const minimize = (formula: string, method: keyof typeof methods) => {
  const reverse = /^(( *\* *)?(!?x\d)( *\+ *(!?x\d))( *\+ *(!?x\d))?)+/.test(formula);
  let { constituents, variables } = parse(formula, reverse);
  constituents = methods[method](constituents, reverse, variables);
  return stringify(constituents, reverse);
};
