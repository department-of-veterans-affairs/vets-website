import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { cleanup } from '@testing-library/react';
import * as featureToggles from 'platform/utilities/feature-toggles';

import AccountSecurity from '../../components/AccountSecurity';
import { PROFILE_PATH_NAMES } from '../../constants';
import { renderWithProfileReducersAndRouter as render } from '../unit-test-helpers';

describe('AccountSecurity', () => {
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
    const { getByText } = render(<AccountSecurity />);
    expect(getByText('Account security')).to.exist;
  });

  it('renders the Connected applications link', () => {
    const { container } = render(<AccountSecurity />);
    const link = container.querySelector(
      `va-link[text="${PROFILE_PATH_NAMES.CONNECTED_APPLICATIONS}"]`,
    );
    expect(link).to.exist;
  });

  it('renders the Sign-in information link', () => {
    const { container } = render(<AccountSecurity />);
    const link = container.querySelector(
      `va-link[text="${PROFILE_PATH_NAMES.SIGNIN_INFORMATION}"]`,
    );
    expect(link).to.exist;
  });

  it('sets the document title', () => {
    render(<AccountSecurity />);
    expect(document.title).to.include('Account security');
  });
});
