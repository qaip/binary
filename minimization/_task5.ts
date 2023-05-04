import { Minimize } from './minimization.ts';

Minimize`
0001
1001
`
// OUTPUT:
// in: !x1 * !x2 * !x3 * x4  +  x1 * !x2 * !x3 * x4
// out: !x2 * !x3 * x4

Minimize`
0001
1101
1001
0101
`
// OUTPUT:
// in: !x1 * !x2 * !x3 * x4  +  x1 * x2 * !x3 * x4  +  x1 * !x2 * !x3 * x4  +  !x1 * x2 * !x3 * x4
// out: !x3 * x4

Minimize`
0001
1111
1101
1011
1001
0111
0101
0011
`
// OUTPUT:
// in: !x1 * !x2 * !x3 * x4  +  x1 * x2 * x3 * x4  +  x1 * x2 * !x3 * x4  +  x1 * !x2 * x3 * x4  +  x1 * !x2 * !x3 * x4  +  !x1 * x2 * x3 * x4  +  !x1 * x2 * !x3 * x4  +  !x1 * !x2 * x3 * x4
// out: x4
