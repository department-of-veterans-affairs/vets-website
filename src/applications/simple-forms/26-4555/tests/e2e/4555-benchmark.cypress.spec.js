/* eslint-disable no-console, no-use-before-define, camelcase */
/**
 * Cypress benchmark test for the 26-4555 Adapted Housing form.
 *
 * Standalone test (no form-tester dependency) that navigates through
 * the same form pages as the Playwright benchmark, for a fair comparison.
 */

const ROOT_URL =
  '/housing-assistance/disability-housing-grants/apply-for-grant-form-26-4555';

// Inline test data (same as minimal-test.json)
const minimalTestData = {
  livingSituation: {
    isInCareFacility: false,
    careFacilityAddress: { country: 'USA' },
  },
  previousHiApplication: {
    hasPreviousHiApplication: false,
    previousHiApplicationAddress: { country: 'USA' },
  },
  previousSahApplication: {
    hasPreviousSahApplication: false,
    previousSahApplicationAddress: { country: 'USA' },
  },
  veteran: {
    homePhone: '1111111111',
    email: 'user@test.com',
    address: {
      isMilitary: false,
      country: 'USA',
      'view:militaryBaseDescription': {},
      street: '1111 Rock st.',
      city: 'Rocktown',
      state: 'IN',
      postalCode: '11111',
    },
    ssn: '345456789',
    fullName: { first: 'Barnie', last: 'Rubble' },
    dateOfBirth: '2000-07-10',
  },
};

// LOA3 user mock
const userLOA3 = {
  data: {
    attributes: {
      profile: {
        sign_in: { service_name: 'idme' },
        email: 'john.preparer@example.com',
        loa: { current: 3 },
        first_name: 'John',
        middle_name: '',
        last_name: 'Preparer',
        gender: 'F',
        birth_date: '1985-01-01',
        verified: true,
      },
      veteran_status: {
        status: 'OK',
        is_veteran: true,
        served_in_military: true,
      },
      in_progress_forms: [],
      prefills_available: ['21-4138'],
      services: [
        'facilities',
        'hca',
        'edu-benefits',
        'evss-claims',
        'form526',
        'user-profile',
        'appeals-status',
        'form-save-in-progress',
        'form-prefill',
        'identity-proofed',
      ],
      login: { currentlyLoggedIn: true },
    },
  },
};

function resolveFieldData(fieldName, data) {
  const dataPath = fieldName
    .replace(/^root_/, '')
    .replace(/_/g, '.')
    .replace(/\._(\d+)\./g, (_, n) => `[${n}]`);

  const parts = dataPath.split('.');
  let current = data;
  for (const part of parts) {
    if (current === undefined || current === null) return undefined;
    const arrayMatch = part.match(/^(.+)\[(\d+)\]$/);
    if (arrayMatch) {
      current = current[arrayMatch[1]];
      if (Array.isArray(current)) {
        current = current[parseInt(arrayMatch[2], 10)];
      } else {
        return undefined;
      }
    } else {
      current = current[part];
    }
  }
  return current;
}

