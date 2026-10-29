import { expect, test } from 'vitest';

test('jest-extended matcher', () => {
  expect('hello world').toStartWith('hello');
});
