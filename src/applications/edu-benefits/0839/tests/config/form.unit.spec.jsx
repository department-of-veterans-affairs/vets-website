import { expect } from 'chai';
import sinon from 'sinon';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';

describe('22-0839 Form Config', () => {
  it('should load form config basics', () => {
    expect(formConfig).to.be.an('object');
    expect(formConfig.rootUrl).to.contain(manifest.rootUrl);
    expect(formConfig).to.have.property('chapters');
  });

  it('agreementType onNavForward navigates correctly based on selection', () => {
    const page = formConfig.chapters.agreementTypeChapter.pages.agreementType;
    expect(page).to.have.property('onNavForward');

    const goPath = sinon.spy();

    page.onNavForward({
      formData: { agreementType: 'startNewOpenEndedAgreement' },
      goPath,
    });
    expect(goPath.calledWith('acknowledgements')).to.be.true;

    const goPathSecond = sinon.spy();

    page.onNavForward({
      formData: { agreementType: 'withdrawFromYellowRibbonProgram' },
      goPath: goPathSecond,
    });
    expect(goPathSecond.calledWith('institution-details-facility')).to.be.true;
  });
});
