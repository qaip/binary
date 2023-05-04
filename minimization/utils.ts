export const isNegative = (variable: string | undefined) => !!variable?.startsWith('!');
export const abs = (variable: string) => variable?.replace('!', '');

export const merge = (constituents: string[][]) => {
  if (constituents.length === 1) return constituents;
  const implicants: string[][] = [];
  constituents.forEach((variables, i) => {
    for (let j = 0; j < constituents.length; j++) {
      if (i === j) continue;
      const different = variables.filter((variable, k) =>
        abs(constituents[j][k]) === abs(variable) && constituents[j][k] !== variable
      );
      if (different.length === 1) {
        const equal = variables.filter((variable, k) => constituents[j][k] === variable);
        if (implicants.some((h) => h.join('') === equal.join(''))) return;
        if (equal.length) implicants.push(equal);
        else break;
        return;
      }
    }
    if (implicants.some((graph) => graph.join('') === variables.join(''))) return;
    if (variables.length) implicants.push(variables);
  });
  return implicants;
};

export const stringify = (minimized: string[][], reverse: boolean) => {
  const first = reverse ? '+' : '*';
  const second = reverse ? '*' : '+';
  return minimized.map((group) => group.join(` ${first} `)).join(`  ${second}  `);
};

const f = (a: string[]) => a.map((v, i) => `${+v ? '' : '!'}x${i+1}`).join(' * ');
export const table = (s: TemplateStringsArray) => s[0].split('\n').filter(Boolean).map(g => f(g.split(''))).join('  +  ');
