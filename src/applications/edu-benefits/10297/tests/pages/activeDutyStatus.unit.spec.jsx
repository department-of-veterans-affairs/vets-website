import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import activeDutyStatus from '../../pages/activeDutyStatus';

const { schema, uiSchema } = activeDutyStatus;

const renderPage = (formData = {}, onSubmit = () => {}) =>
  render(
    <DefinitionTester
      schema={schema}
      uiSchema={uiSchema}
      data={formData}
      onSubmit={onSubmit}
      definitions={{}}
    />,
  );

describe('Active duty status during program page', () => {
  it('renders the title, info banner, and Yes/No radios', () => {
    const { getByText, container } = renderPage();

    expect(getByText('Active duty status during program')).to.exist;
    expect(getByText(/what to know if you’re on active duty/i)).to.exist;
    expect(getByText(/if you’re on active duty while enrolled in the program/i))
      .to.exist;

    const radioGroup = container.querySelector(
      'va-radio[name="root_activeDutyDuringHitechVets"]',
    );
    expect(radioGroup).to.exist;

    const options = container.querySelectorAll(
      'va-radio-option[name="root_activeDutyDuringHitechVets"]',
    );
    expect(options.length).to.equal(2);
  });

  // it('shows a required error when no option is selected', () => {
  //   const { getByRole, container } = renderPage();

  //   fireEvent.click(getByRole('button', { name: /submit|continue/i }));

  //   const errNode = container.querySelector('va-radio[error]');
  //   expect(errNode).to.exist;
  //   expect(errNode.getAttribute('error')).to.match(/select an option/i);
  // });

  it('submits successfully when "Yes" (true) is supplied', () => {
    const onSubmit = sinon.spy();
    const { getByRole, container } = renderPage(
      { activeDutyDuringHitechVets: true },
      onSubmit,
    );

    fireEvent.click(getByRole('button', { name: /submit|continue/i }));

    expect(container.querySelector('va-radio[error]')).to.be.null;
    expect(onSubmit.calledOnce).to.be.true;
    expect(onSubmit.firstCall.args[0].formData.activeDutyDuringHitechVets).to.be
      .true;
  });

  it('submits successfully when "No" (false) is supplied', () => {
    const onSubmit = sinon.spy();
    const { getByRole, container } = renderPage(
      { activeDutyDuringHitechVets: false },
      onSubmit,
    );

    fireEvent.click(getByRole('button', { name: /submit|continue/i }));

    expect(container.querySelector('va-radio[error]')).to.be.null;
    expect(onSubmit.calledOnce).to.be.true;
    expect(onSubmit.firstCall.args[0].formData.activeDutyDuringHitechVets).to.be
      .false;
  });
});
