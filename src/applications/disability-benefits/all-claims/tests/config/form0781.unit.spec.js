import { expect } from 'chai';

import { form0781PagesConfig } from '../../config/form0781/index';

describe('the form0781PagesConfig entry point object', () => {
  it('should return a config object', () => {
    expect(form0781PagesConfig).to.be.an('object');
  });
});
