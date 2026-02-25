import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { cleanup } from '@testing-library/react';
import * as featureToggles from 'platform/utilities/feature-toggles';

import { ProfileFullWidthContainer } from '../../components/ProfileFullWidthContainer';
import { renderWithProfileReducersAndRouter as render } from '../unit-test-helpers';

describe('ProfileFullWidthContainer', () => {
  const sandbox = sinon.createSandbox();
  let useToggleValueStub;
  let useFeatureToggleStub;

  beforeEach(() => {
    useToggleValueStub = sandbox.stub().returns(false);
    useFeatureToggleStub = sandbox.stub(featureToggles, 'useFeatureToggle');
    useFeatureToggleStub.returns({
      useToggleValue: useToggleValueStub,
      TOGGLE_NAMES: {
        profileHealthCareSettingsPage: 'profileHealthCareSettingsPage',
        profileHideHealthCareContacts: 'profileHideHealthCareContacts',
      },
    });
  });

  afterEach(() => {
    sandbox.restore();
    cleanup();
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      profile2Enabled: true,
      breadcrumbs: true,
    };
    return render(
      <ProfileFullWidthContainer {...defaultProps} {...props}>
        <div data-testid="child-content">Child content</div>
      </ProfileFullWidthContainer>,
    );
  };

  it('renders children', () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId('child-content')).to.exist;
  });

  it('renders the grid container', () => {
    const { container } = renderComponent();
    expect(container.querySelector('.vads-l-grid-container')).to.exist;
  });

  it('renders ProfileBreadcrumbs when profile2Enabled and breadcrumbs are both true', () => {
    const { container } = renderComponent({
      profile2Enabled: true,
      breadcrumbs: true,
    });
    // ProfileBreadcrumbs renders a va-breadcrumbs element
    const breadcrumbs = container.querySelector('va-breadcrumbs');
    expect(breadcrumbs).to.exist;
  });

  it('does not render ProfileBreadcrumbs when breadcrumbs is false', () => {
    const { container } = renderComponent({
      profile2Enabled: true,
      breadcrumbs: false,
    });
    expect(container.querySelector('va-breadcrumbs')).to.not.exist;
  });

  it('does not render ProfileBreadcrumbs when profile2Enabled is false', () => {
    const { container } = renderComponent({
      profile2Enabled: false,
      breadcrumbs: true,
    });
    expect(container.querySelector('va-breadcrumbs')).to.not.exist;
  });
});
