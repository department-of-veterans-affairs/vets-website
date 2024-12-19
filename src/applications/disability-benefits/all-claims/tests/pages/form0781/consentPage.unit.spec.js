import { expect } from 'chai';
import * as consentPage from '../../../pages/form0781/consentPage';

describe('Form 0781 consent page', () => {
  it('should define a uiSchema object', () => {
    expect(consentPage.uiSchema).to.be.an('object');
  });

  it('should define a schema object', () => {
    expect(consentPage.schema).to.be.an('object');
  });
});
