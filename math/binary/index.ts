import { BinaryFloat } from './binaryFloat.ts';
import { BinaryNumber } from './binaryNumber.ts';
import { Input } from './utils.ts';

export function bin(input: Input) {
  return new BinaryNumber(input);
}

export function fbin(input: Input) {
  return new BinaryFloat(input);
}
