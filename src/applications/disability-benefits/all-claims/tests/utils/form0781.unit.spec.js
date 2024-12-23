import { expect } from 'chai';
import sinon from 'sinon';
import * as form0781Utils from '../../utils/form0781';
import { form0781WorkflowChoices } from '../../content/form0781';

describe('showManualUpload0781Page', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  // All new Form 0781 pages must include the showForm0781Pages Flipper,
  // in addition to any page-specific logic, as there is no way to nest
  // them under a single flipper
  // it('should return false if showForm0781Pages returns false', () => {
  // });

  it('should return true if the mentalHealthWorkflowChoice property is set to Submit Paper Form', () => {
    const show0781PagesStub = sandbox.stub(form0781Utils, 'showForm0781Pages');
    show0781PagesStub.returns(true);

    expect(
      form0781Utils.showManualUpload0781Page({
        mentalHealthWorkflowChoice: form0781WorkflowChoices.SUBMIT_PAPER_FORM,
      }),
    ).to.equal(true);
  });
});
