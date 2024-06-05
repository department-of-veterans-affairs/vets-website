# Config Documentation

## Purpose

This document exists to help document any configurations within this folder

### Typescript

The `base-tsconfig.json` is meant as a starting point for any typescript projects that are used.

Applications wishing to use typescript should inherit from the base-tsconfig.json

```
{
  "extends": "../../../config/base-tsconfig.json",
  "compilerOptions": {
    "strictNullChecks": false // example of an override
  }
}
```

Additional documentation on Typescript
https://www.typescriptlang.org/tsconfig
https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html
https://www.typescriptlang.org/docs/handbook/project-references.html

### Cypress

### Mocha

### Webpack
