import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { cleanup, waitFor } from '@testing-library/react';
import * as featureToggles from 'platform/utilities/feature-toggles';

import FinancialInformation from '../../components/FinancialInformation';
import { PROFILE_PATH_NAMES } from '../../constants';
import { renderWithProfileReducersAndRouter as render } from '../unit-test-helpers';

describe('FinancialInformation', () => {
  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    sandbox.stub(featureToggles, 'useFeatureToggle').returns({
      useToggleValue: sandbox.stub().returns(false),
      TOGGLE_NAMES: {},
    });
  });

  afterEach(() => {
    sandbox.restore();
    cleanup();
  });

  it('renders the page header', () => {
    const { getByText } = render(<FinancialInformation />);
    expect(getByText('Financial information')).to.exist;
  });

  it('renders the Direct deposit link', () => {
    const { container } = render(<FinancialInformation />);
    const link = container.querySelector(
      `va-link[text="${PROFILE_PATH_NAMES.DIRECT_DEPOSIT}"]`,
    );
    expect(link).to.exist;
  });

  it('renders the Payment history link', () => {
    const { container } = render(<FinancialInformation />);
    const link = container.querySelector('va-link[text="Payment history"]');
    expect(link).to.exist;
  });

  it('renders the Overpayments and copay bills link', () => {
    const { container } = render(<FinancialInformation />);
    const link = container.querySelector(
      'va-link[text="Overpayments and copay bills"]',
    );
    expect(link).to.exist;
  });

  it('sets the document title', async () => {
    render(<FinancialInformation />);
    await waitFor(() => {
      expect(document.title).to.include('Financial information');
    });
  });
});
