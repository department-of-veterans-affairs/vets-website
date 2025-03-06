import { expect } from 'chai';
import sinon from 'sinon';
import formConfig from '../../../config/form';
import * as helpers from '../../../helpers';
import {
  STATEMENT_TYPES,
  DECISION_REVIEW_TYPES,
} from '../../../config/constants';

describe('formConfig', () => {
  it('should be an object', () => {
    expect(formConfig).to.be.an('object');
  });

  it('should have required top-level properties', () => {
    expect(formConfig).to.include.keys(
      'rootUrl',
      'urlPrefix',
      'submitUrl',
      'transformForSubmit',
      'dev',
      'trackingPrefix',
      'introduction',
      'confirmation',
      'formId',
      'saveInProgress',
      'version',
      'prefillEnabled',
      'hideUnauthedStartLink',
      'savedFormMessages',
      'title',
      'subTitle',
      'chapters',
    );
  });

  describe('chapters', () => {
    it('should be an object', () => {
      expect(formConfig.chapters).to.be.an('object');
    });
  });

  describe('statementTypePage', () => {
    it('should have required properties', () => {
      const {
        statementTypePage,
      } = formConfig.chapters.statementTypeChapter.pages;
      expect(statementTypePage).to.include.keys(
        'path',
        'title',
        'uiSchema',
        'schema',
        'pageClass',
        'initialData',
      );
    });
  });

  describe('dependent pages', () => {
    let formData;
    let stubEligibleForDecisionReview;

    beforeEach(() => {
      formData = {
        statementType: null,
        decisionDate: null,
        decisionReviewType: null,
      };
      stubEligibleForDecisionReview = sinon
        .stub(helpers, 'isEligibleForDecisionReview')
        .returns(false);
    });

    afterEach(() => {
      stubEligibleForDecisionReview.restore();
    });

    context('when statementType is BUDDY_STATEMENT', () => {
      beforeEach(() => {
        formData.statementType = STATEMENT_TYPES.BUDDY_STATEMENT;
      });

      it('should show layWitnessStatementPage', () => {
        const {
          layWitnessStatementPage,
        } = formConfig.chapters.statementTypeChapter.pages;
        expect(layWitnessStatementPage.depends(formData)).to.be.true;
      });
    });

    context('when statementType is DECISION_REVIEW', () => {
      beforeEach(() => {
        formData.statementType = STATEMENT_TYPES.DECISION_REVIEW;
      });

      it('should show decisionReviewPage', () => {
        const {
          decisionReviewPage,
        } = formConfig.chapters.statementTypeChapter.pages;
        expect(decisionReviewPage.depends(formData)).to.be.true;
      });

      it('should show newSupplementalClaimPage', () => {
        const {
          newSupplementalClaimPage,
        } = formConfig.chapters.statementTypeChapter.pages;
        expect(newSupplementalClaimPage.depends(formData)).to.be.true;
      });

      context('when eligible for decision review', () => {
        beforeEach(() => {
          stubEligibleForDecisionReview.returns(true);
        });

        context('when review type is NEW_EVIDENCE', () => {
          beforeEach(() => {
            formData.decisionReviewType = DECISION_REVIEW_TYPES.NEW_EVIDENCE;
          });

          it('should show supplementalClaimPage', () => {
            const {
              supplementalClaimPage,
            } = formConfig.chapters.statementTypeChapter.pages;
            expect(supplementalClaimPage.depends(formData)).to.be.true;
          });
        });
      });
    });
  });
});
