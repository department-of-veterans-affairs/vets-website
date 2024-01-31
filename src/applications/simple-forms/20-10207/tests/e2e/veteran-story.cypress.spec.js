/* eslint-disable @department-of-veterans-affairs/axe-check-required */
// the standard 10207-pp.cypress.spec.js already axe-checks everything
import moment from 'moment';
import { TITLE, SUBTITLE } from '../../config/constants';
import manifest from '../../manifest.json';
import featureToggles from './fixtures/mocks/featureToggles.json';
import userUnauthed from './fixtures/mocks/user.json';
import {
  continueToNextPage,
  pagePathIsCorrect,
  fillIdInfoPage,
  fillLivingSituationPage,
  fillNameAndDateOfBirthPage,
  fillOtherHousingRisksPage,
  showsCorrectChapterTitle,
  showsCorrectPageTitle,
  showsCorrectErrorMessage,
  showsCorrectLivingSituationCheckboxLabels,
} from './e2eHelpers';

// Skip in CI
const testSuite = Cypress.env('CI') ? describe.skip : describe;

testSuite('PP 10207 - Veteran', () => {
  Cypress.config({
    defaultCommandTimeout: 10000,
    delay: 20,
    waitForAnimations: true,
  });

  const userLOA3 = {
    ...userUnauthed,
    data: {
      ...userUnauthed.data,
      attributes: {
        ...userUnauthed.data.attributes,
        login: {
          currentlyLoggedIn: true,
        },
        profile: {
          ...userUnauthed.data.attributes.profile,
          loa: {
            current: 3,
          },
        },
      },
    },
  };
  const userLOA2 = {
    ...userUnauthed,
    data: {
      ...userUnauthed.data,
      attributes: {
        ...userUnauthed.data.attributes,
        login: {
          currentlyLoggedIn: true,
        },
        profile: {
          ...userUnauthed.data.attributes.profile,
          loa: {
            current: 2,
          },
        },
      },
    },
  };

  beforeEach(() => {
    cy.intercept('/v0//v0/feature_toggles', featureToggles);
    cy.visit('/');
  });

  describe('Introduction page', () => {
    it('displays correct title & subtitle', () => {
      cy.visit(`${manifest.rootUrl}`);
      cy.findByTestId('form-title').should('contain', TITLE);
      cy.findByTestId('form-subtitle').should('contain', SUBTITLE);
    });

    describe('Unauthenticated', () => {
      it('hides unauth’ed start-link', () => {
        cy.contains(/^start*without signing in$/i, { selector: 'a' }).should(
          'not.exist',
        );
      });
      // Cypress can't test the actual Sign in to start button because
      // sign-in iframe is not visible to Cypress.
    });

    describe('Authenticated LOA3', () => {
      beforeEach(() => {
        // Cypress must sign-in first, then visit the form.
        // Doesn't support ID.me sign-in iframe/redirects.
        cy.intercept('/v0/user', userLOA3);
        cy.login(userLOA3);
        cy.visit(`${manifest.rootUrl}`);
        pagePathIsCorrect('introduction');
      });

      it('hides verify-ID alert and shows auth’ed SIP alert', () => {
        cy.findByTestId('verifyIdAlert').should('not.exist');
      });

      it('shows auth’ed SIP-alert', () => {
        cy.contains('Since you’re signed in', {
          selector: 'va-alert[status=info]',
        }).should('exist');
      });
    });

    describe('Authenticated LOA2', () => {
      beforeEach(() => {
        // Cypress must sign-in first, then visit the form.
        // Doesn't support ID.me sign-in iframe/redirects.
        cy.intercept('/v0/user', userLOA2);
        cy.login(userLOA2);
        cy.visit(`${manifest.rootUrl}/introduction`);
        pagePathIsCorrect('introduction');
      });

      it('shows verify-ID alert', () => {
        cy.findByTestId('verifyIdAlert').should('exist');
      });

      it('hides auth’ed SIP-alert', () => {
        cy.contains('Since you’re signed in', {
          selector: 'va-alert[status=info]',
        }).should('not.exist');
      });

      it('hides start-link', () => {
        cy.contains(/^start*$/i, { selector: 'a' }).should('not.exist');
      });
    });
  });

  describe('Your-identity chapter', () => {
    beforeEach(() => {
      cy.intercept('/v0/user', userLOA3);
      cy.login(userLOA3);
      cy.visit(`${manifest.rootUrl}/introduction`);
      cy.location('pathname').should('eq', `${manifest.rootUrl}/introduction`);
      pagePathIsCorrect('introduction');
      cy.findByText(/^start/i, { selector: 'a[href="#start"]' })
        .last()
        .click();
      pagePathIsCorrect('preparer-type');
    });

    it('displays correct H3 page-title', () => {
      showsCorrectPageTitle('Which of these best describes you?', 3);
    });

    it('displays correct error message for empty selection', () => {
      continueToNextPage();
      showsCorrectErrorMessage('Select your identity');
    });

    it('advances to Your-personal-information chapter', () => {
      cy.contains('I’m a Veteran.').click();
      continueToNextPage();
      pagePathIsCorrect('name-and-date-of-birth');
      showsCorrectChapterTitle('Your personal information');
      showsCorrectPageTitle('Your name and date of birth', 3);
    });
  });

  describe('Your-personal-information chapter', () => {
    beforeEach(() => {
      cy.intercept('/v0/user', userLOA3);
      cy.login(userLOA3);
      cy.visit(`${manifest.rootUrl}`);
      cy.findByText(/^start/i, { selector: 'a[href="#start"]' })
        .last()
        .click();
      cy.contains('I’m a Veteran.').click();
      continueToNextPage();
      pagePathIsCorrect('name-and-date-of-birth');
    });

    describe('Name-and-date-of-birth page', () => {
      it('displays correct chapter-title', () => {
        showsCorrectChapterTitle('Your personal information');
      });

      it('displays correct H3 page-title', () => {
        showsCorrectChapterTitle('Your personal information');
        showsCorrectPageTitle('Your name and date of birth', 3);
      });

      it('displays correct error messages for empty required fields', () => {
        continueToNextPage();
        showsCorrectErrorMessage('Please enter a first name');
        showsCorrectErrorMessage('Please enter a last name');
        // Form-app in regular browser shows "Please provide a valid date" but in Cypress it's "Please provide the date of birth"
        showsCorrectErrorMessage('Please provide the date of birth');
      });

      it('displays correct error message for invalid day of birth', () => {
        cy.get('select[name="root_dateOfBirthMonth"]').select('1');
        cy.get('input[name="root_dateOfBirthDay"]').type('32', { force: true });
        cy.get('input[name="root_dateOfBirthYear"]').type('2000', {
          force: true,
        });
        continueToNextPage();
        showsCorrectErrorMessage('Please enter a day between 1 and 31');
      });

      it('displays correct error message for future date of birth', () => {
        const tmrw = moment()
          .add(1, 'days')
          .format('YYYY-M-D')
          .split('-');
        cy.get('select[name="root_dateOfBirthMonth"]').select(tmrw[1]);
        cy.get('input[name="root_dateOfBirthDay"]').type(tmrw[2], {
          force: true,
        });
        cy.get('input[name="root_dateOfBirthYear"]').type(tmrw[0], {
          force: true,
        });
        continueToNextPage();
        showsCorrectErrorMessage('Please provide a valid current or past date');
      });

      it('advances to Your-identification-information page', () => {
        fillNameAndDateOfBirthPage('veteran');
        continueToNextPage();
        pagePathIsCorrect('identification-information');
      });
    });

    describe('Identification-information page', () => {
      beforeEach(() => {
        fillNameAndDateOfBirthPage('veteran');
        continueToNextPage();
        pagePathIsCorrect('identification-information');
      });

      it('displays correct chapter-title', () => {
        showsCorrectChapterTitle('Your personal information');
      });

      it('displays correct H3 page-title', () => {
        showsCorrectPageTitle('Your identification information', 3);
      });

      it('displays correct error message for empty required fields', () => {
        continueToNextPage();
        showsCorrectErrorMessage('Please enter a Social Security number');
      });

      it('displays correct error message for invalid SSN', () => {
        cy.get('input[name="root_id_ssn"]').then($ssn => {
          cy.wrap($ssn).type('1234567', { force: true });
          continueToNextPage();
          showsCorrectErrorMessage(
            'Please enter a valid 9 digit Social Security number (dashes allowed)',
          );
          cy.wrap($ssn).type('{selectall}1234567890', { force: true });
          showsCorrectErrorMessage(
            'Please enter a valid 9 digit Social Security number (dashes allowed)',
          );
        });
      });

      it('displays correct error message for invalid VA file number', () => {
        cy.get('input[name="root_id_vaFileNumber"]').then($vfn => {
          cy.wrap($vfn).type('1234567', { force: true });
          continueToNextPage();
          showsCorrectErrorMessage('Your VA file number must be 8 or 9 digits');
          cy.wrap($vfn).type('1234567890', { force: true });
          showsCorrectErrorMessage('Your VA file number must be 8 or 9 digits');
        });
      });

      it('advances to Your-living-situation chapter', () => {
        fillIdInfoPage('veteran');
        continueToNextPage();
        pagePathIsCorrect('living-situation');
      });
    });
  });

  describe('Your-living-situation chapter', () => {
    beforeEach(() => {
      cy.intercept('/v0/user', userLOA3);
      cy.login(userLOA3);
      cy.visit(`${manifest.rootUrl}`);
      cy.findByText(/^start/i, { selector: 'a[href="#start"]' })
        .last()
        .click();
      cy.contains('I’m a Veteran.').click();
      continueToNextPage();
      fillNameAndDateOfBirthPage('veteran');
      continueToNextPage();
      fillIdInfoPage('veteran');
      continueToNextPage();
      pagePathIsCorrect('living-situation');
    });

    describe('Your-living-situation page', () => {
      it('displays correct chapter-title', () => {
        showsCorrectChapterTitle('Your living situation');
      });

      it('displays correct H3 page-title', () => {
        showsCorrectPageTitle(
          'Which of these statements best describe your living situation?',
          3,
        );
      });

      it('displays correct checkbox-labels', () => {
        showsCorrectLivingSituationCheckboxLabels('veteran');
      });

      it('displays correct error message for empty selection', () => {
        continueToNextPage();
        showsCorrectErrorMessage('Select the appropriate living situation');
      });

      it('displays correct error message for NONE + 1 selections', () => {
        fillLivingSituationPage('veteranOhr');
        cy.contains('None').click();
        continueToNextPage();
        showsCorrectErrorMessage(
          'If none of these situations apply to you, unselect the other options you selected',
        );
      });

      it('advances to Other-housing-risks page when OTHER_RISK is selected', () => {
        fillLivingSituationPage('veteranOhr');
        continueToNextPage();
        pagePathIsCorrect('other-housing-risks');
      });

      it('advances to Your-contact-information chapter when NONE is selected', () => {
        fillLivingSituationPage('veteran');
        continueToNextPage();
        pagePathIsCorrect('mailing-address-yes-no');
      });
    });

    describe('Other-housing-risks page', () => {
      beforeEach(() => {
        cy.contains('another housing risk').click();
        continueToNextPage();
        pagePathIsCorrect('other-housing-risks');
      });

      it('displays correct page-title', () => {
        showsCorrectPageTitle('Other housing risks', 3);
      });

      it('displays correct error message for empty input', () => {
        continueToNextPage();
        showsCorrectErrorMessage(
          'List other housing risks you are experiencing',
        );
      });

      it('advances to next chapter', () => {
        // TODO: Change path below once next chapter is built
        fillOtherHousingRisksPage('veteranOhr');
        continueToNextPage();
        pagePathIsCorrect('review-and-submit');
      });
    });
  });

  describe('Your-contact-information chapter', () => {
    beforeEach(() => {
      cy.intercept('/v0/user', userLOA3);
      cy.login(userLOA3);
      cy.visit(`${manifest.rootUrl}`);
      cy.findByText(/^start/i, { selector: 'a[href="#start"]' })
        .last()
        .click();
      cy.contains('I’m a Veteran.').click();
      continueToNextPage();
      fillNameAndDateOfBirthPage('veteran');
      continueToNextPage();
      fillIdInfoPage('veteran');
      continueToNextPage();
      cy.contains('None').click();
      continueToNextPage();
      pagePathIsCorrect('mailing-address-yes-no');
    });

    describe('Mailing-address-yes-no page', () => {
      it('displays correct chapter-title', () => {
        showsCorrectChapterTitle('Your contact information');
      });

      it('displays correct H3 page-title', () => {
        showsCorrectPageTitle('Do you have a current mailing address?', 3);
      });

      it('displays correct error message for empty selection', () => {
        continueToNextPage();
        showsCorrectErrorMessage(
          'Select yes if you have a current mailing address. Select no if you do not have a current mailing address.',
        );
      });

      it('advances to Your-mailing-address page when YES is selected', () => {
        cy.contains('Yes').click();
        continueToNextPage();
        pagePathIsCorrect('mailing-address');
      });

      it('advances to next-page when NO is selected', () => {
        cy.contains('No').click();
        continueToNextPage();
        // TODO: Change path to next-page once built
        pagePathIsCorrect('review-and-submit');
      });
    });
  });
});
