import { Minimize } from './minimization.ts';

Minimize`
0110
0111
1000
1001
`
// OUTPUT:
// in: !x1 * x2 * x3 * !x4  +  !x1 * x2 * x3 * x4  +  x1 * !x2 * !x3 * !x4  +  x1 * !x2 * !x3 * x4
// out: !x1 * x2 * x3  +  x1 * !x2 * !x3

Minimize`
0010
0011
0100
0101
`
// OUTPUT:
// in: !x1 * !x2 * x3 * !x4  +  !x1 * !x2 * x3 * x4  +  !x1 * x2 * !x3 * !x4  +  !x1 * x2 * !x3 * x4
// out: !x1 * !x2 * x3  +  !x1 * x2 * !x3

Minimize`
0000
0001
0100
0101
1000
1001
`
// OUTPUT:
// in: !x1 * !x2 * !x3 * !x4  +  !x1 * !x2 * !x3 * x4  +  !x1 * x2 * !x3 * !x4  +  !x1 * x2 * !x3 * x4  +  x1 * !x2 * !x3 * !x4  +  x1 * !x2 * !x3 * x4
// out: !x1 * !x3  +  !x2 * !x3

Minimize`
0001
0011
0101
0111
1001
`
// OUTPUT:
// in: !x1 * !x2 * !x3 * x4  +  !x1 * !x2 * x3 * x4  +  !x1 * x2 * !x3 * x4  +  !x1 * x2 * x3 * x4  +  x1 * !x2 * !x3 * x4
// out: !x2 * !x3 * x4  +  !x1 * x4
