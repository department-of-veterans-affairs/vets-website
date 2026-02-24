import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import dateReleasedFromActiveDuty from '../../pages/dateReleasedFromActiveDuty';

const { schema, uiSchema } = dateReleasedFromActiveDuty;

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

describe('Date released from active duty page', () => {
  let clock;
  beforeEach(() => {
    clock = sinon.useFakeTimers({ now: TODAY.getTime(), toFake: ['Date'] });
  });
  afterEach(() => clock.restore());

  it('renders the title, label, and static note', () => {
    const { getByText, container } = renderPage();

    expect(getByText('Active duty status release date')).to.exist;

    const dateField = container.querySelector(
      '[name="root_dateReleasedFromActiveDuty"]',
    );
    expect(dateField).to.exist;

    expect(
      getByText(/If you are a transitioning service member on terminal leave/i),
    ).to.exist;
  });

  it('shows a validation error when the date is omitted', async () => {
    const { getByRole, container } = renderPage();

    await userEvent.click(getByRole('button', { name: /submit|continue/i }));

    expect(container.querySelector('va-memorable-date')).to.have.attribute(
      'error',
      'You must provide an answer',
    );
  });

  it('shows a validation error when the month is invalid', async () => {
    const { getByRole, container } = renderPage({
      dateReleasedFromActiveDuty: '2025-13-01',
    });

    await userEvent.click(getByRole('button', { name: /submit|continue/i }));

    expect(container.querySelector('va-memorable-date')).to.have.attribute(
      'error',
      'Please enter a valid date',
    );
  });

  it('shows a validation error when the day is invalid', async () => {
    const { getByRole, container } = renderPage({
      dateReleasedFromActiveDuty: '2025-12-32',
    });

    await userEvent.click(getByRole('button', { name: /submit|continue/i }));

    expect(container.querySelector('va-memorable-date')).to.have.attribute(
      'error',
      'Please enter a valid date',
    );
  });

  it('shows a validation error when the year is invalid', async () => {
    const { getByRole, container } = renderPage({
      dateReleasedFromActiveDuty: '1890-12-31',
    });

    await userEvent.click(getByRole('button', { name: /submit|continue/i }));

    expect(container.querySelector('va-memorable-date')).to.have.attribute(
      'error',
      'Please enter a valid date',
    );
  });
});
