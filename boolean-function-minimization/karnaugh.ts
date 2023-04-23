import { and, or } from './analytical.ts';

export const karnaughMinimize = (constituents: string[][], reverse: boolean, variables: string[]) => {
  const table = constituents.map((conjunct) => conjunct.map((literal) => !literal.startsWith('!')));
  const length = constituents[0]?.length ?? 0;
  const perms = Array.from(permutations(length))
    .filter(
      (permutation) =>
        false !==
          or(
            table.map((record) =>
              and(
                permutation.map((value, index) => value === record[index]),
                reverse,
              )
            ),
            reverse,
          ),
    )
    .map((record) => record.map((variable) => +(variable !== reverse)).join(''));

  const rows = [0, 1];
  const columns = length === 2 ? [[0], [1]] : [[0, 0], [0, 1], [1, 1], [1, 0]]; // prettier-ignore
  const karnaugh = rows.map((first) => columns.map((column) => perms.includes(first + column.join(''))));

  const groups: string[][] = [];
  karnaugh.forEach((row, i) =>
    row.forEach((cell, j) => {
      if (cell) {
        groups.push(getHorisontalGroup(karnaugh, i, j), getVerticalGroup(karnaugh, i, j));
      }
    })
  );

  for (let index = 0; index < groups.length; index++) {
    const cell = groups[index];
    if (cell) {
      if (
        cell.every((value) => groups.some((alt) => alt !== cell && alt?.includes(value) && alt.length >= cell.length))
      ) {
        groups.splice(index--, 1);
      }
    }
  }
  printKarnaugh(rows, columns, perms, reverse);
  console.log(
    groups.map((variables) =>
      variables.map((ij) => {
        return [rows[+ij[0]] + '/', columns[+ij[1]][0], columns[+ij[1]][1]].slice(0, variables.length).join('');
      })
    ),
  );
  const transformed = groups.map((group) => {
    const newGroup = group.map((ij) =>
      [rows[+ij[0]], columns[+ij[1]][0], columns[+ij[1]][1]].slice(0, variables.length)
    );
    return newGroup[0]
      .map(
        (value, index) =>
          newGroup.every((alt) => alt[index] === value) && (value !== +reverse ? '' : '!') + variables[index],
      )
      .filter((x) => x);
  });
  return transformed as string[][];
};

const next = (value: number, limit: number) => (++value >= limit ? 0 : value);

const getHorisontalGroup = (karnaugh: boolean[][], i: number, j: number) => {
  const group = [`${i}${j}`];
  let current = next(j, karnaugh[i].length);
  while (karnaugh[i][current] && current !== j) {
    group.push(`${i}${current}`);
    current = next(current, karnaugh[i].length);
  }
  return group.slice(0, 2 ** Math.trunc(Math.log2(group.length)));
};

const getVerticalGroup = (karnaugh: boolean[][], i: number, j: number) => {
  const group = [`${i}${j}`];
  let current = next(i, karnaugh.length);
  while (karnaugh[current][j] && current !== i) {
    group.push(`${current}${j}`);
    current = next(current, karnaugh.length);
  }
  if (group.length === 2) {
    const nextColumn = group.map((g) => `${g[0]}${next(+g[1], karnaugh[i].length)}`);
    if (nextColumn.every((ij) => karnaugh[+ij[0]][+ij[1]])) {
      group.push(...nextColumn);
    }
  }
  return group.slice(0, 2 ** Math.trunc(Math.log2(group.length)));
};

function* permutations(length: number, values: boolean[] = []): Iterable<boolean[]> {
  if (values.length < length) {
    yield* permutations(length, [...values, false]);
    yield* permutations(length, [...values, true]);
  } else {
    yield values;
  }
}

const printKarnaugh = (rows: number[], columns: number[][], perms: string[], reverse: boolean) => {
  console.table(
    Object.fromEntries(
      rows.map((first) => [
        ' ' + first,
        Object.fromEntries(
          columns.map((
            column,
          ) => [' ' + column.join('') + ' ', +(perms.includes(first + column.join('')) !== reverse)]),
        ),
      ]),
    ),
  );
};
