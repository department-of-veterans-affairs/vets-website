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

  describe('Depends logic', () => {
    it('should include subtopic', () => {
      const result = formConfig.chapters.categoryAndTopic.pages.selectSubtopic.depends(
        { selectTopic: 'Family health benefits' },
      );
      expect(result).to.be.true;
    });

    it('should include yourQuestionPart1 whoIsYourQuestionAbout', () => {
      const result = formConfig.chapters.yourQuestionPart1.pages.whoIsYourQuestionAbout.depends(
        {
          selectCategory: 'Education benefits and work study',
          selectTopic: 'Veteran Readiness and Employment (Chapter 31)',
        },
      );
      expect(result).to.be.true;
    });

    it('should include yourQuestionPart1 relationshipToVeteran', () => {
      const result = formConfig.chapters.yourQuestionPart1.pages.relationshipToVeteran.depends(
        {
          whoIsYourQuestionAbout: 'Myself',
        },
      );
      expect(result).to.be.true;
    });

    it('should include aboutMyselfRelationshipVeteran', () => {
      const result = formConfig.chapters.aboutMyselfRelationshipVeteran.depends(
        {
          whoIsYourQuestionAbout: 'Myself',
          relationshipToVeteran: "I'm the Veteran",
        },
      );
      expect(result).to.be.true;
    });

    it('should include aboutMyselfRelationshipVeteran', () => {
      const result = formConfig.chapters.aboutMyselfRelationshipFamilyMember.depends(
        {
          whoIsYourQuestionAbout: 'Myself',
          relationshipToVeteran: "I'm a family member of a Veteran",
        },
      );
      expect(result).to.be.true;
    });

    it('should include aboutSomeoneElseRelationshipVeteran', () => {
      const result = formConfig.chapters.aboutSomeoneElseRelationshipVeteran.depends(
        {
          whoIsYourQuestionAbout: 'Someone else',
          relationshipToVeteran: "I'm the Veteran",
          selectCategory: 'Anything Except EDUCATION',
        },
      );
      expect(result).to.be.true;
    });

    it('should include aboutSomeoneElseRelationshipFamilyMember', () => {
      const result = formConfig.chapters.aboutSomeoneElseRelationshipFamilyMember.depends(
        {
          whoIsYourQuestionAbout: 'Someone else',
          relationshipToVeteran: "I'm a family member of a Veteran",
          selectCategory: 'Anything Except EDUCATION',
        },
      );
      expect(result).to.be.true;
    });

    it('should include aboutSomeoneElseRelationshipFamilyMemberAboutVeteran', () => {
      const result = formConfig.chapters.aboutSomeoneElseRelationshipFamilyMemberAboutVeteran.depends(
        {
          whoIsYourQuestionAbout: 'Someone else',
          relationshipToVeteran: "I'm a family member of a Veteran",
          isQuestionAboutVeteranOrSomeoneElse: 'Veteran',
        },
      );
      expect(result).to.be.true;
    });

    it('should include aboutSomeoneElseRelationshipFamilyMemberAboutFamilyMember', () => {
      const result = formConfig.chapters.aboutSomeoneElseRelationshipFamilyMemberAboutFamilyMember.depends(
        {
          whoIsYourQuestionAbout: 'Someone else',
          relationshipToVeteran: "I'm a family member of a Veteran",
          isQuestionAboutVeteranOrSomeoneElse: 'Someone else',
        },
      );
      expect(result).to.be.true;
    });

    it('should include aboutSomeoneElseRelationshipConnectedThroughWork', () => {
      const result = formConfig.chapters.aboutSomeoneElseRelationshipConnectedThroughWork.depends(
        {
          whoIsYourQuestionAbout: 'Someone else',
          relationshipToVeteran:
            "I'm connected to the Veteran through my work (for example, as a School Certifying Official or fiduciary)",
          selectCategory: 'Anything Except EDUCATION',
        },
      );
      expect(result).to.be.true;
    });

    it('should include aboutSomeoneElseRelationshipConnectedThroughWorkEducation', () => {
      const result = formConfig.chapters.aboutSomeoneElseRelationshipConnectedThroughWorkEducation.depends(
        {
          // whoIsYourQuestionAbout: 'Someone else',
          relationshipToVeteran:
            "I'm connected to the Veteran through my work (for example, as a School Certifying Official or fiduciary)",
          selectCategory: 'Education benefits and work study',
          selectTopic: 'Anything except VRE (Ch31)',
        },
      );
      expect(result).to.be.true;
    });

    it('should include aboutSomeoneElseRelationshipVeteranOrFamilyMemberEducation', () => {
      const result = formConfig.chapters.aboutSomeoneElseRelationshipVeteranOrFamilyMemberEducation.depends(
        {
          // whoIsYourQuestionAbout: 'Someone else',
          relationshipToVeteran: 'Anything except WORK',
          selectCategory: 'Education benefits and work study',
          selectTopic: 'Anything except VRE (Ch31)',
        },
      );
      expect(result).to.be.true;
    });

    it('should include generalQuestion', () => {
      const result = formConfig.chapters.generalQuestion.depends({
        whoIsYourQuestionAbout: "It's a general question",
      });
      expect(result).to.be.true;
    });

    // TODO: feels like a useless test; revisit joehall-tw
    it('should include yourQuestionPart2', () => {
      let called = false;
      const goPath = path => {
        if (path === '/review-then-submit') {
          called = true;
        }
      };
      formConfig.chapters.yourQuestionPart2.pages.question.onNavForward({
        goPath,
      });
      expect(called).to.be.true;
    });

    // TODO: feels like a useless test; revisit joehall-tw
    it('should include review', () => {
      let called = false;
      const goPath = path => {
        if (path === '/confirmation') {
          called = true;
        }
      };
      formConfig.chapters.review.pages.reviewForm.onNavForward({
        goPath,
      });
      expect(called).to.be.true;
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
