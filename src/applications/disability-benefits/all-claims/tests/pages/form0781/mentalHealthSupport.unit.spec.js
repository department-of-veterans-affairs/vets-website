import { expect } from 'chai';
import * as mentalHealthSupport from '../../../pages/form0781/mentalHealthSupport';

describe('Mental health support', () => {
  it('should define a uiSchema object', () => {
    expect(mentalHealthSupport.uiSchema).to.be.an('object');
  });

  it('should define a schema object', () => {
    expect(mentalHealthSupport.schema).to.be.an('object');
  });
});
