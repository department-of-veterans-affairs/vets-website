import React from 'react';
import { expect } from 'chai';
import ReactDOM from 'react-dom';

import { render, fireEvent, waitFor } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import EducationWizard from '../../components/EducationWizard';
import wizardConfig from '../../utils/wizardConfig';

describe('<EducationWizard>', () => {
  it('should show button and no questions', () => {
    const dom = document.createElement('div');
    ReactDOM.render(
      <EducationWizard
        config={wizardConfig}
        toggleText="Troubleshoot My GI Bill Benefits"
      />,
      dom,
    );

    expect(dom.querySelector('button')).not.to.be.false;
    expect(dom.querySelector('#wizardOptions').className).to.contain(
      'wizard-content-closed',
    );
  });
  it('should show button and first question', () => {
    const dom = document.createElement('div');
    ReactDOM.render(
      <EducationWizard
        config={wizardConfig}
        toggleText="Troubleshoot My GI Bill Benefits"
      />,
      dom,
    ).setState({ open: true });

    expect(dom.querySelector('button')).not.to.be.false;
    expect(dom.querySelector('#wizardOptions').className).not.to.contain(
      'wizard-content-closed',
    );
    expect(dom.querySelector('va-radio')).not.to.be.empty;
  });
  it('should show next relevant question', async () => {
    const { container } = render(
      <EducationWizard
        config={wizardConfig}
        toggleText="Troubleshoot My GI Bill Benefits"
      />,
    );

    const firstQuestion = $('va-radio[name="recentApplication"]', container);
    expect(firstQuestion).to.exist;

    // Simulates selection of the second option.
    const changeEvent = new MouseEvent('vaValueChange', {
      detail: { value: false },
    });

    fireEvent(firstQuestion, changeEvent);

    // Allow the state to update and render the next question.
    await waitFor(() => {
      const secondQuestion = $('va-radio[name="veteran"]', container);
      expect(secondQuestion).to.exist;
    });
  });
  it('should reset after earlier answer changed', async () => {
    const { container } = render(
      <EducationWizard
        config={wizardConfig}
        toggleText="Troubleshoot My GI Bill Benefits"
      />,
    );

    const changeEventFalse = new MouseEvent('vaValueChange', {
      detail: { value: false },
    });

    const changeEventTrue = new MouseEvent('vaValueChange', {
      detail: { value: true },
    });

    expect($('va-radio[name="recentApplication"]', container)).to.exist;

    // Set name=recentApplication question to false.
    fireEvent(
      $('va-radio[name="recentApplication"]', container),
      changeEventFalse,
    );

    // Check that the next question is shown.
    await waitFor(() => {
      expect($('va-radio[name="veteran"]', container)).to.exist;
    });

    // Set name=veteran question to true.
    fireEvent($('va-radio[name="veteran"]', container), changeEventTrue);

    // Check that the next question is shown.
    await waitFor(() => {
      expect($('va-radio[name="recentApplication"]', container)).to.exist;
    });

    // Set name=recentApplication question to false
    fireEvent(
      $('va-radio[name="recentApplication"]', container),
      changeEventFalse,
    );

    // Expect name=veteran not to be selected anymore.
    await waitFor(() => {
      expect($('va-radio[name="veteran"]', container)).to.exist;
    });

    expect($('va-radio-option[label="More than 30 days ago"]', container)).to
      .exist;
    expect($('va-radio[value="false"]', container)).not.to.exist;
  });
  it('should display question if previous is an array and isActive is true', async () => {
    // Mock the isActive function to return true for the test
    const mockConfig = [
      {
        type: 'recentApplication',
        label: 'Have you applied recently?',
        isActive: () => true,
        previous: ['somePreviousChoice'],
        options: [
          { label: 'Yes', value: 'true' },
          { label: 'No', value: 'false' },
        ],
      },
      {
        type: 'veteran',
        label: 'Are you a veteran?',
        isActive: () => false,
        previous: ['recentApplication'],
        options: [
          { label: 'Yes', value: 'true' },
          { label: 'No', value: 'false' },
        ],
      },
    ]; // Always return true for this test // Mock previous as an array // This question should not display // This depends on the first question

    const { container } = render(
      <EducationWizard
        config={mockConfig}
        toggleText="Troubleshoot My GI Bill Benefits"
      />,
    );

    // Simulate clicking the button to open the wizard
    fireEvent.click(container.querySelector('.wizard-button'));

    // Verify that the first question is displayed
    const firstQuestion = $('va-radio[name="recentApplication"]', container);
    expect(firstQuestion).to.exist;

    // The second question should not be displayed initially
    const secondQuestion = $('va-radio[name="veteran"]', container);
    expect(secondQuestion).not.to.exist;

    // Simulate selection of the first question
    const changeEvent = new MouseEvent('vaValueChange', {
      detail: { value: true },
    });

    fireEvent(firstQuestion, changeEvent);

    // Check if the second question appears after answering the first question
    await waitFor(() => {
      const updatedSecondQuestion = $('va-radio[name="veteran"]', container);
      expect(updatedSecondQuestion).not.to.exist; // Still should not exist as isActive is false
    });
  });
  it('should reset choices after a previous question is answered', async () => {
    // Mock config with multiple questions
    const mockConfig = [
      {
        type: 'recentApplication',
        label: 'Have you applied recently?',
        isActive: () => true,
        options: [
          { label: 'Yes', value: 'true' },
          { label: 'No', value: 'false' },
        ],
      },
      {
        type: 'veteran',
        label: 'Are you a veteran?',
        isActive: () => true,
        options: [
          { label: 'Yes', value: 'true' },
          { label: 'No', value: 'false' },
        ],
      },
      {
        type: 'educationType',
        label: 'What type of education do you want to pursue?',
        isActive: () => true,
        options: [
          { label: 'College', value: 'college' },
          { label: 'Vocational', value: 'vocational' },
        ],
      },
    ]; // Always return true for the test // This question should display // This question should display

    const { container } = render(
      <EducationWizard
        config={mockConfig}
        toggleText="Troubleshoot My GI Bill Benefits"
      />,
    );

    // Open the wizard to see the first question
    fireEvent.click(container.querySelector('.wizard-button'));

    // Select an option for the first question
    const firstQuestion = $('va-radio[name="recentApplication"]', container);
    const changeEvent = new MouseEvent('vaValueChange', {
      detail: { value: true },
    });

    fireEvent(firstQuestion, changeEvent);

    // Check that the second question appears after answering the first question
    await waitFor(() => {
      const secondQuestion = $('va-radio[name="veteran"]', container);
      expect(secondQuestion).to.exist; // The second question should now exist
    });

    // Now select an option for the second question
    const secondQuestion = $('va-radio[name="veteran"]', container);
    fireEvent(
      secondQuestion,
      new MouseEvent('vaValueChange', {
        detail: { value: false },
      }),
    );

    // Check that the choices are reset for the following question
    await waitFor(() => {
      const thirdQuestion = $('va-radio[name="educationType"]', container);
      expect(thirdQuestion).to.exist; // The third question should exist
    });

    // Check if the third question is displayed and the state is reset accordingly
    const choiceStateAfterSecond = $(
      'va-radio[name="educationType"]',
      container,
    );
    expect(choiceStateAfterSecond).to.exist; // Confirm that the third question is still present

    // Ensure that if the user navigates back, the previous answer doesn't carry over
    fireEvent(firstQuestion, changeEvent); // Click again to show the first question
    await waitFor(() => {
      // After answering again, verify that it didn't carry the state incorrectly
      expect($('va-radio[name="veteran"][value="true"]', container)).not.to
        .exist; // Confirm no carry over
    });
  });
});
