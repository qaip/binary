const ALPHABET = {
  CONSTANT: '01',
  LETTER: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  UNARY_OPERATORS: '!',
  OPERATORS: ['/\\', '\\/', '->', '~'],
};

export class ShortenBooleanFunction {
  variables = new Set<string>();

  constructor(public readonly expression: string) {
    const chars = expression.split('');
    const lastVariable = this.parse(chars);
    if (chars.length) {
      throw new SyntaxError(`Unexpected '${chars[0]}' after '${lastVariable ?? ''}'`);
    }
    if (!this.variables.size) {
      throw new SyntaxError('The formula is invalid or empty');
    }
  }

  private parseAtomic(input: string[]) {
    let letters = '';
    if (input[0] && (ALPHABET.LETTER.includes(input[0]) || ALPHABET.CONSTANT.includes(input[0]))) {
      return input.shift();
    }
    return letters;
  }

  parse(input: string[]): string | undefined {
    if (input[0] === '(') {
      input.shift();
      if (ALPHABET.UNARY_OPERATORS.includes(input[0])) {
        const operator = input.shift()!;
        const operand = this.parse(input);
        if (!operand) {
          throw new SyntaxError(`No operand found for operator '${operator}'`);
        }
        if (input.shift() !== ')') {
          throw new SyntaxError(`No closing bracket found after '(${operator}${operand}'`);
        }
        const variable = `(${operator}${operand})`;
        this.variables.add(variable);
        return variable;
      }
      const first = this.parse(input);
      if (!first) {
        throw new SyntaxError(`No operand found after opening bracket (unexpected '${input[0]}')`);
      }
      let operator = input.shift();
      if (!operator || !ALPHABET.OPERATORS.includes(operator)) {
        operator += input.shift() ?? '';
        if (!operator || !ALPHABET.OPERATORS.includes(operator)) {
          throw new SyntaxError(`No operator found after '(${first}' (unexpected '${operator}')`);
        }
      }
      const second = this.parse(input);
      if (!second) {
        throw new SyntaxError(`No operand found after '(${first}${operator}' (unexpected '${input[0]}')`);
      }
      if (input.shift() !== ')') {
        throw new SyntaxError(`No closing bracket found after '(${first}${operator}${second}'`);
      }
      const variable = `(${first}${operator}${second})`;
      this.variables.add(variable);
      return variable;
    }
    const atomic = this.parseAtomic(input);
    if (atomic) {
      this.variables.add(atomic);
      return atomic;
    }
  }
}

const main = (expression?: string) => {
  if (!expression) expression = prompt('Введите формулу:') ?? '';
  console.log();
  try {
    const func = new ShortenBooleanFunction(expression);
    console.log(`%cПодформул: ${func.variables.size}`, 'color: green');
    console.log('%c' + [...func.variables.values()].sort((a, b) => a.length - b.length).join(',  '), 'color: green');
  } catch (e) {
    if (e instanceof SyntaxError) {
      console.error('%c' + e.message, 'color: red');
    } else {
      console.error(e);
    }
  }
  console.log();
};

main();
while (true) {
  const response = prompt('Хотите продолжить? [Y/n]');
  if (response === 'n') break;
  if (response && response !== 'y') continue;
  main();
}

// main(`
//   ( (!(!A)) ~ (0 -> (!1)) )
// `);
