import { expect } from 'chai';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';

describe('22-0839 Form Config', () => {
  it('should load form config basics', () => {
    expect(formConfig).to.be.an('object');
    expect(formConfig.rootUrl).to.contain(manifest.rootUrl);
    expect(formConfig).to.have.property('chapters');
  });

  it('has the right depends for benefits information', () => {
    const {
      chapters: {
        benefitsInformationChapter: { pages },
      },
    } = formConfig;

    const { selectVABenefit, vaBenefitWarning } = pages;
    const data = {
      hasPreviouslyApplied: true,
    };
    expect(selectVABenefit.depends(data)).to.eq(true);
    expect(vaBenefitWarning.depends(data)).to.eq(false);
  });

  it('has the right depends for personal information', () => {
    const {
      chapters: {
        personalInformationChapter: { pages },
      },
    } = formConfig;

    const { payeeNumber } = pages;
    const data = {
      vaBenefitProgram: 'chapter35',
      vaFileNumber: '123456789',
    };
    expect(payeeNumber.depends(data)).to.eq(true);
  });
});
