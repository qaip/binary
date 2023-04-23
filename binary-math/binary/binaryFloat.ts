import { BinaryNumber } from './binaryNumber.ts';
import type { Binary, BinaryDigit, Input } from './utils.ts';
import { baseParseDecimal, extend, isGreaterThan, shiftLeft } from './utils.ts';

export class BinaryFloat extends BinaryNumber {
  private static ExponentBits = 8;
  private static Length = 64;
  private static Bias = 2 ** (BinaryFloat.ExponentBits - 1) - 1;

  constructor(input: Input) {
    super(input, false);
  }

  protected override parseNumber(input: number): Binary {
    const integralPart = Math.trunc(input);
    let fractionPart = input - integralPart;
    const result = baseParseDecimal(integralPart);
    const exponent = result.length ? baseParseDecimal(BinaryFloat.Bias + result.length - 1) : [];
    result.splice(0, 1, ...extend(exponent, BinaryFloat.ExponentBits));
    while (result.length < BinaryFloat.Length - 1) {
      fractionPart *= 2;
      result.push((fractionPart & 1) as BinaryDigit);
    }
    result.unshift(input < 0 ? 1 : 0);
    return result;
  }

  private parts() {
    const sign = this.value[0];
    const exponent: Binary = this.value.slice(1, BinaryFloat.ExponentBits + 1);
    const mantissa: Binary = this.value.slice(BinaryFloat.ExponentBits + 1);
    mantissa.unshift(1);
    return { sign, exponent, mantissa };
  }

  override valueOf() {
    const { sign, exponent, mantissa } = this.parts();
    const mantissaDecimal = mantissa.reduce<number>((result, digit, index) => result + (digit && 2 ** -index), 0);
    const exponentDecimal = Number(new BinaryNumber([0, ...exponent]));
    if (!exponentDecimal) return 0;
    return (-1) ** sign * mantissaDecimal * 2 ** (exponentDecimal - BinaryFloat.Bias);
  }

  override toString() {
    const s = super.toString();
    return `${s[0]} ${s.slice(1, BinaryFloat.ExponentBits + 1)} ${s.slice(BinaryFloat.ExponentBits + 1)}`;
  }

  override add(input: Input) {
    let augend = this.parts();
    let addend = new BinaryFloat(input).parts();
    const augentAbsoluteIsGreater = isGreaterThan(augend.exponent, addend.exponent) ||
      (!isGreaterThan(addend.exponent, augend.exponent) && isGreaterThan(augend.mantissa, addend.mantissa));
    if (!augentAbsoluteIsGreater) [augend, addend] = [addend, augend];

    // Step 1: Equalize exponents by shifting addend's mantissa
    const shift = Number(new BinaryNumber([0, ...augend.exponent]).substract([0, ...addend.exponent]));
    addend.mantissa = extend(addend.mantissa, addend.mantissa.length + shift).slice(0, -shift);
    addend.exponent = augend.exponent.slice();

    // Step 2: Either add or substract mantissas based on the sign bits
    const operation = augend.sign === addend.sign ? 'add' : 'substract';
    let mantissa = new BinaryNumber([0, ...augend.mantissa])[operation]([0, ...addend.mantissa]).array.slice(2);
    const unshift = augend.mantissa.length - mantissa.length - 1;
    mantissa = unshift < 0 ? mantissa.slice(0, unshift) : shiftLeft(mantissa, unshift);

    // Step 3: Collect the parts and return the result
    const exponent = new BinaryNumber(augend.exponent).substract(unshift).array;
    return new BinaryFloat([augend.sign, ...exponent, ...mantissa]);
  }

  override substract(input: Input) {
    const minuend = new BinaryFloat(input).value;
    minuend[0] = (minuend[0] ^ 1) as BinaryDigit;
    return this.add(minuend);
  }
}
