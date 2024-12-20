import { expect } from 'chai';
import sinon from 'sinon';
import {
  showForm0781Pages,
  showManualUpload0781Page,
} from '../../utils/form0781';
import { form0781WorkflowChoices } from '../../content/form0781';

describe('showManualUpload0781Page', () => {
  // All new Form 0781 pages must include the showForm0781Pages Flipper,
  // in addition to any page-specific logic, as there is no way to nest
  // them under a single flipper
  it('should return false if showForm0781Pages returns false', () => {
    const show0781PagesStub = sinon.stub(showForm0781Pages, false);

    expect(showManualUpload0781Page({})).to.equal(false);
    show0781PagesStub.restore();
  });

  it('should return true if the mentalHealthWorkflowChoice property is set to Submit Paper Form', () => {
    // Stub Flipper show
    const show0781PagesStub = sinon.stub(showForm0781Pages, true);

    expect(
      showManualUpload0781Page({
        mentalHealthWorkflowChoice: form0781WorkflowChoices.SUBMIT_PAPER_FORM,
      }),
    ).to.equal(true);
    show0781PagesStub.restore();
  });
});

describe('showManualUpload0781Page', () => {
  // All new Form 0781 pages must include the showForm0781Pages Flipper,
  // in addition to any page-specific logic, as there is no way to nest
  // them under a single flipper
  it('should return false if showForm0781Pages returns false', () => {
    const show0781PagesStub = sinon.stub(showForm0781Pages, false);

    expect(showManualUpload0781Page({})).to.equal(false);
    show0781PagesStub.restore();
  });

  it('should return true if the mentalHealthWorkflowChoice property is set to Submit Paper Form', () => {
    // Stub Flipper show
    const show0781PagesStub = sinon.stub(showForm0781Pages, true);

    expect(
      showManualUpload0781Page({
        mentalHealthWorkflowChoice:
          form0781WorkflowChoices.COMPLETE_ONLINE_FORM,
      }),
    ).to.equal(true);
    show0781PagesStub.restore();
  });
});
