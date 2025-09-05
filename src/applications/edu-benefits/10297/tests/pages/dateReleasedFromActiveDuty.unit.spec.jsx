import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import dateReleasedFromActiveDuty from '../../pages/dateReleasedFromActiveDuty';

const { schema, uiSchema } = dateReleasedFromActiveDuty;

const DAY = 86_400_000;
const pad = n => String(n).padStart(2, '0');
const ymd = d =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const addDays = (d, n) => new Date(d.getTime() + n * DAY);

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

    expect(getByText('Your active duty release date')).to.exist;

    const dateField = container.querySelector(
      'va-memorable-date[label^="Please provide the date"]',
    );
    expect(dateField).to.exist;

    expect(getByText(/when we review your application, we may ask/i)).to.exist;
  });

  it('shows a validation error when the date is omitted', () => {
    const { getByRole, container } = renderPage();

    fireEvent.click(getByRole('button', { name: /submit|continue/i }));

    const errNode = container.querySelector('[error]');
    expect(errNode).to.exist;
    expect(errNode.getAttribute('error')).to.contain('Please enter a date');
  });

  it('rejects a past date', () => {
    const pastDate = ymd(addDays(TODAY, -1));
    const { getByRole, container } = renderPage({
      dateReleasedFromActiveDuty: pastDate,
    });

    fireEvent.click(getByRole('button', { name: /submit|continue/i }));

    const errNode = container.querySelector('[error]');
    expect(errNode).to.exist;
    expect(errNode.getAttribute('error')).to.match(/past/i);
  });

  it('rejects a date more than 180 days in the future', () => {
    const tooFar = ymd(addDays(TODAY, 181));
    const { getByRole, container } = renderPage({
      dateReleasedFromActiveDuty: tooFar,
    });

    fireEvent.click(getByRole('button', { name: /submit|continue/i }));

    const errNode = container.querySelector('[error]');
    expect(errNode).to.exist;
    expect(errNode.getAttribute('error')).to.match(/180 days away/i);
  });

  it('submits successfully with a date exactly 180 days ahead', () => {
    const okDate = ymd(addDays(TODAY, 180));
    const onSubmit = sinon.spy();

    const { getByRole, container } = renderPage(
      { dateReleasedFromActiveDuty: okDate },
      onSubmit,
    );

    fireEvent.click(getByRole('button', { name: /submit|continue/i }));

    expect(container.querySelector('[error]')).to.be.null;
    expect(onSubmit.calledOnce).to.be.true;
    expect(
      onSubmit.firstCall.args[0].formData.dateReleasedFromActiveDuty,
    ).to.equal(okDate);
  });
});
