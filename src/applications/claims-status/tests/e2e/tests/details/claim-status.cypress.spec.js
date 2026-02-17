import { mockFeatureToggles } from '../../support/helpers/mocks';
import { setupClaimTest } from '../../support/helpers/setup';
import { verifyTitleBreadcrumbsHeading } from '../../support/helpers/assertions';
import {
  createBenefitsClaim,
  createEvidenceSubmission,
  createMultipleTrackedItems,
  createTrackedItem,
} from '../../support/fixtures/benefitsClaims';

describe('Claim status', () => {
  beforeEach(() => {
    mockFeatureToggles();
    cy.login();
  });

  context('when claim is open', () => {
    it('should have correct page title, breadcrumbs, and heading', () => {
      setupClaimTest({ claim: createBenefitsClaim() });

      verifyTitleBreadcrumbsHeading({
        title:
          'Status of January 1, 2025 Compensation Claim | Veterans Affairs',
        thirdBreadcrumb: {
          name: 'Status of your compensation claim',
          href: '#content',
        },
        heading: { name: 'Claim status', level: 2 },
      });

      cy.findByText('Here’s the latest information on your claim.');
      cy.axeCheck();
    });

    it('should display as in progress with last updated date', () => {
      setupClaimTest({ claim: createBenefitsClaim() });

      cy.findByText('In Progress');
      cy.findByText('Last updated: April 1, 2025');

      cy.axeCheck();
    });

    describe('What you need to do', () => {
      it('should display heading and, when no tracked items, nothing needed message', () => {
        setupClaimTest({
          claim: createBenefitsClaim({ trackedItems: [] }),
        });

        cy.findByRole('heading', { name: 'What you need to do', level: 3 });
        cy.findByText('nothing we need from you', { exact: false });

        cy.axeCheck();
      });

      it('should display alert when standard evidence is requested', () => {
        setupClaimTest({
          claim: createBenefitsClaim({
            trackedItems: [createTrackedItem()],
          }),
        });

        cy.get('va-alert[status="warning"]').within(() => {
          cy.findByRole('heading', { name: 'Provide medical records' });
          cy.findByText('Respond by January 1, 2050');
          cy.findByText('Please provide your medical records.');
        });

        // Verify navigation to document request page
        cy.get(
          'va-link-action[aria-label="About this request for Medical records"]',
        )
          .shadow()
          .findByText('About this request')
          .click();
        cy.url().should('contain', '/needed-from-you/1');

        cy.axeCheck();
      });

      it('should display alert when sensitive evidence is requested', () => {
        setupClaimTest({
          claim: createBenefitsClaim({
            trackedItems: [
              createTrackedItem({
                displayName: 'ASB - tell us where, when, how exposed',
              }),
            ],
          }),
        });

        cy.get('va-alert[status="warning"]').within(() => {
          cy.findByRole('heading', { name: 'Request for evidence' });
        });

        cy.axeCheck();
      });

      describe('Feature flag: cstShowDocumentUploadStatus', () => {
        context('when disabled', () => {
          beforeEach(() => {
            mockFeatureToggles({ showDocumentUploadStatus: false });
          });

          it('should hide upload error alert and show nothing needed message even when failed submissions exist', () => {
            setupClaimTest({
              claim: createBenefitsClaim({
                evidenceSubmissions: [
                  createEvidenceSubmission({
                    uploadStatus: 'FAILED',
                    acknowledgementDate: '2050-01-01T00:00:00.000Z',
                  }),
                ],
                trackedItems: [],
              }),
            });

            cy.get('va-alert[status="error"]').should('not.exist');
            cy.findByText('nothing we need from you', { exact: false });

            cy.axeCheck();
          });
        });

        context('when enabled', () => {
          beforeEach(() => {
            mockFeatureToggles({ showDocumentUploadStatus: true });
          });

          it('should show upload error alert and hide nothing needed message when failed submissions exist', () => {
            setupClaimTest({
              claim: createBenefitsClaim({
                evidenceSubmissions: [
                  createEvidenceSubmission({
                    uploadStatus: 'FAILED',
                    acknowledgementDate: '2050-01-01T00:00:00.000Z',
                  }),
                ],
                trackedItems: [],
              }),
            });

            cy.get('va-alert[status="error"]')
              .contains('We need you to submit files by mail or in person')
              .should('be.visible');
            cy.findByText('nothing we need from you', { exact: false }).should(
              'not.exist',
            );

            cy.axeCheck();
          });

          it('should display failed files as most recent first', () => {
            setupClaimTest({
              claim: createBenefitsClaim({
                evidenceSubmissions: [
                  createEvidenceSubmission({
                    id: 1,
                    uploadStatus: 'FAILED',
                    acknowledgementDate: '2050-01-01T00:00:00.000Z',
                    fileName: 'older-file.pdf',
                    failedDate: '2025-01-10T12:00:00.000Z',
                  }),
                  createEvidenceSubmission({
                    id: 2,
                    uploadStatus: 'FAILED',
                    acknowledgementDate: '2050-01-01T00:00:00.000Z',
                    fileName: 'newer-file.pdf',
                    failedDate: '2025-01-15T12:00:00.000Z',
                  }),
                ],
                trackedItems: [],
              }),
            });

            cy.get('va-alert[status="error"]').within(() => {
              cy.findAllByRole('listitem').as('listItems');
              cy.get('@listItems').should('have.length', 2);
              cy.get('@listItems').eq(0).findByText('newer-file.pdf');
              cy.get('@listItems').eq(1).findByText('older-file.pdf');
            });

            cy.axeCheck();
          });
        });
      });
    });

    describe("What we're doing", () => {
      it('should display heading and card link', () => {
        setupClaimTest({ claim: createBenefitsClaim() });

        cy.findByRole('heading', { name: 'What we’re doing', level: 3 });
        cy.findByRole('link', { name: 'Learn more about this step' });

        cy.axeCheck();
      });

      context('when using 5-phase system', () => {
        // Card is not shown when claim is closed (COMPLETE status)
        const phases = [
          {
            status: 'CLAIM_RECEIVED',
            expectedStep: 'Step 1 of 5: Claim received',
            expectedDescription:
              'We received your claim. We haven’t assigned the claim to a reviewer yet.',
          },
          {
            status: 'INITIAL_REVIEW',
            expectedStep: 'Step 2 of 5: Initial review',
            expectedDescription:
              'We assigned your claim to a reviewer. The reviewer will determine if we need any more information from you.',
          },
          {
            status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
            expectedStep:
              'Step 3 of 5: Evidence gathering, review, and decision',
            expectedDescription:
              'We’re getting evidence from you, your health care providers, government agencies, and other sources. We’ll review the evidence and make a decision.',
          },
          {
            status: 'PREPARATION_FOR_NOTIFICATION',
            expectedStep: 'Step 4 of 5: Preparation for notification',
            expectedDescription:
              'We’ve made a decision on your claim. We’re getting your decision letter ready to mail to you.',
          },
        ];

        phases.forEach(({ status, expectedStep, expectedDescription }) => {
          it(`should display "${expectedStep}"`, () => {
            // Use dependency claim type to get 5-phase display (not compensation/pension)
            setupClaimTest({
              claim: createBenefitsClaim({
                status,
                claimTypeCode: '130DPNDCYAUT',
              }),
            });

            cy.findByText(expectedStep);
            cy.findByText(expectedDescription);
            cy.findByText('Moved to this step on January 2, 2025');
            cy.findByRole('link', {
              name: 'Learn more about the review process',
            });

            cy.axeCheck();
          });
        });
      });

      context('when using 8-phase system', () => {
        const phases = [
          {
            latestPhaseType: 'CLAIM_RECEIVED',
            expectedStep: 'Step 1 of 8: Claim received',
            expectedDescription: 'We received your claim in our system.',
          },
          {
            latestPhaseType: 'UNDER_REVIEW',
            expectedStep: 'Step 2 of 8: Initial review',
            expectedDescription:
              'We’re checking your claim for basic information, like your name and Social Security number. If information is missing, we’ll contact you.',
          },
          {
            latestPhaseType: 'GATHERING_OF_EVIDENCE',
            expectedStep: 'Step 3 of 8: Evidence gathering',
            expectedDescription:
              'We’re reviewing your claim to make sure we have all the evidence and information we need. If we need anything else, we’ll contact you.',
          },
          {
            latestPhaseType: 'REVIEW_OF_EVIDENCE',
            expectedStep: 'Step 4 of 8: Evidence review',
            expectedDescription:
              'We’re reviewing all the evidence for your claim. If we need more evidence or you submit more evidence, your claim will go back to Step 3: Evidence gathering.',
          },
          {
            latestPhaseType: 'PREPARATION_FOR_DECISION',
            expectedStep: 'Step 5 of 8: Rating',
            expectedDescription:
              'We’re deciding your claim and determining your disability rating. If we need more evidence or you submit more evidence, your claim will go back to Step 3: Evidence gathering.',
          },
          {
            latestPhaseType: 'PENDING_DECISION_APPROVAL',
            expectedStep: 'Step 6 of 8: Preparing decision letter',
            expectedDescription:
              'We’re preparing your decision letter. If we need more evidence or you submit more evidence, your claim will go back to Step 3: Evidence gathering.',
          },
          {
            latestPhaseType: 'PREPARATION_FOR_NOTIFICATION',
            expectedStep: 'Step 7 of 8: Final review',
            expectedDescription:
              'A senior reviewer is doing a final review of your claim and the decision letter.',
          },
          {
            latestPhaseType: 'COMPLETE',
            expectedStep: 'Step 8 of 8: Claim decided',
            expectedDescription:
              'You can view and download your decision letter. We also sent you a copy by mail.',
          },
        ];

        phases.forEach(
          ({ latestPhaseType, expectedStep, expectedDescription }) => {
            it(`should display "${expectedStep}"`, () => {
              setupClaimTest({
                claim: createBenefitsClaim({ latestPhaseType }),
              });

              cy.findByText(expectedStep);
              cy.findByText(expectedDescription);
              cy.findByText('Moved to this step on January 2, 2025');
              cy.findByRole('link', {
                name: 'Learn more about this step',
              }).should(
                'have.attr',
                'href',
                '/track-claims/your-claims/123456789/overview',
              );

              cy.axeCheck();
            });
          },
        );
      });
    });

    describe('Recent activity', () => {
      it('should display heading and activity dates in chronological order', () => {
        setupClaimTest({ claim: createBenefitsClaim() });

        cy.findByRole('heading', { name: 'Recent activity', level: 3 })
          .parent()
          .find('ol')
          .within(() => {
            cy.findAllByRole('heading', { level: 4 })
              .should('have.length', 4)
              .then($headings => {
                expect($headings[0]).to.have.text('April 1, 2025');
                expect($headings[1]).to.have.text('March 1, 2025');
                expect($headings[2]).to.have.text('January 2, 2025');
                expect($headings[3]).to.have.text('January 1, 2025');
              });
          });

        cy.axeCheck();
      });

      it('should display request outside the VA with info alert', () => {
        setupClaimTest({ claim: createBenefitsClaim() });

        cy.findByText('We made a request outside the VA: “reserve records.”')
          .closest('li')
          .within(() => {
            cy.get('va-alert').within(() => {
              cy.findByText(
                "We've requested your reserve records on your behalf. No action is needed.",
              );
              cy.findByRole('link', {
                name: 'About this notice for Reserve records',
              }).should(
                'have.attr',
                'href',
                '/track-claims/your-claims/123456789/needed-from-others/654321-2',
              );
            });
          });

        cy.axeCheck();
      });

      it('should display disability exam request with info alert', () => {
        setupClaimTest({ claim: createBenefitsClaim() });

        cy.findByText('We made a request: “disability exam for hearing.”')
          .closest('li')
          .within(() => {
            cy.get('va-alert').within(() => {
              cy.findByText(
                'We’ve requested an exam related to your claim. The examiner’s office will contact you to schedule this appointment.',
              );
              cy.findByRole('link', {
                name: 'About this notice for Disability exam for hearing',
              }).should(
                'have.attr',
                'href',
                '/track-claims/your-claims/123456789/needed-from-others/123456-1',
              );
            });
          });

        cy.axeCheck();
      });

      it('should display claim phase activity', () => {
        setupClaimTest({ claim: createBenefitsClaim() });

        cy.findByText('Your claim moved into Step 2: Initial review');
        cy.findByText('We received your claim in our system');

        cy.axeCheck();
      });

      it('should display pagination when more than 10 activity items exist', () => {
        setupClaimTest({
          claim: createBenefitsClaim({
            // Recent activity shows NEEDED_FROM_OTHERS items
            trackedItems: createMultipleTrackedItems(15, {
              status: 'NEEDED_FROM_OTHERS',
            }),
          }),
        });

        cy.findByRole('heading', { name: 'Recent activity', level: 3 });
        cy.get('va-pagination').shadow().findByText('Next');

        cy.axeCheck();
      });

      it('should navigate to document request page when clicking info alert link', () => {
        setupClaimTest({ claim: createBenefitsClaim() });

        cy.findByRole('link', {
          name: 'About this notice for Reserve records',
        }).click();
        cy.url().should('contain', '/needed-from-others/654321-2');

        cy.axeCheck();
      });
    });
  });

  context('when claim is closed', () => {
    const closedClaimSetup = (overrides = {}) => {
      setupClaimTest({
        claim: createBenefitsClaim({
          status: 'COMPLETE',
          closeDate: '2025-01-15',
          latestPhaseType: 'COMPLETE',
          previousPhases: {
            phase7CompleteDate: '2025-01-15',
          },
          ...overrides,
        }),
      });
    };

    it('should not display open claim sections', () => {
      closedClaimSetup();

      cy.findByText('In Progress').should('not.exist');
      cy.findByRole('heading', {
        name: 'What you need to do',
        level: 3,
      }).should('not.exist');
      cy.findByRole('heading', { name: 'What we’re doing', level: 3 }).should(
        'not.exist',
      );

      cy.axeCheck();
    });

    describe('Closed claim alert', () => {
      it('should display closed claim message with close date', () => {
        closedClaimSetup();

        cy.findByRole('heading', {
          name: 'We closed your claim on January 15, 2025',
        });
        cy.findByText(
          'We mailed you a decision letter. It should arrive within 10 days after the date we decided your claim. It can sometimes take longer.',
        );

        cy.axeCheck();
      });

      context('when decisionLetterSent is true', () => {
        it('should display decision letter link and navigate to claim letters', () => {
          closedClaimSetup({ decisionLetterSent: true });

          cy.findByRole('heading', {
            name: 'We closed your claim on January 15, 2025',
          });
          cy.findByText(
            'You can download your decision letter online now. You can also get other letters related to your claims.',
          );

          cy.findByRole('link', { name: 'Get your claim letters' }).click();
          cy.url().should('contain', '/your-claim-letters');

          cy.axeCheck();
        });
      });
    });

    describe('Payments', () => {
      it('should display payment information', () => {
        closedClaimSetup();

        cy.findByRole('heading', { name: 'Payments', level: 3 });
        cy.findByText('If you are entitled to back payment', { exact: false });

        cy.axeCheck();
      });
    });

    describe('Next steps', () => {
      it('should display action links', () => {
        closedClaimSetup();

        cy.findByRole('heading', { name: 'Next steps', level: 3 });

        cy.get('va-link[href="/decision-reviews/supplemental-claim/"]')
          .shadow()
          .findByText('Learn more about Supplemental Claims');
        cy.get('va-link[href="/disability/how-to-file-claim/"]')
          .shadow()
          .findByText('Learn how to file a VA disability claim');
        cy.get('va-link[href="/resources/choosing-a-decision-review-option/"]')
          .shadow()
          .findByText('Find out how to choose a decision review option');
        cy.get(
          'va-link[href="/health-care/apply-for-health-care-form-10-10ez/"]',
        )
          .shadow()
          .findByText('Apply for VA health care benefits');

        cy.axeCheck();
      });
    });

    describe('Recent activity', () => {
      it('should display claim decided message', () => {
        closedClaimSetup();

        cy.findByRole('heading', { name: 'Recent activity', level: 3 });
        cy.findByText('Your claim was decided');

        cy.axeCheck();
      });
    });
  });
});
