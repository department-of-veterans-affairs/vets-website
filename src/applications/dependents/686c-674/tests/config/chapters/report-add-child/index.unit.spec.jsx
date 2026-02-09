import { expect } from 'chai';
import sinon from 'sinon';
import chapter from '../../../../config/chapters/report-add-child';
import * as helpers from '../../../../config/helpers';
import * as utilities from '../../../../config/utilities';

describe('Add Child Chapter', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('shouldIncludePage base dependency', () => {
    it('should return true when add is true and addChild is required', () => {
      sandbox.stub(helpers, 'isChapterFieldRequired').returns(true);

      const formData = {
        'view:addOrRemoveDependents': { add: true },
      };

      const { depends } = chapter.pages.addChildIntro;
      expect(depends(formData)).to.be.true;
    });

    it('should return false when add is false', () => {
      sandbox.stub(helpers, 'isChapterFieldRequired').returns(true);

      const formData = {
        'view:addOrRemoveDependents': { add: false },
      };

      const { depends } = chapter.pages.addChildIntro;
      expect(depends(formData)).to.be.false;
    });

    it('should return false when addChild is not required', () => {
      sandbox.stub(helpers, 'isChapterFieldRequired').returns(false);

      const formData = {
        'view:addOrRemoveDependents': { add: true },
      };

      const { depends } = chapter.pages.addChildIntro;
      expect(depends(formData)).to.be.false;
    });
  });

  describe('addChildStepchild dependency', () => {
    beforeEach(() => {
      sandbox.stub(helpers, 'isChapterFieldRequired').returns(true);
    });

    it('should show when not biological child and stepchild is selected', () => {
      const formData = {
        'view:addOrRemoveDependents': { add: true },
        childrenToAdd: [
          {
            isBiologicalChild: false,
            relationshipType: 'STEPCHILD',
            relationshipToChild: { stepchild: true },
          },
        ],
      };

      const { depends } = chapter.pages.addChildStepchild;
      expect(depends(formData, 0)).to.be.true;
    });

    it('should not show when biological child', () => {
      const formData = {
        'view:addOrRemoveDependents': { add: true },
        childrenToAdd: [
          {
            isBiologicalChild: true,
            relationshipType: 'BIOLOGICAL',
            relationshipToChild: { stepchild: true },
          },
        ],
      };

      const { depends } = chapter.pages.addChildStepchild;
      expect(depends(formData, 0)).to.be.false;
    });

    it('should not show when stepchild is not selected', () => {
      const formData = {
        'view:addOrRemoveDependents': { add: true },
        childrenToAdd: [
          {
            isBiologicalChild: false,
            relationshipType: 'ADOPTED',
            relationshipToChild: { adopted: true },
          },
        ],
      };

      const { depends } = chapter.pages.addChildStepchild;
      expect(depends(formData, 0)).to.not.be.true;
    });
  });

  describe('disabilityPartTwo dependency', () => {
    beforeEach(() => {
      sandbox.stub(helpers, 'isChapterFieldRequired').returns(true);
    });

    it('should show when child has disability', () => {
      const formData = {
        'view:addOrRemoveDependents': { add: true },
        childrenToAdd: [{ doesChildHaveDisability: true }],
      };

      const { depends } = chapter.pages.disabilityPartTwo;
      expect(depends(formData, 0)).to.be.true;
    });

    it('should not show when child does not have disability', () => {
      const formData = {
        'view:addOrRemoveDependents': { add: true },
        childrenToAdd: [{ doesChildHaveDisability: false }],
      };

      const { depends } = chapter.pages.disabilityPartTwo;
      expect(depends(formData, 0)).to.be.false;
    });
  });

  describe('addChildMarriageEndDetails dependency', () => {
    beforeEach(() => {
      sandbox.stub(helpers, 'isChapterFieldRequired').returns(true);
    });

    it('should show when child has been married', () => {
      const formData = {
        'view:addOrRemoveDependents': { add: true },
        childrenToAdd: [{ hasChildEverBeenMarried: true }],
      };

      const { depends } = chapter.pages.addChildMarriageEndDetails;
      expect(depends(formData, 0)).to.be.true;
    });

    it('should not show when child has not been married', () => {
      const formData = {
        'view:addOrRemoveDependents': { add: true },
        childrenToAdd: [{ hasChildEverBeenMarried: false }],
      };

      const { depends } = chapter.pages.addChildMarriageEndDetails;
      expect(depends(formData, 0)).to.be.false;
    });
  });

  describe('child address pages dependency', () => {
    beforeEach(() => {
      sandbox.stub(helpers, 'isChapterFieldRequired').returns(true);
    });

    it('should show address pages when child does not live with veteran', () => {
      const formData = {
        'view:addOrRemoveDependents': { add: true },
        childrenToAdd: [{ doesChildLiveWithYou: false }],
      };

      const {
        depends: dependsPartOne,
      } = chapter.pages.addChildChildAddressPartOne;
      const {
        depends: dependsPartTwo,
      } = chapter.pages.addChildChildAddressPartTwo;

      expect(dependsPartOne(formData, 0)).to.be.true;
      expect(dependsPartTwo(formData, 0)).to.be.true;
    });

    it('should not show address pages when child lives with veteran', () => {
      const formData = {
        'view:addOrRemoveDependents': { add: true },
        childrenToAdd: [{ doesChildLiveWithYou: true }],
      };

      const {
        depends: dependsPartOne,
      } = chapter.pages.addChildChildAddressPartOne;
      const {
        depends: dependsPartTwo,
      } = chapter.pages.addChildChildAddressPartTwo;

      expect(dependsPartOne(formData, 0)).to.be.false;
      expect(dependsPartTwo(formData, 0)).to.be.false;
    });
  });

  describe('pages without conditional dependencies', () => {
    beforeEach(() => {
      sandbox.stub(helpers, 'isChapterFieldRequired').returns(true);
    });

    const baseFormData = {
      'view:addOrRemoveDependents': { add: true },
      childrenToAdd: [{}],
    };

    const alwaysVisiblePages = [
      'addChildIntro',
      'addChildSummary',
      'addChildInformation',
      'addChildPlaceOfBirth',
      'addChildRelationshipType',
      'disabilityPartOne',
      'addChildAdditionalInformationPartOne',
    ];

    alwaysVisiblePages.forEach(pageName => {
      it(`${pageName} should show when base conditions are met`, () => {
        const { depends } = chapter.pages[pageName];
        expect(depends(baseFormData, 0)).to.be.true;
      });
    });
  });

  describe('complete flow scenarios', () => {
    beforeEach(() => {
      sandbox.stub(helpers, 'isChapterFieldRequired').returns(true);
      sandbox.stub(utilities, 'showPensionRelatedQuestions').returns(true);
    });

    it('should show all relevant pages for biological child living with veteran', () => {
      const formData = {
        'view:addOrRemoveDependents': { add: true },
        childrenToAdd: [
          {
            isBiologicalChild: true,
            doesChildLiveWithYou: true,
            hasChildEverBeenMarried: false,
            doesChildHaveDisability: false,
          },
        ],
      };

      expect(chapter.pages.addChildIntro.depends(formData, 0)).to.be.true;
      expect(chapter.pages.addChildRelationshipType.depends(formData, 0)).to.be
        .true;
      expect(
        chapter.pages.addChildAdditionalInformationPartTwo.depends(formData, 0),
      ).to.be.true;

      expect(chapter.pages.addChildStepchild.depends(formData, 0)).to.be.false;
      expect(chapter.pages.addChildChildAddressPartOne.depends(formData, 0)).to
        .be.false;
      expect(chapter.pages.addChildMarriageEndDetails.depends(formData, 0)).to
        .be.false;
      expect(chapter.pages.disabilityPartTwo.depends(formData, 0)).to.be.false;
    });

    it('should show all relevant pages for stepchild not living with veteran', () => {
      const formData = {
        'view:addOrRemoveDependents': { add: true },
        childrenToAdd: [
          {
            isBiologicalChild: false,
            relationshipType: 'STEPCHILD',
            relationshipToChild: { stepchild: true },
            doesChildLiveWithYou: false,
            hasChildEverBeenMarried: true,
            doesChildHaveDisability: true,
          },
        ],
      };

      expect(chapter.pages.addChildStepchild.depends(formData, 0)).to.be.true;
      expect(chapter.pages.addChildChildAddressPartOne.depends(formData, 0)).to
        .be.true;
      expect(chapter.pages.addChildChildAddressPartTwo.depends(formData, 0)).to
        .be.true;
      expect(chapter.pages.addChildMarriageEndDetails.depends(formData, 0)).to
        .be.true;
      expect(chapter.pages.disabilityPartTwo.depends(formData, 0)).to.be.true;
    });
  });
});
