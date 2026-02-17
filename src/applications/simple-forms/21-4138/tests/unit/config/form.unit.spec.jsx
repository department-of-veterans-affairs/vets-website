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
      'chapters',
      'confirmation',
      'dev',
      'formId',
      'hideUnauthedStartLink',
      'introduction',
      'prefillEnabled',
      'rootUrl',
      'savedFormMessages',
      'saveInProgress',
      'submitUrl',
      'subTitle',
      'title',
      'trackingPrefix',
      'transformForSubmit',
      'urlPrefix',
      'version',
    );
  });

  describe('chapters', () => {
    it('should be an object', () => {
      expect(formConfig.chapters).to.be.an('object');
    });

    describe('statementTypeChapter', () => {
      describe('pages', () => {
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

        describe('statementTypePage', () => {
          const {
            statementTypePage,
          } = formConfig.chapters.statementTypeChapter.pages;
          it('should have required properties', () => {
            expect(statementTypePage).to.include.keys(
              'pageClass',
              'path',
              'schema',
              'title',
              'uiSchema',
            );
          });
        });

        describe('layWitnessStatementPage', () => {
          const {
            layWitnessStatementPage,
          } = formConfig.chapters.statementTypeChapter.pages;

          context('when statementType is BUDDY_STATEMENT', () => {
            beforeEach(() => {
              formData.statementType = STATEMENT_TYPES.BUDDY_STATEMENT;
            });

            it('should display the page', () => {
              expect(layWitnessStatementPage.depends(formData)).to.be.true;
            });
          });
        });

        describe('decisionReviewPage', () => {
          const {
            decisionReviewPage,
          } = formConfig.chapters.statementTypeChapter.pages;

          context('when statementType is DECISION_REVIEW', () => {
            beforeEach(() => {
              formData.statementType = STATEMENT_TYPES.DECISION_REVIEW;
            });

            it('should display the page', () => {
              expect(decisionReviewPage.depends(formData)).to.be.true;
            });
          });
        });

        describe('newSupplementalClaimPage', () => {
          const {
            newSupplementalClaimPage,
          } = formConfig.chapters.statementTypeChapter.pages;

          context('when statementType is DECISION_REVIEW', () => {
            beforeEach(() => {
              formData.statementType = STATEMENT_TYPES.DECISION_REVIEW;
            });

            context('when decision review is not eligible', () => {
              beforeEach(() => {
                stubEligibleForDecisionReview.returns(false);
              });

              it('should display the page', () => {
                expect(newSupplementalClaimPage.depends(formData)).to.be.true;
              });
            });
          });
        });

        describe('supplementalClaimPage', () => {
          const {
            supplementalClaimPage,
          } = formConfig.chapters.statementTypeChapter.pages;

          context('when statementType is DECISION_REVIEW', () => {
            beforeEach(() => {
              formData.statementType = STATEMENT_TYPES.DECISION_REVIEW;
            });

            context('when eligible for decision review', () => {
              beforeEach(() => {
                stubEligibleForDecisionReview.returns(true);
              });

              context('when decision review type is NEW_EVIDENCE', () => {
                beforeEach(() => {
                  formData.decisionReviewType =
                    DECISION_REVIEW_TYPES.NEW_EVIDENCE;
                });

                it('should display the page', () => {
                  expect(supplementalClaimPage.depends(formData)).to.be.true;
                });
              });
            });
          });
        });

        describe('higherLevelReviewPage', () => {
          const {
            higherLevelReviewPage,
          } = formConfig.chapters.statementTypeChapter.pages;

          context('when statementType is DECISION_REVIEW', () => {
            beforeEach(() => {
              formData.statementType = STATEMENT_TYPES.DECISION_REVIEW;
            });

            context('when eligible for decision review', () => {
              beforeEach(() => {
                stubEligibleForDecisionReview.returns(true);
              });

              context('when decision review type is ERROR_MADE', () => {
                beforeEach(() => {
                  formData.decisionReviewType =
                    DECISION_REVIEW_TYPES.ERROR_MADE;
                });

                it('should display the page', () => {
                  expect(higherLevelReviewPage.depends(formData)).to.be.true;
                });
              });
            });
          });
        });

        describe('boardAppealPage', () => {
          const {
            boardAppealPage,
          } = formConfig.chapters.statementTypeChapter.pages;

          context('when statementType is DECISION_REVIEW', () => {
            beforeEach(() => {
              formData.statementType = STATEMENT_TYPES.DECISION_REVIEW;
            });

            context('when eligible for decision review', () => {
              beforeEach(() => {
                stubEligibleForDecisionReview.returns(true);
              });

              context('when decision review type is BVA_REQUEST', () => {
                beforeEach(() => {
                  formData.decisionReviewType =
                    DECISION_REVIEW_TYPES.BVA_REQUEST;
                });

                it('should display the page', () => {
                  expect(boardAppealPage.depends(formData)).to.be.true;
                });
              });
            });
          });
        });

        describe('priorityProcessingPage', () => {
          const {
            priorityProcessingPage,
          } = formConfig.chapters.statementTypeChapter.pages;

          context('when statementType is PRIORITY_PROCESSING', () => {
            beforeEach(() => {
              formData.statementType = STATEMENT_TYPES.PRIORITY_PROCESSING;
            });

            it('should display the page', () => {
              expect(priorityProcessingPage.depends(formData)).to.be.true;
            });
          });
        });

        describe('personalRecordsRequestPage', () => {
          const {
            personalRecordsRequestPage,
          } = formConfig.chapters.statementTypeChapter.pages;

          context('when statementType is PERSONAL_RECORDS', () => {
            beforeEach(() => {
              formData.statementType = STATEMENT_TYPES.PERSONAL_RECORDS;
            });

            it('should display the page', () => {
              expect(personalRecordsRequestPage.depends(formData)).to.be.true;
            });
          });
        });

        describe('claimStatusToolPage', () => {
          const {
            claimStatusToolPage,
          } = formConfig.chapters.statementTypeChapter.pages;

          context('when statementType is NEW_EVIDENCE', () => {
            beforeEach(() => {
              formData.statementType = STATEMENT_TYPES.NEW_EVIDENCE;
              formData['view:userIsVeteran'] = true;
            });

            it('should display the page', () => {
              expect(claimStatusToolPage.depends(formData)).to.be.true;
            });
          });
        });

        describe('claimStatusToolPageNonVeteran', () => {
          const {
            claimStatusToolPageNonVeteran,
          } = formConfig.chapters.statementTypeChapter.pages;

          context('when statementType is NEW_EVIDENCE', () => {
            beforeEach(() => {
              formData.statementType = STATEMENT_TYPES.NEW_EVIDENCE;
              formData['view:userIsVeteran'] = false;
            });

            it('should display the page', () => {
              expect(claimStatusToolPageNonVeteran.depends(formData)).to.be
              .true;
            });
          });
        });
      });
    });

    describe('personalInformationChapter', () => {
      describe('pages', () => {
        let formData;
        let stubEligibleToSubmitStatement;

        beforeEach(() => {
          formData = {
            statementType: null,
            decisionDate: null,
            decisionReviewType: null,
          };
          stubEligibleToSubmitStatement = sinon
            .stub(helpers, 'isEligibleToSubmitStatement')
            .returns(false);
        });

        afterEach(() => {
          stubEligibleToSubmitStatement.restore();
        });

        describe('personalInformationPage', () => {
          const {
            personalInformationPage,
          } = formConfig.chapters.personalInformationChapter.pages;

          it('should have required properties', () => {
            expect(personalInformationPage).to.include.keys(
              'depends',
              'pageClass',
              'path',
              'schema',
              'title',
              'uiSchema',
            );
          });

          context('when eligible to submit statement', () => {
            beforeEach(() => {
              stubEligibleToSubmitStatement.returns(true);
            });

            it('should display the page', () => {
              expect(personalInformationPage.depends(formData)).to.be.true;
            });
          });
        });
      });
    });

    describe('identificationChapter', () => {
      describe('pages', () => {
        let formData;
        let stubEligibleToSubmitStatement;

        beforeEach(() => {
          formData = {
            statementType: null,
            decisionDate: null,
            decisionReviewType: null,
          };
          stubEligibleToSubmitStatement = sinon
            .stub(helpers, 'isEligibleToSubmitStatement')
            .returns(false);
        });

        afterEach(() => {
          stubEligibleToSubmitStatement.restore();
        });

        describe('identificationInformationPage', () => {
          const {
            identificationInformationPage,
          } = formConfig.chapters.identificationChapter.pages;

          it('should have required properties', () => {
            expect(identificationInformationPage).to.include.keys(
              'depends',
              'pageClass',
              'path',
              'schema',
              'title',
              'uiSchema',
            );
          });

          context('when eligible to submit statement', () => {
            beforeEach(() => {
              stubEligibleToSubmitStatement.returns(true);
            });

            it('should display the page', () => {
              expect(identificationInformationPage.depends(formData)).to.be
                .true;
            });
          });
        });
      });
    });

    describe('mailingAddressChapter', () => {
      describe('pages', () => {
        let formData;
        let stubEligibleToSubmitStatement;

        beforeEach(() => {
          formData = {
            statementType: null,
            decisionDate: null,
            decisionReviewType: null,
          };
          stubEligibleToSubmitStatement = sinon
            .stub(helpers, 'isEligibleToSubmitStatement')
            .returns(false);
        });

        afterEach(() => {
          stubEligibleToSubmitStatement.restore();
        });

        describe('mailingAddressPage', () => {
          const {
            mailingAddressPage,
          } = formConfig.chapters.mailingAddressChapter.pages;

          it('should have required properties', () => {
            expect(mailingAddressPage).to.include.keys(
              'depends',
              'pageClass',
              'path',
              'schema',
              'title',
              'uiSchema',
            );
          });

          context('when eligible to submit statement', () => {
            beforeEach(() => {
              stubEligibleToSubmitStatement.returns(true);
            });

            it('should display the page', () => {
              expect(mailingAddressPage.depends(formData)).to.be.true;
            });
          });
        });
      });
    });

    describe('contactInformationChapter', () => {
      describe('pages', () => {
        let formData;
        let stubEligibleToSubmitStatement;

        beforeEach(() => {
          formData = {
            statementType: null,
            decisionDate: null,
            decisionReviewType: null,
          };
          stubEligibleToSubmitStatement = sinon
            .stub(helpers, 'isEligibleToSubmitStatement')
            .returns(false);
        });

        afterEach(() => {
          stubEligibleToSubmitStatement.restore();
        });

        describe('contactInformationPage', () => {
          const {
            contactInformationPage,
          } = formConfig.chapters.contactInformationChapter.pages;

          it('should have required properties', () => {
            expect(contactInformationPage).to.include.keys(
              'depends',
              'pageClass',
              'path',
              'schema',
              'title',
              'uiSchema',
            );
          });

          context('when eligible to submit statement', () => {
            beforeEach(() => {
              stubEligibleToSubmitStatement.returns(true);
            });

            it('should display the page', () => {
              expect(contactInformationPage.depends(formData)).to.be.true;
            });
          });
        });
      });
    });

    describe('statementChapter', () => {
      describe('pages', () => {
        let formData;
        let stubEligibleToSubmitStatement;

        beforeEach(() => {
          formData = {
            statementType: null,
            decisionDate: null,
            decisionReviewType: null,
          };
          stubEligibleToSubmitStatement = sinon
            .stub(helpers, 'isEligibleToSubmitStatement')
            .returns(false);
        });

        afterEach(() => {
          stubEligibleToSubmitStatement.restore();
        });

        describe('statementPage', () => {
          const { statementPage } = formConfig.chapters.statementChapter.pages;

          it('should have required properties', () => {
            expect(statementPage).to.include.keys(
              'depends',
              'pageClass',
              'path',
              'schema',
              'title',
              'uiSchema',
            );
          });

          context('when eligible to submit statement', () => {
            beforeEach(() => {
              stubEligibleToSubmitStatement.returns(true);
            });

            it('should display the page', () => {
              expect(statementPage.depends(formData)).to.be.true;
            });
          });
        });
      });
    });
  });
});
