import MockUser from '../../../fixtures/MockUser';
import AppointmentListPageObject from '../../page-objects/AppointmentList/AppointmentListPageObject';
import TypeOfCarePageObject from '../../page-objects/TypeOfCarePageObject';
import UrgentCareInformationPageObject from '../../page-objects/UrgentCareInformationPageObject';
import {
  mockAppointmentsGetApi,
  mockFeatureToggles,
  mockVamcEhrApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';

/**
 * Regression test for CSS character encoding bug.
 *
 * The css-library's formation stylesheet uses `content: '\a0'` on radio and
 * checkbox pseudo-elements. Sass compiles this into raw UTF-8 bytes (0xC2 0xA0).
 * Webpack strips the @charset "UTF-8" declaration during production bundling.
 * When a browser interprets these bytes as Latin-1 (e.g. from cache), the byte
 * 0xC2 renders as "Â" inside radio buttons and checkboxes.
 *
 * This test forces the worst-case scenario by intercepting CSS responses and
 * setting charset=iso-8859-1, which guarantees the raw bytes are decoded as
 * Latin-1. With the fix applied (content: \00a0 via unquote), the CSS escape
 * is pure ASCII and renders correctly regardless of charset.
 *
 * @see https://github.com/department-of-veterans-affairs/vets-design-system-documentation/issues/5350
 */
describe('VAOS radio button encoding', () => {
  beforeEach(() => {
    vaosSetup();
    mockAppointmentsGetApi({ response: [] });
    mockFeatureToggles();
    mockVamcEhrApi();

    // Force browser to interpret CSS as Latin-1 instead of UTF-8.
    // This simulates the cache-dependent bug where raw UTF-8 bytes
    // 0xC2 0xA0 get decoded as "Â " in Latin-1.
    cy.intercept('GET', '**/generated/style.css', req => {
      req.continue(res => {
        res.headers['content-type'] = 'text/css; charset=iso-8859-1';
      });
    });
    cy.intercept('GET', '**/generated/vaos.css', req => {
      req.continue(res => {
        res.headers['content-type'] = 'text/css; charset=iso-8859-1';
      });
    });
  });

  it('radio buttons render without garbled characters', () => {
    const mockUser = new MockUser({ addressLine1: '123 Main St.' });

    cy.login(mockUser);

    AppointmentListPageObject.visit().scheduleAppointment();

    UrgentCareInformationPageObject.assertUrl().scheduleAppointment();

    TypeOfCarePageObject.assertUrl();

    // Verify radio buttons are visible
    cy.get('.form-radio-buttons label').should('have.length.greaterThan', 0);

    cy.axeCheckBestPractice();

    // Check the computed content of radio button ::before pseudo-elements.
    // Under Latin-1 decoding (forced by cy.intercept above), raw UTF-8
    // bytes 0xC2 0xA0 become "Â " (two chars). With the fix (ASCII escape
    // \00a0), the content is a single non-breaking space regardless of charset.
    cy.get('.form-radio-buttons label')
      .first()
      .then($label => {
        const { content } = window.getComputedStyle($label[0], '::before');
        // CSS content values are returned quoted, e.g. '" "' for a space.
        // Strip the outer quotes to get the raw string value.
        const raw = content.replace(/^"|"$/g, '');

        expect(
          raw,
          `::before content should be a single non-breaking space character, ` +
            `not garbled "Â" + nbsp. Got: ${JSON.stringify(
              content,
            )}. See issue #5350.`,
        ).to.not.contain('\u00c2');

        expect(
          raw.length,
          `::before content should be exactly 1 character (\\u00a0), ` +
            `not ${raw.length}. Got: ${JSON.stringify(
              content,
            )}. See issue #5350.`,
        ).to.equal(1);
      });
  });
});
