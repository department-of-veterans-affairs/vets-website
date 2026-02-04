import userWithAppeals from '../../../fixtures/mocks/user-with-appeals.json';
import { createAppeal, createDocket } from '../../../support/fixtures/appeals';
import {
  mockClaimsEndpoint,
  mockFeatureToggles,
  mockStemEndpoint,
} from '../../../support/helpers/mocks';
import { setupAppealTest } from '../../../support/helpers/setup';

// Tests for src/applications/claims-status/components/appeals-v2/Docket.jsx

describe('Docket', () => {
  beforeEach(() => {
    mockFeatureToggles();
    mockClaimsEndpoint();
    mockStemEndpoint();
    cy.login(userWithAppeals);
  });

  it('displays AOD prioritization message when aod is true', () => {
    setupAppealTest({
      appeal: createAppeal({
        statusType: 'on_docket',
        aod: true,
        docket: createDocket(),
      }),
    });
    cy.findByRole('heading', {
      name: 'How long until a judge is ready for your appeal?',
      level: 2,
    });
    cy.findByText(
      'Your appeal is Advanced on the Docket. This could be because you are older than 75, because you are suffering a serious illness or are in financial distress, or for other sufficient cause.',
    );
    cy.axeCheck();
  });

  it('displays Court Remand message when appealAction is post_cavc_remand', () => {
    setupAppealTest({
      appeal: createAppeal({
        statusType: 'on_docket',
        docket: createDocket(),
        appealAction: 'post_cavc_remand',
      }),
    });
    cy.findByText(
      'Your appeal was remanded by the U.S. Court of Appeals for Veterans Claims. Court Remand appeals are prioritized so that they’re always at the front of the line. Your appeal will be sent to a judge as soon as it’s ready for their review.',
    );
    cy.axeCheck();
  });

  it('displays front of docket message when front is true', () => {
    setupAppealTest({
      appeal: createAppeal({
        statusType: 'on_docket',
        docket: createDocket({ front: true }),
      }),
    });
    cy.findByText(
      'The Board of Veterans’ Appeals reviews cases in the order they’re received. When you completed a VA Form 9 in June 2025, your appeal was added to the Board’s docket, securing your spot in line.',
    );
    cy.findByText(
      'The Board is currently reviewing appeals from January 2025 or older. Your appeal is eligible to be sent to a judge when it’s ready for their review.',
    );
    cy.findByText('12,345');
    cy.findByText('Appeals ahead of you');
    cy.findByRole('heading', {
      name: 'Is there a way to prioritize my appeal?',
      level: 2,
    });
    cy.contains(
      'If you are suffering a serious illness or are in financial distress, or for another sufficient cause, you can apply to have your appeal Advanced on the Docket. If you’re older than 75, your appeal will receive this status automatically. Advanced on the Docket appeals are prioritized so that they’re always at the front of the line.',
    ).should('be.visible');
    cy.get(
      'va-link[href="/disability/file-an-appeal/request-priority-review/"]',
    )
      .shadow()
      .findByText('Learn more about requesting Advanced on the Docket status.');
    cy.axeCheck();
  });

  it('displays legacy docket position for legacy appeals', () => {
    setupAppealTest({
      appeal: createAppeal({
        statusType: 'on_docket',
        docket: createDocket(),
      }),
    });

    cy.findByText(
      'There are 123,456 appeals on the docket, not including Advanced on the Docket and Court Remand appeals. Some of these appeals are not ready to be sent to a judge. A judge will begin work on your appeal when it’s among the oldest appeals that are ready for their review. The Board is currently reviewing appeals from January 2025 or older.',
    );

    cy.axeCheck();
  });

  it('displays AMA docket position when totalAllDockets is provided', () => {
    setupAppealTest({
      appeal: createAppeal({
        location: 'bva',
        statusType: 'on_docket',
        docket: createDocket({
          type: 'directReview',
          totalAllDockets: 500000,
        }),
      }),
    });

    cy.findByText(
      'There are 123,456 appeals on the Direct Review docket, not including Advanced on the Docket and Court Remand appeals. Some of these appeals are not ready to be sent to a judge. A judge will begin work on your appeal when it’s among the oldest appeals that are ready for their review. In total, there are 500,000 appeals waiting at the Board.',
    );

    cy.axeCheck();
  });

  it('displays check back message when docket info unavailable', () => {
    setupAppealTest({
      appeal: createAppeal({
        location: 'bva',
        statusType: 'on_docket',
        docket: createDocket({
          type: 'directReview',
        }),
      }),
    });

    cy.findByText(
      'Check back next month for more information on where your appeal is in line and how long until a judge is ready for your appeal.',
    );

    cy.axeCheck();
  });

  describe('Docket switching options', () => {
    it('displays Direct Review switching options', () => {
      setupAppealTest({
        appeal: createAppeal({
          statusType: 'on_docket',
          docket: createDocket({
            type: 'directReview',
            eligibleToSwitch: true,
            switchDueDate: '2025-12-01',
          }),
        }),
      });

      cy.findByRole('heading', {
        name: 'Can I add new evidence or request a hearing?',
        level: 2,
      });
      cy.findByText(
        /You have until December 1, 2025 to submit a new VA Form 10182/,
      );

      cy.axeCheck();
    });

    it('displays Evidence Submission switching options', () => {
      setupAppealTest({
        appeal: createAppeal({
          statusType: 'on_docket',
          docket: createDocket({
            type: 'evidenceSubmission',
            eligibleToSwitch: true,
            switchDueDate: '2025-12-01',
          }),
        }),
      });

      cy.findByRole('heading', {
        name: 'What if I want a hearing or no longer want to add new evidence?',
        level: 2,
      });

      cy.findByText(/You have until December 1, 2025 to submit a new/);
      cy.get('va-link[href="/decision-reviews/forms/board-appeal-10182.pdf"]')
        .shadow()
        .findByText('VA Form 10182 (Board Appeal)');

      cy.axeCheck();
    });

    it('displays Hearing Request switching options', () => {
      setupAppealTest({
        appeal: createAppeal({
          statusType: 'on_docket',
          docket: createDocket({
            type: 'hearingRequest',
            eligibleToSwitch: true,
            switchDueDate: '2025-12-01',
          }),
        }),
      });

      cy.findByRole('heading', {
        name: 'What if I no longer want to request a hearing?',
        level: 2,
      });
      cy.findByText(/You have until December 1, 2025 to submit a new/);
      cy.get('va-link[href="/decision-reviews/forms/board-appeal-10182.pdf"]')
        .shadow()
        .findByText('VA Form 10182 (Board Appeal)');

      cy.axeCheck();
    });

    it('displays ETA section when eligible to switch and not AOD', () => {
      setupAppealTest({
        appeal: createAppeal({
          statusType: 'on_docket',
          docket: createDocket({
            type: 'directReview',
            eligibleToSwitch: true,
            eta: {
              directReview: '2026-01-01',
              evidenceSubmission: '2027-01-01',
              hearingRequest: '2028-01-01',
            },
          }),
        }),
      });

      cy.findByRole('heading', {
        name:
          'If I switch to a different appeal option, will I lose my place in line?',
        level: 3,
      });

      cy.findByText(
        /If you switch to a different appeal option, you will keep the same docket date, and your appeal will be decided at the same time as other appeals from June 2025. However, the time that it takes to get a decision is different on each docket./,
      );

      // ETA list for other dockets (excludes current directReview docket)
      cy.findByText(/January 2027/);
      cy.findByText(/Evidence Submission estimate/);
      cy.findByText(/January 2028/);
      cy.findByText(/Hearing Request estimate/);

      cy.axeCheck();
    });

    it('hides ETA section when eligible to switch but is AOD', () => {
      setupAppealTest({
        appeal: createAppeal({
          statusType: 'on_docket',
          aod: true,
          docket: createDocket({
            type: 'directReview',
            eligibleToSwitch: true,
            eta: {
              directReview: '2026-01-01',
              evidenceSubmission: '2027-01-01',
              hearingRequest: '2028-01-01',
            },
          }),
        }),
      });

      // AOD content should show instead of default content with ETA
      cy.findByText(/Your appeal is Advanced on the Docket/);
      cy.findByRole('heading', {
        name:
          'If I switch to a different appeal option, will I lose my place in line?',
        level: 3,
      }).should('not.exist');

      cy.axeCheck();
    });
  });
});
