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
});
