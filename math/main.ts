import { bin, fbin } from './binary/index.ts';

const REGEX =
  /^(\+?)(fbin|bin)((`-?(0|1)+`)|(\(-?(\d+)(\.\d+)?\)))((\.(add|substract|multiply|divide))((`-?(0|1)+`)|(\(-?(\d+)(\.\d+)?\))))*(\.text)?$/;

while (true) {
  const expression = prompt('Enter expression:') ?? '';
  bin;
  fbin;
  if (expression && REGEX.test(expression.replaceAll(' ', ''))) {
    console.log('%c' + String(eval(expression)), 'color: green');
  }
}
