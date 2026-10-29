# jest-extended types are missing with vitest 5

Minimal reproduction: `jest-extended` matchers no longer type-check with `vitest@5`.

```sh
npm install
npm test            # passes, the matchers work at runtime
npm run type-check  # fails
```

```
example.test.ts(4,25): error TS2339: Property 'toStartWith' does not exist on type 'Assertion<void, string>'.
```

| vitest   | `npm test` | `npm run type-check` |
| -------- | ---------- | -------------------- |
| 4.1.12   | passes     | passes               |
| 5.0.5    | passes     | fails                |

Run `npm i -D vitest@4.1.12` to see the control case.

## Cause

`jest-extended` 7.0.0 adds its matchers to the global `jest.Matchers` interface. `vitest@4`'s `Assertion` extended `jest.Matchers`;
`vitest@5` no longer does and only picks up custom matchers through `interface Matchers<R, T>` in `declare module 'vitest'`.

## Workaround

```ts
import 'vitest';

declare module 'vitest' {
  interface Matchers<R extends void | Promise<void>, T> extends jest.Matchers<R> {}
}
```

This makes `expect.extend(jestExtended)` fail to type-check, so the setup file needs
`expect.extend(jestExtended as unknown as Parameters<typeof expect.extend>[0])`.
