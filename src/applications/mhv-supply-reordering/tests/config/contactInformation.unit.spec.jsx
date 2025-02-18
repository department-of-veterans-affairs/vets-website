import { expect } from 'chai';
import sinon from 'sinon';

import formConfig from '../../config/form';

describe('editMailingAddress', () => {
  const {
    onNavForward,
  } = formConfig.chapters.contactInformationChapter.pages.contactInformation;

  it('navigates forward to review-and-submit page', () => {
    const goPath = sinon.spy();
    onNavForward({ goPath });
    expect(goPath.calledWith('/review-and-submit')).to.be.true;
  });
});