describe('26-4555 Adapted Housing — Cypress Benchmark', () => {
  let startTime;

  beforeEach(() => {
    startTime = Date.now();

    // Set up mocks — use same pattern as the working form-tester test
    cy.intercept('/v0/api', { status: 200 });
    cy.intercept('/v0/feature_toggles*', {
      data: { type: 'feature_toggles', features: [] },
    });
    cy.intercept('/v0/maintenance_windows', { data: [] });
    cy.intercept('PUT', '/v0/in_progress_forms/26-4555', {
      data: { attributes: { metadata: {} } },
    });
    cy.intercept('GET', '/v0/in_progress_forms/26-4555', {
      formData: { veteran: {} },
      metadata: {
        version: 0,
        prefill: true,
        returnUrl: '/veteran/personal-information-1',
      },
    });
    cy.intercept('POST', '/simple_forms_api/v1/simple_forms*', {
      confirmationNumber: 'S-V6-TEST',
      pdfUrl: '',
    });
    cy.login(userLOA3);
  });

  it('minimal-test: navigates through entire form', () => {
    cy.visit(ROOT_URL);

    // Wait for app to load — wait for the start link to appear
    cy.get('a[href="#start"]', { timeout: 15000 })
      .last()
      .should('be.visible');
    cy.log(`[CY] App loaded: ${Date.now() - startTime}ms`);

    // === Introduction page ===
    cy.get('a[href="#start"]')
      .last()
      .click();

    cy.url().should('not.include', '/introduction');
    cy.log(`[CY] After intro: ${Date.now() - startTime}ms`);

    // === Walk through form pages ===
    const processPage = () => {
      cy.url().then(url => {
        const currentPath = new URL(url).pathname;

        if (currentPath.includes('/confirmation')) {
          cy.log(`[CY BENCHMARK] Total time: ${Date.now() - startTime}ms`);
          return;
        }

        if (currentPath.includes('/review-and-submit')) {
          cy.log(`[CY] Review page: ${Date.now() - startTime}ms`);

          // Check privacy checkbox
          cy.get('body').then($body => {
            if ($body.find('va-privacy-agreement').length) {
              cy.get('va-privacy-agreement')
                .shadow()
                .find('input')
                .check({ force: true });
            }
          });

          // Sign
          cy.get('body').then($body => {
            if ($body.find('va-text-input[name*="signature"]').length) {
              cy.get('va-text-input[name*="signature"]')
                .shadow()
                .find('input')
                .type('Barnie Rubble');
            }
          });

          // Certify checkbox
          cy.get('body').then($body => {
            if ($body.find('va-checkbox[name*="certify"]').length) {
              cy.get('va-checkbox[name*="certify"]')
                .shadow()
                .find('input')
                .check({ force: true });
            }
          });

          // Submit
          cy.get('va-button-pair')
            .shadow()
            .find('va-button:not([secondary]):not([back])')
            .first()
            .click();

          cy.url()
            .should('include', '/confirmation', { timeout: 15000 })
            .then(() => {
              cy.log(`[CY BENCHMARK] Total time: ${Date.now() - startTime}ms`);
            });
          return;
        }

        // Regular form page
        cy.log(`[CY] Page: ${currentPath}`);

        // Wait for form content to be ready
        cy.get('#react-root form, #react-root .form-panel', {
          timeout: 10000,
        }).should('exist');

        // Fill visible fields
        fillVisibleFields();

        // Click continue - scope to form area to avoid header search button
        cy.get('#react-root').then($root => {
          if ($root.find('va-button-pair').length) {
            cy.get('#react-root va-button-pair')
              .first()
              .shadow()
              .find('va-button:not([secondary]):not([back])')
              .first()
              .click();
          } else {
            cy.get(
              '#react-root button.usa-button-primary, #react-root button[type="submit"]',
            )
              .first()
              .click();
          }
        });

        // Wait for navigation away from current page
        cy.url().should('not.eq', url, { timeout: 10000 });
        cy.log(`[CY] Page done: ${Date.now() - startTime}ms`);

        // Process next page
        processPage();
      });
    };

    function fillVisibleFields() {
      // Fill va-text-input fields
      cy.get('body').then($body => {
        const inputs = $body.find('va-text-input');
        inputs.each((_, el) => {
          const name = el.getAttribute('name');
          if (!name || !name.startsWith('root_')) return;
          const value = resolveFieldData(name, minimalTestData);
          if (value !== undefined && value !== null) {
            cy.wrap(el)
              .shadow()
              .find('input')
              .clear()
              .type(value.toString());
          }
        });

        // Fill va-select fields
        const selects = $body.find('va-select');
        selects.each((_, el) => {
          const name = el.getAttribute('name');
          if (!name || !name.startsWith('root_')) return;
          const value = resolveFieldData(name, minimalTestData);
          if (value !== undefined && value !== null) {
            cy.wrap(el)
              .shadow()
              .find('select')
              .select(value.toString());
          }
        });

        // Handle va-radio
        const radios = $body.find('va-radio');
        radios.each((_, el) => {
          const name = el.getAttribute('name');
          if (!name || !name.startsWith('root_')) return;
          const value = resolveFieldData(name, minimalTestData);
          if (value !== undefined && value !== null) {
            let radioValue = value;
            if (typeof radioValue === 'boolean')
              radioValue = radioValue ? 'Y' : 'N';
            cy.wrap(el)
              .shadow()
              .find(`va-radio-option[value="${radioValue}"]`)
              .first()
              .click();
          }
        });

        // Handle va-checkbox
        const checkboxes = $body.find('va-checkbox');
        checkboxes.each((_, el) => {
          const name = el.getAttribute('name');
          if (!name || !name.startsWith('root_')) return;
          const value = resolveFieldData(name, minimalTestData);
          if (value === true) {
            cy.wrap(el)
              .shadow()
              .find('input')
              .check({ force: true });
          }
        });

        // Handle va-memorable-date
        const dates = $body.find('va-memorable-date');
        dates.each((_, el) => {
          const name = el.getAttribute('name');
          if (!name || !name.startsWith('root_')) return;
          const value = resolveFieldData(name, minimalTestData);
          if (value && typeof value === 'string' && value.includes('-')) {
            const [year, month, day] = value.split('-');
            cy.wrap(el)
              .shadow()
              .find('va-select')
              .shadow()
              .find('select')
              .select(parseInt(month, 10).toString());
            cy.wrap(el)
              .shadow()
              .find('va-text-input.usa-form-group--day-input')
              .shadow()
              .find('input')
              .clear()
              .type(parseInt(day, 10).toString());
            cy.wrap(el)
              .shadow()
              .find('va-text-input.usa-form-group--year-input')
              .shadow()
              .find('input')
              .clear()
              .type(year);
          }
        });

        // Handle va-telephone
        const phones = $body.find('va-telephone-input');
        phones.each((_, el) => {
          const name = el.getAttribute('name');
          if (!name || !name.startsWith('root_')) return;
          const value = resolveFieldData(name, minimalTestData);
          if (value !== undefined && value !== null) {
            cy.wrap(el)
              .shadow()
              .find('va-text-input')
              .shadow()
              .find('input')
              .clear()
              .type(value.toString());
          }
        });
      });
    }

    processPage();
  });
});
