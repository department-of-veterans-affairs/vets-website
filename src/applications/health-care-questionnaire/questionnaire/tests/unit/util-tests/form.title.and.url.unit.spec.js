import { expect } from 'chai';

import { createPathFromTitle } from '../../../config/utils';

describe('health care questionnaire -- utils -- title to url converter ', () => {
  it('title is undefined. should crash', () => {
    expect(() => createPathFromTitle()).to.throw(TypeError);
  });
  it('title is defined. ', () => {
    const title = 'This Is My Cool Title';
    const result = createPathFromTitle(title);
    expect(result).to.equal('this-is-my-cool-title');
  });
});
