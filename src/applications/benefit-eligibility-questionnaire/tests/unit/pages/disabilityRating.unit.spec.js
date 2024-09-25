import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import disabilityRatingConfig from '../../../pages/disabilityRating';

describe('Disability Rating Form Page', () => {
  let wrapper;

  const setupForm = () =>
    render(
      <DefinitionTester
        schema={disabilityRatingConfig.schema}
        uiSchema={disabilityRatingConfig.uiSchema}
        data={{}}
      />,
    );

  beforeEach(() => {
    wrapper = setupForm();
  });

  afterEach(() => {
    wrapper && wrapper.unmount();
  });

  it('should render the correct title for disabilityRating', () => {
    const title = wrapper.getByText('Do you have a VA disability rating?');
    expect(title).to.exist;
  });

  it('should render the correct radio options for disabilityRating', () => {
    const radioOptions = [
      "I've applied and received a disability rating",
      "I've submitted but haven't received a rating yet",
      "I've started the process but haven't submitted yet",
      "I haven't applied for a disability rating",
    ];

    radioOptions.forEach(option => {
      const radioOption = wrapper.getByLabelText(option);
      expect(radioOption).to.exist;
    });
  });

  it('should render the correct link in view:disabilityEligibility description', () => {
    const link = wrapper.getByText('Learn more about disability ratings.');
    expect(link).to.exist;
    expect(link.closest('a')).to.have.attribute(
      'href',
      'https://www.va.gov/disability/eligibility',
    );
  });
});
