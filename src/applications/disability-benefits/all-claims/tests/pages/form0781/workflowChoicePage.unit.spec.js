import { expect } from 'chai';
import * as workflowChoicePage from '../../../pages/form0781/workflowChoicePage';

describe('Form 0781 workflow choice page', () => {
  it('should define a uiSchema object', () => {
    expect(workflowChoicePage.uiSchema).to.be.an('object');
  });

  it('should define a schema object', () => {
    expect(workflowChoicePage.schema).to.be.an('object');
  });
});
