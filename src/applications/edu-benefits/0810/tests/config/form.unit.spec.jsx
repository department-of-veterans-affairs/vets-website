import { expect } from 'chai';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';

describe('22-0810 Form Config', () => {
  it('should load form config basics', () => {
    expect(formConfig).to.be.an('object');
    expect(formConfig.rootUrl).to.equal(manifest.rootUrl);
    expect(formConfig).to.have.property('chapters');
  });
});

describe('22-0810 formConfig', () => {
  describe('personalInformationChapter -> payeeNumber', () => {
    const page =
      formConfig.chapters.personalInformationChapter.pages.payeeNumber;

    it('is wired with required fields', () => {
      expect(page.path).to.equal('payee-number');
      expect(page.title).to.equal('Payee Number');
      expect(page.uiSchema).to.be.an('object');
      expect(page.schema).to.be.an('object');
      expect(page.depends).to.be.a('function');
    });

    it('depends on vaBenefitProgram === "chapter35"', () => {
      expect(page.depends({ vaBenefitProgram: 'chapter35' })).to.be.true;
      expect(page.depends({ vaBenefitProgram: 'ch33' })).to.be.false;
      expect(page.depends({})).to.be.false;
      expect(page.depends(undefined)).to.be.false;
    });
  });
});
