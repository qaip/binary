import { merge } from './utils.ts';

export const quineMcCluskeyMinimize = (constituents: string[][], _reverse: boolean) => {
  const implicants = merge(constituents);
  const table = implicants.map((implicant) =>
    constituents.map((constituent) => implicant.every((variable) => constituent.includes(variable)))
  );
  // printQuineMcCluskeyTable(table, implicants, constituents);
  const final = constituents.reduce((result, _, index) => result + +table.some((record) => record[index]), 0);
  for (let toDelete = 0; toDelete < table.length;) {
    const newFinal = constituents.reduce(
      (result, _, index) => result + +table.some((record, recordIndex) => recordIndex !== toDelete && record[index]),
      0,
    );
    if (final === newFinal) {
      table.splice(toDelete, 1);
      implicants.splice(toDelete, 1);
    } else toDelete++;
  }
  return merge(implicants);
};

const printQuineMcCluskeyTable = (table: boolean[][], implicants: string[][], constituents: string[][]) => {
  console.table(
    Object.fromEntries(
      table.map((record, index) => [
        implicants[index].join(' • '),
        Object.fromEntries(record.map((value, index) => [constituents[index].join(' • '), value && 'X'])),
      ]),
    ),
  );
};
