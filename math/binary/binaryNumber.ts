import type { Binary, BinaryDigit, Input } from './utils.ts';
import { baseParseDecimal, extend, isGreaterThan, shiftLeft } from './utils.ts';

export class BinaryNumber {
  protected value: Binary;

  constructor(input: Input, trim = true) {
    if (typeof input === 'string') {
      this.value = this.parseString(input);
    } else if (typeof input === 'object' && 'raw' in input) {
      this.value = this.parseString(input[0]);
    } else if (typeof input === 'number') {
      this.value = this.parseNumber(input);
    } else {
      this.value = input;
    }
    if (trim) {
      while (this.value[0] === this.value[1] && this.value.length > 1) this.value.shift();
    }
  }

  private onesComplement = () => new BinaryNumber(this.value.map((digit) => (digit ? 0 : 1)));
  private twosComplement = () => this.onesComplement().add('01');
  private abs = () => (this.value[0] ? this.twosComplement().value : this.value);

  private parseString(input: string): Binary {
    return input
      .split('')
      .filter((digit) => digit !== ' ')
      .map((char) => (char === '1' ? 1 : 0));
  }

  protected parseNumber(input: number): Binary {
    const negative = input < 0;
    const result = baseParseDecimal(input);
    if (negative) {
      result.unshift(0);
      return new BinaryNumber(result).twosComplement().value;
    }
    return [0, ...result];
  }

  valueOf() {
    const value = this.value[0] ? this.twosComplement().value : this.value;
    const length = value.length - 1;
    return (
      (-1) ** this.value[0] *
      value.reduce<number>((result, digit, index) => result + (digit && index && 2 ** (length - index)), 0)
    );
  }

  add(input: Input) {
    const addend = new BinaryNumber(input).value;
    let carry: BinaryDigit = 0;
    const sum: Binary = [];
    for (let index = 1; index <= this.value.length || index <= addend.length; index++) {
      const first = this.value[this.value.length - index] ?? this.value[0];
      const second = addend[addend.length - index] ?? addend[0];
      const stack: number = first + second + carry;
      carry = stack > 1 ? 1 : 0;
      sum.unshift((stack & 1) as BinaryDigit);
    }
    if (sum[0] && !this.value[0] && !addend[0]) sum.unshift(0);
    if (!sum[0] && this.value[0] && addend[0]) sum.unshift(1);
    // else sum.unshift(1)
    return new BinaryNumber(sum);
  }

  substract(input: Input) {
    const minuend = new BinaryNumber(input).twosComplement();
    return this.add(minuend.value);
  }

  multiply(input: Input) {
    const multiplier = new BinaryNumber(input);
    const absoluteMultiplicand = this.abs();
    const absoluteMultiplier = multiplier.abs();
    const product = absoluteMultiplier.reduce<BinaryNumber>(
      (product, digit, index) =>
        digit ? product.add(shiftLeft(absoluteMultiplicand, absoluteMultiplier.length - 1 - index)) : product,
      new BinaryNumber([0]),
    );
    return this.value[0] ^ multiplier.value[0] ? product.twosComplement() : product;
  }

  divide(input: Input) {
    const divisor = new BinaryNumber(input);
    const absoluteDivisor = divisor.abs();
    let remainder = this.abs();
    let quotient = new BinaryNumber('01');
    const complement = new BinaryNumber(extend(absoluteDivisor, remainder.length)).twosComplement();
    while (isGreaterThan(remainder, absoluteDivisor)) {
      remainder = complement.add(remainder).value;
      quotient = quotient.add('01');
    }
    return this.value[0] ^ divisor.value[0] ? quotient.twosComplement() : quotient;
  }

  toString() {
    return this.value.join('');
  }

  get text() {
    return this.value.join('').replace(/(0|1){4}/g, (m) => `${m} `).trim();
  }

  get array() {
    return this.value.slice();
  }
}
