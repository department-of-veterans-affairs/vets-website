import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import causePage, { causeOptions } from '../../../pages/shared/cause';
import formConfig from '../../../config/form';

const mountPage = (data = {}, onSubmit = () => {}) =>
  render(
    <DefinitionTester
      definitions={formConfig.defaultDefinitions}
      schema={causePage.schema}
      uiSchema={causePage.uiSchema}
      data={data}
      onSubmit={onSubmit}
    />,
  );

describe('526 cause shared page', () => {
  afterEach(() => {
    cleanup();
  });

  it('shows an <h3> “Condition” heading', () => {
    const { container } = mountPage();

    const heading = container.querySelector('h3');

    expect(heading).to.exist;
    expect(heading.textContent).to.equal('Condition');
  });

  it('renders one radio for every option', () => {
    const { container } = mountPage();
    const options = container.querySelectorAll('va-radio-option');

    expect(options.length).to.equal(Object.keys(causeOptions).length);
  });

  it('shows the saved value when formData already has cause', () => {
    const { container } = mountPage({ cause: 'VA' });
    const selected = container.querySelector('va-radio-option[checked="true"]');

    expect(selected).to.have.attribute('value', 'VA');
  });

  it('flags an invalid value after submit attempt', async () => {
    const { container, getByRole } = mountPage({ cause: 'FOO' });

    fireEvent.click(getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      const radio = container.querySelector('va-radio');
      expect(radio).to.have.attribute(
        'error',
        'You must select a valid option',
      );
    });
  });

  it('blocks navigation when nothing is selected', async () => {
    const { getByRole, container } = mountPage();
    fireEvent.click(getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      const radio = container.querySelector('va-radio');
      expect(radio).to.have.attribute('error', 'You must provide a response');
    });
  });

  it('submits once a valid choice is present', async () => {
    const onSubmit = sinon.spy();
    const { getByRole } = mountPage({ cause: 'NEW' }, onSubmit);

    fireEvent.click(getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(onSubmit.called).to.be.true);
  });
});
