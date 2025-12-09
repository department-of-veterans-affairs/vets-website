import { mockFeatureToggles } from '../../support/helpers/mocks';
import { setupClaimTest } from '../../support/helpers/setup';
import { verifyNeedHelp } from '../../support/helpers/assertions';
import { createBenefitsClaim } from '../../support/fixtures/benefitsClaims';

const NEEDED_FROM_OTHERS_PATH = 'needed-from-others/123456';

describe('Claim document request', () => {
  beforeEach(() => {
    mockFeatureToggles();
    cy.login();
  });

  it('should display support aliases', () => {
    setupClaimTest({
      claim: createBenefitsClaim(),
      path: NEEDED_FROM_OTHERS_PATH,
    });

    verifyNeedHelp();

    cy.get('va-need-help')
      .contains(
        'The VA benefits hotline may refer to the “disability exam for hearing” request as “DBQ AUDIO Hearing Loss and Tinnitus”, “Hearing Exam” or “Audio Exam.”',
      )
      .should('be.visible');

    cy.axeCheck();
  });
});
