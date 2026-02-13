import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
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

  // it('shows a validation error when the date is omitted', () => {
  //   const { getByRole, container } = renderPage();

  //   fireEvent.click(getByRole('button', { name: /submit|continue/i }));

  //   const errNode = container.querySelector(
  //     '[id="root_dateReleasedFromActiveDuty-error-message"]',
  //   );
  //   expect(errNode).to.exist;
  //   expect(errNode.textContent).to.equal('Error Please enter a date');
  // });
});
