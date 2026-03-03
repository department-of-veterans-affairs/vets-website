import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import * as environment from 'platform/utilities/environment';
import { Eligible } from '../../../components/IntroStatusAlerts/Eligible';

describe('Eligible status alert', () => {
  let sandbox;
  let envStub;

  const defaultProps = {
    referenceNumber: '18959346',
  };

  before(() => {
    sandbox = sinon.createSandbox();
    envStub = sandbox.stub(environment, 'default');
    envStub.value({ API_URL: 'https://dev-api.va.gov' });
  });

  after(() => {
    sandbox.restore();
  });

  it('renders the reference number and formatted request date', () => {
    const { getByText } = render(<Eligible {...defaultProps} />);
    const referenceNumber = `Reference Number: ${defaultProps.referenceNumber}`;
    expect(getByText(new RegExp(referenceNumber))).to.exist;
    expect(getByText(/You can download your COE now./)).to.exist;
  });

  it('renders the download link with correct href and attributes', () => {
    const { container } = render(<Eligible {...defaultProps} />);
    const link = container.querySelector('va-link');
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.equal(
      'https://dev-api.va.gov/v0/coe/download_coe',
    );
    expect(link.getAttribute('filetype')).to.equal('PDF');
    expect(link.hasAttribute('download')).to.be.true;
  });
});
