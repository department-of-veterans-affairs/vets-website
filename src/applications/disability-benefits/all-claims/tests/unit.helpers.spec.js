import React from 'react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';

/**
 * Helper to verify a page submits or does not submit successfully based on given form data
 *
 * @param {object} schemaDefinition - page schema
 * @param {object} formData - form data for the page
 * @param {boolean} isSuccessfulSubmit - true if the submit should be successful, false otherwise
 */
export function pageSubmitTest(schemaDefinition, formData, isSuccessfulSubmit) {
  const onSubmit = sinon.spy();
  const { getByText } = render(
    <DefinitionTester
      schema={schemaDefinition?.schema}
      uiSchema={schemaDefinition?.uiSchema}
      data={formData}
      onSubmit={onSubmit}
    />,
  );

  userEvent.click(getByText('Submit'));

  if (isSuccessfulSubmit) {
    expect(onSubmit.calledOnce).to.be.true;
  } else {
    expect(onSubmit.calledOnce).to.be.false;
  }
}
