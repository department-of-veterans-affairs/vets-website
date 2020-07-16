import { expect } from 'chai';

import prefixUtilityClasses from '../prefix-utility-classes';

describe('prefixUtilityClasses', () => {
  const classes = ['class-1', 'class-2'];
  it('should prefix an array of classes with `vads-u-`', () => {
    const expectedResult = ['vads-u-class-1', 'vads-u-class-2'];
    const result = prefixUtilityClasses(classes);
    expect(result).to.deep.equal(expectedResult);
  });
  it('should prefix an array of classes with `vads-u-` and a responsive prefix when passed an optional screenSize', () => {
    const expectedResult = [
      'medium-screen:vads-u-class-1',
      'medium-screen:vads-u-class-2',
    ];
    const result = prefixUtilityClasses(classes, 'medium');
    expect(result).to.deep.equal(expectedResult);
  });
});
