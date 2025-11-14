import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { MemoryRouter } from 'react-router-dom';
import { render, fireEvent } from '@testing-library/react';

import AdditionalReportsInfo from '../../../components/shared/AdditionalReportsInfo';
import * as helpers from '../../../util/helpers';

describe('AdditionalReportsInfo', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders va-additional-info with correct trigger and data-dd-action-name', () => {
    const domainName = 'lab and test results';
    const { container } = render(
      <MemoryRouter>
        <AdditionalReportsInfo domainName={domainName} />
      </MemoryRouter>,
    );

    const triggerText = `How to find more ${domainName}`;
    const additionalInfoEl = container.querySelector('va-additional-info');
    expect(additionalInfoEl).to.exist;
    expect(additionalInfoEl.getAttribute('trigger')).to.equal(triggerText);
    expect(additionalInfoEl.getAttribute('data-dd-action-name')).to.equal(
      triggerText,
    );
  });

  it('renders explanatory paragraphs and download link with correct href', () => {
    const { getByText } = render(
      <MemoryRouter>
        <AdditionalReportsInfo domainName="lab and test results" />
      </MemoryRouter>,
    );

    // Paragraph content
    expect(
      getByText(/If you need more results, you can download full reports/i),
    ).to.exist;

    // Link
    const link = getByText(/Find medical records reports to download/i);
    expect(link.tagName).to.equal('A');
    expect(link.getAttribute('href')).to.equal('/download');
  });

  it('fires sendDataDogAction when download link is clicked', () => {
    const actionStub = sandbox.stub(helpers, 'sendDataDogAction');
    const { getByText } = render(
      <MemoryRouter>
        <AdditionalReportsInfo domainName="lab and test results" />
      </MemoryRouter>,
    );

    const link = getByText(/Find medical records reports to download/i);
    fireEvent.click(link);

    expect(actionStub.calledOnce).to.be.true;
    expect(actionStub.firstCall.args[0]).to.equal(
      'Download medical records reports link',
    );
  });
});
