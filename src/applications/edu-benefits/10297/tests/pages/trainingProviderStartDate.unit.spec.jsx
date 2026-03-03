import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import { schema, uiSchema } from '../../pages/trainingProviderStartDate';

/* freeze “today” for deterministic tests */
const TODAY = new Date('2025-01-01T12:00:00Z');

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

describe('Training provider start date page', () => {
  let clock;
  beforeEach(() => {
    clock = sinon.useFakeTimers({ now: TODAY.getTime(), toFake: ['Date'] });
  });
  afterEach(() => clock.restore());

  it('renders the title, label, and static note', () => {
    const { getByText, container } = renderPage();

    expect(
      getByText(
        'Do you have a start date for the program you wish to enroll in?',
      ),
    ).to.exist;

    const dateField = container.querySelector('va-memorable-date');
    expect(dateField).to.exist;
  });

  it('shows a validation error when the month is invalid', async () => {
    const { getByRole, container } = renderPage({
      plannedStartDate: '2025-13-01',
    });

    await userEvent.click(getByRole('button', { name: /submit|continue/i }));

    expect(container.querySelector('va-memorable-date')).to.have.attribute(
      'error',
      'Please enter a valid date',
    );
  });

  it('shows a validation error when the day is invalid', async () => {
    const { getByRole, container } = renderPage({
      plannedStartDate: '2025-12-32',
    });

    await userEvent.click(getByRole('button', { name: /submit|continue/i }));

    expect(container.querySelector('va-memorable-date')).to.have.attribute(
      'error',
      'Please enter a valid date',
    );
  });

  it('shows a validation error when the year is invalid', async () => {
    const { getByRole, container } = renderPage({
      plannedStartDate: '3000-12-31',
    });

    await userEvent.click(getByRole('button', { name: /submit|continue/i }));

    expect(container.querySelector('va-memorable-date')).to.have.attribute(
      'error',
      'Please enter a valid date',
    );
  });

  it('shows a validation error when date is not on or after July 1, 2026', async () => {
    const { getByRole, container } = renderPage({
      plannedStartDate: '2025-06-30',
    });

    await userEvent.click(getByRole('button', { name: /submit|continue/i }));

    expect(container.querySelector('va-memorable-date')).to.have.attribute(
      'error',
      'Enter a date on or after July 1, 2026',
    );
  });
});
