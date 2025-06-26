import { expect } from 'chai';
import formConfig from '../../config/form';

describe('21-651 form configuration', () => {
  it('should have the correct form ID', () => {
    expect(formConfig.formId).to.equal('21-651');
  });

  it('should have the correct title and subtitle', () => {
    expect(formConfig.title).to.include('21-651');
    expect(formConfig.subTitle).to.include('21-651');
  });

  it('should have veteran information chapter', () => {
    expect(formConfig.chapters).to.have.property('veteranInformationChapter');
    const chapter = formConfig.chapters.veteranInformationChapter;
    expect(chapter.title).to.equal('Veteran information');
    expect(chapter.pages).to.have.property('veteranInformation');
  });

  it('should have election statement chapter', () => {
    expect(formConfig.chapters).to.have.property('electionStatementChapter');
    const chapter = formConfig.chapters.electionStatementChapter;
    expect(chapter.title).to.equal('Election statement');
    expect(chapter.pages).to.have.property('electionStatement');
  });

  it('should have correct page paths', () => {
    const vetInfoPage =
      formConfig.chapters.veteranInformationChapter.pages.veteranInformation;
    const electionPage =
      formConfig.chapters.electionStatementChapter.pages.electionStatement;

    expect(vetInfoPage.path).to.equal('veteran-information');
    expect(electionPage.path).to.equal('election-statement');
  });

  it('should have prefill enabled', () => {
    expect(formConfig.prefillEnabled).to.be.true;
  });

  it('should have save in progress configured', () => {
    expect(formConfig.savedFormMessages).to.exist;
    expect(formConfig.savedFormMessages.notFound).to.exist;
    expect(formConfig.savedFormMessages.noAuth).to.exist;
  });
});
