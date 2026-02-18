import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon-v20';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import VaPrompt from '../../../components/evidence/VaPrompt';
import { HAS_VA_EVIDENCE } from '../../../constants';

const vaPromptError = 'Select if we should get your VA medical records';

describe('VaPrompt', () => {
  const renderContainer = (props = {}) => {
    const defaultProps = {
      data: {},
      goBack: () => {},
      goForward: () => {},
      setFormData: () => {},
      ...props,
    };

    return render(<VaPrompt {...defaultProps} />);
  };

  it('should render', () => {
    const { container } = renderContainer();

    expect($('va-radio', container)).to.exist;
    expect($$('va-button', container).length).to.eq(2);
  });

  it('should submit page with error (required question)', () => {
    const goSpy = sinon.spy();
    const { container } = renderContainer({ goForward: goSpy });

    fireEvent.click($('va-button[continue]', container));
    const radio = $('va-radio', container);
    expect(radio.getAttribute('error')).to.eq(vaPromptError);
    expect(goSpy.called).to.be.false;
  });

  it('should submit page', () => {
    const goSpy = sinon.spy();
    const data = { [HAS_VA_EVIDENCE]: true };
    const { container } = renderContainer({ data, goForward: goSpy });

    fireEvent.click($('va-button[continue]', container));
    const radio = $('va-radio', container);
    expect(radio.getAttribute('error')).to.be.null;
    expect(goSpy.called).to.be.true;
  });

  it('should submit page with "No" selected', () => {
    const goSpy = sinon.spy();
    const data = { [HAS_VA_EVIDENCE]: false };
    const { container } = renderContainer({ data, goForward: goSpy });

    fireEvent.click($('va-button[continue]', container));
    const radio = $('va-radio', container);
    expect(radio.getAttribute('error')).to.be.null;
    expect(goSpy.called).to.be.true;
  });

  it('should allow setting va-radio-option to "No"', () => {
    const setFormDataSpy = sinon.spy();
    const data = { [HAS_VA_EVIDENCE]: true };
    const { container } = renderContainer({
      data,
      setFormData: setFormDataSpy,
    });
    const changeEvent = new CustomEvent('vaValueChange', {
      detail: { value: 'n' },
    });

    fireEvent($('va-radio', container), changeEvent);
    expect(setFormDataSpy.calledWith({ [HAS_VA_EVIDENCE]: false })).to.be.true;
  });

  it('should allow setting va-radio-option to "Yes"', () => {
    const setFormDataSpy = sinon.spy();
    const data = { [HAS_VA_EVIDENCE]: false };
    const { container } = renderContainer({
      data,
      setFormData: setFormDataSpy,
    });
    const changeEvent = new CustomEvent('vaValueChange', {
      detail: { value: 'y' },
    });

    fireEvent($('va-radio', container), changeEvent);
    expect(setFormDataSpy.calledWith({ [HAS_VA_EVIDENCE]: true })).to.be.true;
  });

  it('should call goBack', () => {
    const goSpy = sinon.spy();
    const data = { [HAS_VA_EVIDENCE]: false };
    const { container } = renderContainer({ data, goBack: goSpy });

    fireEvent.click($('va-button[back]', container));
    expect(goSpy.called).to.be.true;
  });

  it('should render form description content', () => {
    const { container } = renderContainer();

    const description = $('[slot="form-description"]', container);
    expect(description).to.exist;
    expect(description.textContent).to.include('VA medical center');
    expect(description.textContent).to.include(
      'Community-based outpatient clinic',
    );
    expect(description.textContent).to.include(
      'Department of Defense military treatment facility',
    );
  });

  it('should add error-bolding class to description when error exists', () => {
    const goSpy = sinon.spy();
    const { container } = renderContainer({ goForward: goSpy });

    fireEvent.click($('va-button[continue]', container));
    const description = $('[slot="form-description"]', container);
    expect(description.className).to.include('error-bolding');
  });

  it('should not have error-bolding class when no error', () => {
    const { container } = renderContainer();

    const description = $('[slot="form-description"]', container);
    expect(description.className).to.not.include('error-bolding');
  });

  it('should clear error when option is selected after validation error', () => {
    const goSpy = sinon.spy();
    const setFormDataSpy = sinon.spy();
    const { container } = renderContainer({
      goForward: goSpy,
      setFormData: setFormDataSpy,
    });

    // Trigger error
    fireEvent.click($('va-button[continue]', container));
    let radio = $('va-radio', container);
    expect(radio.getAttribute('error')).to.eq(vaPromptError);

    // Select option
    const changeEvent = new CustomEvent('vaValueChange', {
      detail: { value: 'y' },
    });
    fireEvent($('va-radio', container), changeEvent);

    // Error should be cleared
    radio = $('va-radio', container);
    expect(radio.getAttribute('error')).to.be.null;
  });
});
