import { minimize } from './minimization.ts';

// const formula = '!x1 * x2 * x3  +  !x1 * !x2 * !x3  +  x1 * x2 * !x3';
// const formula = '!x1 * x2 * x3  +  !x1 * !x2 * x3'; // ~x1 x2 x3  +  ~x1 ~x2 x3
// const formula = '!x1 + x2 + x3  *  !x1 + !x2 + x3'; // ( ~x1 + x2 + x3 )  ( ~x1 + ~x2 + x3 )
const formula = '!x1 + x2 + x3  *  !x1 + !x2 + !x3  *  x1 + x2 + !x3  *  x1 + !x2 + !x3'; // (~x1 + x2 + x3) (~x1 + ~x2 + ~x3) (x1 + x2 + ~x3) (x1 + ~x2 + ~x3)
// const formula = '!x1 * x2 * x3  +  !x1 * !x2 * !x3  +  x1 * x2 * !x3';
// const formula4 = '!x1 + x2 + x3 + !x4  *  !x1 + !x2 + x3 + !x4  *  !x1 + x2 + !x3 + !x4  *  !x1 + !x2 + !x3 + !x4' // (!x1 + x2 + x3 + !x4)  *  (!x1 + !x2 + x3 + !x4)  *  (!x1 + x2 + !x3 + !x4)  *  (!x1 + !x2 + !x3 + !x4)

console.log(formula);
console.log();
const reverse = /^(( *\* *)?(!?x\d)( *\+ *(!?x\d))+)+/.test(formula);
console.log(reverse ? 'СКНФ' : 'СДНФ');
console.log();

console.log(minimize(formula, 'Analytical'));
console.log(minimize(formula, 'QuineMcCluskey'));
console.log(minimize(formula, 'Karnaugh'));
