import { assertEquals } from 'https://deno.land/std@0.177.0/testing/asserts.ts';
import { bin, fbin } from './binary/index.ts';

Deno.test('Positive to Decimal', () => assertEquals(+ bin `0100011`, 35));
Deno.test('Negative to Decimal', () => assertEquals(+ bin `1011101`, -35));

Deno.test('Decimal to Positive', () => assertEquals(bin(75) .text, '0100 1011'));
Deno.test('Decimal to Negative', () => assertEquals(bin(-75) .text, '1011 0101'));

Deno.test('Positive + Positive', () => assertEquals(+ bin (7) .add (15), 22));
Deno.test('Positive + Negative', () => assertEquals(+ bin (7) .add (-15), -8));
Deno.test('Negative + Positive', () => assertEquals(+ bin (-7) .add (15), 8));
Deno.test('Negative + Negative', () => assertEquals(+ bin (-7) .add (-15), -22));

Deno.test('Positive - Positive', () => assertEquals(+ bin (7) .substract (15), -8));
Deno.test('Positive - Negative', () => assertEquals(+ bin (7) .substract (-15), 22));
Deno.test('Negative - Positive', () => assertEquals(+ bin (-7) .substract (15), -22));
Deno.test('Negative - Negative', () => assertEquals(+ bin (-7) .substract (-15), 8));

Deno.test('Positive * Positive', () => assertEquals(+ bin (5) .multiply (7), 35));
Deno.test('Positive * Negative', () => assertEquals(+ bin (5) .multiply (-7), -35));
Deno.test('Negative * Positive', () => assertEquals(+ bin (-5) .multiply (7), -35));
Deno.test('Negative * Negative', () => assertEquals(+ bin (-5) .multiply (-7), 35));

Deno.test('Positive / Positive', () => assertEquals(+ bin (35) .divide (7), 5));
Deno.test('Positive / Negative', () => assertEquals(+ bin (35) .divide (-7), -5));
Deno.test('Negative / Positive', () => assertEquals(+ bin (-35) .divide (7), -5));
Deno.test('Negative / Negative', () => assertEquals(+ bin (-35) .divide (-7), 5));

Deno.test('Float: Positive + Positive', () => assertEquals(+ fbin (4.256) .add (24.713), 28.969));
Deno.test('Float: Positive + Negative', () => assertEquals(+ fbin (4.256) .add (-24.713), -20.457));
Deno.test('Float: Negative + Positive', () => assertEquals(+ fbin (-4.256) .add (24.713), 20.457));
Deno.test('Float: Negative + Negative', () => assertEquals(+ fbin (-4.256) .add (-24.713), -28.969));

Deno.test('Float: Positive - Positive', () => assertEquals(+ fbin (4.256) .substract (24.713), -20.457));
Deno.test('Float: Positive - Negative', () => assertEquals(+ fbin (4.256) .substract (-24.713), 28.969));
Deno.test('Float: Negative - Positive', () => assertEquals(+ fbin (-4.256) .substract (24.713), -28.969));
Deno.test('Float: Negative - Negative', () => assertEquals(+ fbin (-4.256) .substract (-24.713), 20.457));
