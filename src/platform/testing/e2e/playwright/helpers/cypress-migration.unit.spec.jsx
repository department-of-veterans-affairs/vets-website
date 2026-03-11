const { expect } = require('chai');

const {
  assertUrl,
  assertUrlIncludes,
  getMany,
  hasCount,
  hasFocusableCount,
  upload,
  keys,
  repeatKey,
  injectAxe,
  injectAxeThenAxeCheck,
  assertChildText,
  initClaimDetailMocks,
  testStatus,
} = require('./cypress-migration');

describe('Playwright cypress-migration stubs', () => {
  const stubs = {
    assertUrl: { fn: assertUrl, hint: 'toHaveURL' },
    assertUrlIncludes: { fn: assertUrlIncludes, hint: 'toHaveURL' },
    getMany: { fn: getMany, hint: 'locator' },
    hasCount: { fn: hasCount, hint: 'toHaveCount' },
    hasFocusableCount: { fn: hasFocusableCount, hint: 'toHaveCount' },
    upload: { fn: upload, hint: 'setInputFiles' },
    keys: { fn: keys, hint: 'keyboard.press' },
    repeatKey: { fn: repeatKey, hint: 'keyboard.press' },
    injectAxe: { fn: injectAxe, hint: '@axe-core/playwright' },
    injectAxeThenAxeCheck: { fn: injectAxeThenAxeCheck, hint: 'axeCheck' },
    assertChildText: { fn: assertChildText, hint: 'toContainText' },
    initClaimDetailMocks: {
      fn: initClaimDetailMocks,
      hint: 'no Playwright equivalent',
    },
    testStatus: { fn: testStatus, hint: 'no Playwright equivalent' },
  };

  Object.entries(stubs).forEach(([name, { fn, hint }]) => {
    it(`${name}() throws with guidance mentioning "${hint}"`, () => {
      expect(() => fn()).to.throw(Error, hint);
    });
  });

  it('exports all 13 stubs', () => {
    const mod = require('./cypress-migration');
    expect(Object.keys(mod)).to.have.lengthOf(13);
  });
});
