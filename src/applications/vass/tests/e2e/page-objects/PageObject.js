import { VASS_PHONE_NUMBER } from '../../../utils/constants';

export default class PageObject {
  rootUrl = '/service-member/benefits/solid-start/schedule';

  /**
   * Assert an element exists and optionally contains text
   * @param {string} testId - The data-testid to find
   * @param {Object} options - Options
   * @param {boolean} options.exist - Whether the element should exist
   * @param {string} options.containsText - Text the element should contain
   * @returns {PageObject}
   */
  assertElement(testId, { exist = true, containsText } = {}) {
    if (exist && containsText) {
      cy.findByTestId(testId)
        .should('exist')
        .and('contain.text', containsText);
    } else {
      cy.findByTestId(testId).should(exist ? 'exist' : 'not.exist');
    }
    return this;
  }

  /**
   * Assert a heading exists and optionally contains text
   * @param {Object} props - Properties used to determine what type of heading to assert.
   * @param {string|RegExp=} props.name - The name of the heading to assert.
   * @param {number=} props.level - The level of the heading to assert.
   * @returns {PageObject}
   */
  assertHeading({ name, level = 1, exist = true } = {}) {
    cy.findByRole('heading', { level, name }).should(
      exist ? 'exist' : 'not.exist',
    );

    return this;
  }

  /**
   * Assert the wrapper error alert is displayed or not
   * @param {Object} props - Options
   * @param {boolean} props.exist - Whether the alert should exist
   * @returns {PageObject}
   */
  assertWrapperErrorAlert({ exist = true } = {}) {
    this.assertElement('error-alert', { exist });
    return this;
  }

  /**
   * Assert the loading state is displayed
   * @returns {PageObject}
   */
  assertLoading() {
    this.assertElement('loading-indicator', { exist: true });
    return this;
  }

  /**
   * Assert the loading state is not displayed
   * @returns {PageObject}
   */
  assertNotLoading() {
    this.assertElement('loading-indicator', { exist: false });
    return this;
  }

  /**
   * Assert the need help footer is displayed with all expected content
   * @returns {PageObject}
   */
  assertNeedHelpFooter() {
    // Assert the footer container exists
    this.assertElement('help-footer', { exist: true });

    cy.findByTestId('help-footer').within(() => {
      // Assert the "Need help?" heading
      this.assertHeading({
        name: 'Need help?',
        level: 2,
        exist: true,
      });

      // Assert VA Solid Start section content
      cy.root().should(
        'contain.text',
        'If you need to get in touch with VA Solid Start,',
      );
      cy.findByTestId('solid-start-telephone')
        .should('exist')
        .and('have.attr', 'contact', VASS_PHONE_NUMBER);
      cy.get(
        'a[href="https://benefits.va.gov/benefits/solid-start.asp?trk=public_post_comment-text"]',
      )
        .should('exist')
        .and('contain.text', 'VA Solid Start');

      // Assert Veterans Crisis Line section content
      cy.root().should(
        'contain.text',
        'If you’re in crisis or having thoughts of suicide,',
      );
      cy.findByTestId('veterans-crisis-line-telephone')
        .should('exist')
        .and('have.attr', 'contact', '988');
      cy.findByTestId('veterans-crisis-line-text-telephone')
        .should('exist')
        .and('have.attr', 'contact', '838255');

      // Assert emergency section content
      cy.root().should(
        'contain.text',
        'If you think your life or health is in danger,',
      );
      cy.findByTestId('emergency-telephone')
        .should('exist')
        .and('have.attr', 'contact', '911');
    });

    return this;
  }
}
