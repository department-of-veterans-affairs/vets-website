import { expect } from 'chai';
import * as startPage from '../../../pages/form0781/startPage';

describe('Form 0781 Start Page', () => {
  it('should define a uiSchema object', () => {
    expect(startPage.uiSchema).to.be.an('object');
  });

  it('should define a schema object', () => {
    expect(startPage.schema).to.be.an('object');
  });
});
