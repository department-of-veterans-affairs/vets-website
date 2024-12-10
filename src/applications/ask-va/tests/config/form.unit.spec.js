import { expect } from 'chai';
import formConfig from '../../config/form';

describe('Form Configuration', () => {
  describe('Chapters and Pages', () => {
    it('should contain correct chapters', () => {
      const chapters = Object.keys(formConfig.chapters);
      expect(chapters).to.include.members([
        'categoryAndTopic',
        'yourQuestionPart1',
        'aboutMyselfRelationshipVeteran',
        'aboutMyselfRelationshipFamilyMember',
        // Add other chapter keys here...
        'review',
      ]);
    });

    it('should contain correct pages for "categoryAndTopic" chapter', () => {
      const pages = Object.keys(formConfig.chapters.categoryAndTopic.pages);
      expect(pages).to.include.members([
        'yourPersonalInformation',
        'selectCategory',
        'selectTopic',
        'selectSubtopic',
      ]);
    });

    it('should define correct path and title for "selectCategory" page', () => {
      const {
        path,
        title,
      } = formConfig.chapters.categoryAndTopic.pages.selectCategory;
      expect(path).to.equal('category-topic-1');
      expect(title).to.equal('Category');
    });

    it('should define correct CustomPage for "selectCategory" page', () => {
      const {
        CustomPage,
      } = formConfig.chapters.categoryAndTopic.pages.selectCategory;
      expect(CustomPage).to.not.be.null;
    });
  });

  // We need to refactor this test once form submission is finalized
  describe('Submit Logic', () => {
    it.skip('should resolve with a confirmation number on submit', async () => {
      const result = await formConfig.submit();
      expect(result.attributes.confirmationNumber).to.equal('123123123');
    });
  });

  describe('Prefill and Save', () => {
    it('should define prefill transformer', () => {
      expect(formConfig.prefillTransformer).to.not.be.undefined;
    });

    it('should have correct save in progress messages', () => {
      const { messages } = formConfig.saveInProgress;
      expect(messages.inProgress).to.equal('Your question is in progress');
      expect(messages.expired).to.equal('Your question expired');
      expect(messages.saved).to.equal('Your question has been saved');
    });
  });
});
