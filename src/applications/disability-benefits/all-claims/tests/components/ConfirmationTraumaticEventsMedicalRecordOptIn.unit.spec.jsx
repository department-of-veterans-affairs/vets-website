import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ConfirmationTraumaticEventsMedicalRecordOptIn from '../../components/confirmationFields/ConfirmationTraumaticEventsMedicalRecordOptIn';
import {
  TRAUMATIC_EVENTS_MEDICAL_RECORD_OPT_IN_TITLE,
  TRAUMATIC_EVENTS_MEDICAL_RECORD_OPT_IN_SECTION_TITLE,
} from '../../constants';
import { CONSENT_OPTION_INDICATOR_CHOICES } from '../../content/form0781/consentPage';

describe('ConfirmationTraumaticEventsMedicalRecordOptIn', () => {
  it('should render correctly when optionIndicator is "yes"', () => {
    const formData = {
      optionIndicator: 'yes',
    };
    const { container, getByText } = render(
      <ConfirmationTraumaticEventsMedicalRecordOptIn formData={formData} />,
    );

    expect(container.querySelectorAll('h4')).to.have.length(1);
    expect(getByText(TRAUMATIC_EVENTS_MEDICAL_RECORD_OPT_IN_SECTION_TITLE)).to
      .exist;
    expect(getByText(TRAUMATIC_EVENTS_MEDICAL_RECORD_OPT_IN_TITLE)).to.exist;
    expect(getByText(CONSENT_OPTION_INDICATOR_CHOICES.yes)).to.exist;
  });

  it('should render correctly when optionIndicator is "no"', () => {
    const formData = {
      optionIndicator: 'no',
    };
    const { container, getByText } = render(
      <ConfirmationTraumaticEventsMedicalRecordOptIn formData={formData} />,
    );

    expect(container.querySelectorAll('h4')).to.have.length(1);
    expect(getByText(TRAUMATIC_EVENTS_MEDICAL_RECORD_OPT_IN_SECTION_TITLE)).to
      .exist;
    expect(getByText(TRAUMATIC_EVENTS_MEDICAL_RECORD_OPT_IN_TITLE)).to.exist;
    expect(getByText(CONSENT_OPTION_INDICATOR_CHOICES.no)).to.exist;
  });

  it('should render correctly when optionIndicator is "revoke"', () => {
    const formData = {
      optionIndicator: 'revoke',
    };
    const { container, getByText } = render(
      <ConfirmationTraumaticEventsMedicalRecordOptIn formData={formData} />,
    );

    expect(container.querySelectorAll('h4')).to.have.length(1);
    expect(getByText(TRAUMATIC_EVENTS_MEDICAL_RECORD_OPT_IN_SECTION_TITLE)).to
      .exist;
    expect(getByText(TRAUMATIC_EVENTS_MEDICAL_RECORD_OPT_IN_TITLE)).to.exist;
    expect(getByText(CONSENT_OPTION_INDICATOR_CHOICES.revoke)).to.exist;
  });

  it('should render correctly when optionIndicator is "notEnrolled"', () => {
    const formData = {
      optionIndicator: 'notEnrolled',
    };
    const { container, getByText } = render(
      <ConfirmationTraumaticEventsMedicalRecordOptIn formData={formData} />,
    );

    expect(container.querySelectorAll('h4')).to.have.length(1);
    expect(getByText(TRAUMATIC_EVENTS_MEDICAL_RECORD_OPT_IN_SECTION_TITLE)).to
      .exist;
    expect(getByText(TRAUMATIC_EVENTS_MEDICAL_RECORD_OPT_IN_TITLE)).to.exist;
    expect(getByText(CONSENT_OPTION_INDICATOR_CHOICES.notEnrolled)).to.exist;
  });

  it('should not render when optionIndicator is not provided', () => {
    const formData = {};
    const { container } = render(
      <ConfirmationTraumaticEventsMedicalRecordOptIn formData={formData} />,
    );

    expect(container.children).to.have.length(0);
  });

  it('should not render when optionIndicator is null', () => {
    const formData = {
      optionIndicator: null,
    };
    const { container } = render(
      <ConfirmationTraumaticEventsMedicalRecordOptIn formData={formData} />,
    );

    expect(container.children).to.have.length(0);
  });

  it('should not render when optionIndicator is undefined', () => {
    const formData = {
      optionIndicator: undefined,
    };
    const { container } = render(
      <ConfirmationTraumaticEventsMedicalRecordOptIn formData={formData} />,
    );

    expect(container.children).to.have.length(0);
  });
});
