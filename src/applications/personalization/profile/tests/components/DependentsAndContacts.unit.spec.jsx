import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { cleanup } from '@testing-library/react';
import * as featureToggles from 'platform/utilities/feature-toggles';

import DependentsAndContacts from '../../components/DependentsAndContacts';
import { PROFILE_PATH_NAMES } from '../../constants';
import { renderWithProfileReducersAndRouter as render } from '../unit-test-helpers';

describe('DependentsAndContacts', () => {
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
    const { getByText } = render(<DependentsAndContacts />);
    expect(getByText('Dependents and contacts')).to.exist;
  });

  it('renders the Accredited representative link', () => {
    const { container } = render(<DependentsAndContacts />);
    const link = container.querySelector(
      `va-link[text="${PROFILE_PATH_NAMES.ACCREDITED_REPRESENTATIVE}"]`,
    );
    expect(link).to.exist;
  });

  it('renders the Dependents on file link', () => {
    const { container } = render(<DependentsAndContacts />);
    const link = container.querySelector('va-link[text="Dependents on file"]');
    expect(link).to.exist;
  });

  it('sets the document title', () => {
    render(<DependentsAndContacts />);
    expect(document.title).to.include('Dependents and contacts');
  });
});
