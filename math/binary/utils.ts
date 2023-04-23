export type BinaryDigit = 0 | 1;
export type Binary = BinaryDigit[];
export type Input = string | TemplateStringsArray | number | Binary;

export const fill = (digit: BinaryDigit, times: number): Binary =>
  Array.from<BinaryDigit>({ length: times }).fill(digit);
export const shiftLeft = (binary: Binary, shift: number) => binary.concat(fill(0, shift));
export const extend = (binary: Binary, length: number) => fill(0, length - binary.length).concat(binary);

export const isGreaterThan = (primary: Binary, secondary: Binary) => {
  if (primary.length > secondary.length) return true;
  if (primary.length < secondary.length) return false;
  for (let index = 0; index <= primary.length; index++) {
    if (primary[index] && !secondary[index]) return true;
    if (!primary[index] && secondary[index]) return false;
  }
  return false;
};

export const baseParseDecimal = (input: number) => {
  const result: Binary = [];
  while (input) {
    result.unshift((input & 1) as BinaryDigit);
    if (result[0]) input -= input % 2;
    input /= 2;
  }
  return result;
};
