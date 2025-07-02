import { expect } from 'chai';
import { VA_FORM_IDS } from 'platform/forms/constants';
import formConfig from '../../config/form';
import { TITLE } from '../../constants';

describe('Form Configuration', () => {
  it('exports a valid form config object', () => {
    expect(formConfig).to.be.an('object');
  });

  it('has correct basic properties', () => {
    expect(formConfig.formId).to.equal(VA_FORM_IDS.FORM_DISPUTE_DEBT);
    expect(formConfig.title).to.equal(TITLE);
    expect(formConfig.trackingPrefix).to.equal('dispute-debt');
    expect(formConfig.version).to.equal(0);
    expect(formConfig.prefillEnabled).to.be.true;
  });

  it('has correct URL configuration', () => {
    expect(formConfig.rootUrl).to.exist;
    expect(formConfig.urlPrefix).to.equal('/');
    expect(formConfig.submitUrl).to.include('/debts_api/v0/digital_disputes');
  });

  it('has required form functions', () => {
    expect(formConfig.submit).to.be.a('function');
    expect(formConfig.transformForSubmit).to.be.a('function');
    expect(formConfig.getHelp).to.be.a('function');
  });

  it('has introduction and confirmation pages', () => {
    expect(formConfig.introduction).to.exist;
    expect(formConfig.confirmation).to.exist;
  });

  it('has save in progress configuration', () => {
    expect(formConfig.saveInProgress).to.be.an('object');
    expect(formConfig.saveInProgress.messages).to.be.an('object');
    expect(formConfig.saveInProgress.messages.inProgress).to.include(
      'disputing your VA debt',
    );
    expect(formConfig.saveInProgress.messages.expired).to.include('expired');
    expect(formConfig.saveInProgress.messages.saved).to.include('saved');
  });

  it('has saved form messages', () => {
    expect(formConfig.savedFormMessages).to.be.an('object');
    expect(formConfig.savedFormMessages.notFound).to.include(
      'start your application over',
    );
    expect(formConfig.savedFormMessages.noAuth).to.include('sign in again');
  });

  it('has downtime dependencies', () => {
    expect(formConfig.downtime).to.be.an('object');
    expect(formConfig.downtime.dependencies).to.be.an('array');
    expect(formConfig.downtime.dependencies.length).to.be.at.least(1);
  });

  it('has dev configuration', () => {
    expect(formConfig.dev).to.be.an('object');
    expect(formConfig.dev.showNavLinks).to.be.false;
    expect(formConfig.dev.collapsibleNavLinks).to.be.false;
  });

  describe('chapters configuration', () => {
    it('has chapters object', () => {
      expect(formConfig.chapters).to.be.an('object');
    });

    it('has personalInformationChapter', () => {
      const chapter = formConfig.chapters.personalInformationChapter;
      expect(chapter).to.exist;
      expect(chapter.title).to.equal('Veteran information');
      expect(chapter.pages).to.be.an('object');
      expect(chapter.pages.veteranInformation).to.exist;
    });

    it('has debtSelectionChapter', () => {
      const chapter = formConfig.chapters.debtSelectionChapter;
      expect(chapter).to.exist;
      expect(chapter.title).to.equal('Debt Selection');
      expect(chapter.pages).to.be.an('object');
      expect(chapter.pages.selectDebt).to.exist;
    });

    it('has reasonForDisputeChapter', () => {
      const chapter = formConfig.chapters.reasonForDisputeChapter;
      expect(chapter).to.exist;
      expect(chapter.title).to.equal('Reason for dispute');
      expect(chapter.pages).to.be.an('object');
      expect(chapter.pages.disputeReason).to.exist;
      expect(chapter.pages.supportStatement).to.exist;
    });

    it('has veteranInformation page configured correctly', () => {
      const page =
        formConfig.chapters.personalInformationChapter.pages.veteranInformation;
      expect(page.title).to.equal('Your personal information');
      expect(page.path).to.equal('personal-information');
      expect(page.uiSchema).to.exist;
      expect(page.schema).to.exist;
    });

    it('has selectDebt page configured correctly', () => {
      const page = formConfig.chapters.debtSelectionChapter.pages.selectDebt;
      expect(page.path).to.equal('select-debt');
      expect(page.title).to.equal('Which debt are you disputing?');
      expect(page.uiSchema).to.exist;
      expect(page.schema).to.exist;
      expect(page.initialData).to.deep.equal({ selectedDebts: [] });
      expect(page.CustomPageReview).to.exist;
    });

    it('has disputeReason page configured correctly', () => {
      const page =
        formConfig.chapters.reasonForDisputeChapter.pages.disputeReason;
      expect(page.path).to.equal('existence-or-amount/:index');
      expect(page.title).to.be.a('function');
      expect(page.uiSchema).to.exist;
      expect(page.schema).to.exist;
      expect(page.showPagePerItem).to.be.true;
      expect(page.arrayPath).to.equal('selectedDebts');
      expect(page.CustomPageReview).to.exist;
    });

    it('has supportStatement page configured correctly', () => {
      const page =
        formConfig.chapters.reasonForDisputeChapter.pages.supportStatement;
      expect(page.path).to.equal('dispute-reason/:index');
      expect(page.title).to.be.a('function');
      expect(page.uiSchema).to.exist;
      expect(page.schema).to.exist;
      expect(page.showPagePerItem).to.be.true;
      expect(page.arrayPath).to.equal('selectedDebts');
      expect(page.CustomPageReview).to.exist;
    });

    it('has chapterPlaceholder page configured correctly', () => {
      const page =
        formConfig.chapters.reasonForDisputeChapter.pages.chapterPlaceholder;
      expect(page.path).to.equal('chapter-placeholder');
      expect(page.title).to.equal('Chapter placeholder');
      expect(page.depends).to.be.a('function');
      expect(page.uiSchema).to.be.an('object');
      expect(page.schema).to.be.an('object');
      expect(page.schema.type).to.equal('object');
    });
  });

  describe('getHelp function', () => {
    it('returns a React component', () => {
      const helpComponent = formConfig.getHelp();
      expect(helpComponent).to.exist;
      expect(helpComponent.type).to.exist;
    });
  });

  describe('chapterPlaceholder depends function', () => {
    it('returns true when no selected debts', () => {
      const page =
        formConfig.chapters.reasonForDisputeChapter.pages.chapterPlaceholder;
      const result = page.depends({});
      expect(result).to.be.true;
    });

    it('returns true when selectedDebts is empty array', () => {
      const page =
        formConfig.chapters.reasonForDisputeChapter.pages.chapterPlaceholder;
      const result = page.depends({ selectedDebts: [] });
      expect(result).to.be.true;
    });

    it('returns false when selectedDebts has items', () => {
      const page =
        formConfig.chapters.reasonForDisputeChapter.pages.chapterPlaceholder;
      const result = page.depends({ selectedDebts: [{ id: '123' }] });
      expect(result).to.be.false;
    });
  });
});
