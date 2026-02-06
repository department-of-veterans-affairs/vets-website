import PageObject from './Page-Object';

export class TopicSelectionPageObject extends PageObject {
  /**
   * Assert the Topic Selection page is displayed
   * @param {number} numberOfTopics - The number of topics to display
   * @returns {TopicSelectionPageObject}
   */
  assertTopicSelectionPage(numberOfTopics = 17) {
    this.assertHeading({
      name: 'What do you want to learn more about?(*Required)',
      level: 1,
      exist: true,
    });

    // Assert no error states on initial load
    this.assertErrorAlert({ exist: false });

    this.assertElement('button-pair', { exist: true });

    this.assertCheckboxGroupLabel();
    this.assertButtonPair();
    this.assertTopicCount(numberOfTopics);
    this.assertErrorAlert({ exist: false });

    // Assert need help footer
    this.assertNeedHelpFooter();

    return this;
  }

  /**
   * Assert the checkbox group label is displayed
   * @returns {TopicSelectionPageObject}
   */
  assertCheckboxGroupLabel() {
    cy.findByTestId('topic-checkbox-group')
      .should('exist')
      .and('have.attr', 'label', 'Check all that apply');
    return this;
  }

  /**
   * Assert the validation error message is displayed on the checkbox group
   * @param {string} errorMessage - The expected error message
   * @returns {TopicSelectionPageObject}
   */
  assertValidationError(errorMessage) {
    cy.findByTestId('topic-checkbox-group').should(
      'have.attr',
      'error',
      errorMessage,
    );
    return this;
  }

  /**
   * Assert no validation error is displayed
   * @returns {TopicSelectionPageObject}
   */
  assertNoValidationError() {
    cy.findByTestId('topic-checkbox-group').should('not.have.attr', 'error');
    return this;
  }

  /**
   * Select a topic by its checkbox testId
   * @param {string} topicTestId - The testId of the topic checkbox (e.g., 'topic-checkbox-education')
   * @returns {TopicSelectionPageObject}
   */
  selectTopicByTestId(topicTestId) {
    cy.findByTestId(topicTestId)
      .should('exist')
      .click();
    return this;
  }

  /**
   * Select a topic by its name/label
   * @param {string} topicName - The label text of the topic
   * @returns {TopicSelectionPageObject}
   */
  selectTopicByName(topicName) {
    cy.get(`va-checkbox[label="${topicName}"]`)
      .should('exist')
      .click();
    return this;
  }

  /**
   * Unselect a topic by its checkbox testId
   * @param {string} topicTestId - The testId of the topic checkbox
   * @returns {TopicSelectionPageObject}
   */
  unselectTopicByTestId(topicTestId) {
    cy.findByTestId(topicTestId)
      .should('exist')
      .click();
    return this;
  }

  /**
   * Select the first available topic checkbox
   * @returns {TopicSelectionPageObject}
   */
  selectFirstTopic() {
    cy.findByTestId('topic-checkbox-group')
      .find('va-checkbox')
      .first()
      .click();
    return this;
  }

  /**
   * Select multiple topics by their testIds
   * @param {string[]} topicTestIds - Array of topic checkbox testIds
   * @returns {TopicSelectionPageObject}
   */
  selectTopics(topicTestIds) {
    topicTestIds.forEach(testId => {
      this.selectTopicByTestId(testId);
    });
    return this;
  }

  /**
   * Assert a topic checkbox is checked
   * @param {string} topicTestId - The testId of the topic checkbox
   * @returns {TopicSelectionPageObject}
   */
  assertTopicChecked(topicTestId) {
    cy.findByTestId(topicTestId).should('have.attr', 'checked', 'true');
    return this;
  }

  /**
   * Assert a topic checkbox is not checked
   * @param {string} topicTestId - The testId of the topic checkbox
   * @returns {TopicSelectionPageObject}
   */
  assertTopicNotChecked(topicTestId) {
    cy.findByTestId(topicTestId).should('not.have.attr', 'checked');
    return this;
  }

  /**
   * Assert a specific number of topics are displayed
   * @param {number} count - The expected number of topics
   * @returns {TopicSelectionPageObject}
   */
  assertTopicCount(count) {
    cy.findByTestId('topic-checkbox-group')
      .find('va-checkbox')
      .should('have.length', count);
    return this;
  }

  /**
   * Click the continue button
   * @returns {TopicSelectionPageObject}
   */
  clickContinue() {
    cy.findByTestId('button-pair')
      .shadow()
      .find('va-button[continue]')
      .click();
    return this;
  }

  /**
   * Click the back button
   * @returns {TopicSelectionPageObject}
   */
  clickBack() {
    cy.findByTestId('button-pair')
      .shadow()
      .find('va-button[back]')
      .click();
    return this;
  }

  /**
   * Assert the button pair exists
   * @returns {TopicSelectionPageObject}
   */
  assertButtonPair() {
    cy.findByTestId('button-pair').should('exist');
    return this;
  }

  /**
   * Select the first topic and continue
   * @returns {TopicSelectionPageObject}
   */
  selectFirstTopicAndContinue() {
    this.selectFirstTopic();
    this.clickContinue();
    return this;
  }

  /**
   * Select a topic by its name/label and continue
   * @param {string} topicName - The label text of the topic
   * @returns {TopicSelectionPageObject}
   */
  selectTopicAndContinue(topicName) {
    this.selectTopicByName(topicName);
    this.clickContinue();
    return this;
  }

  /**
   * Submit form without selecting any topic to trigger validation errors
   * @returns {TopicSelectionPageObject}
   */
  submitWithoutSelection() {
    this.clickContinue();
    return this;
  }

  /**
   * Assert a topic with a specific label exists
   * @param {string} topicName - The label text of the topic
   * @returns {TopicSelectionPageObject}
   */
  assertTopicExists(topicName) {
    cy.get(`va-checkbox[label="${topicName}"]`).should('exist');
    return this;
  }

  /**
   * Assert a topic with a specific label does not exist
   * @param {string} topicName - The label text of the topic
   * @returns {TopicSelectionPageObject}
   */
  assertTopicNotExists(topicName) {
    cy.get(`va-checkbox[label="${topicName}"]`).should('not.exist');
    return this;
  }
}

export default new TopicSelectionPageObject();
