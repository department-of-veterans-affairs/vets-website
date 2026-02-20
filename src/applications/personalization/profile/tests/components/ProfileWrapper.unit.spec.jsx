import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import { cleanup } from '@testing-library/react';
import * as featureToggles from 'platform/utilities/feature-toggles';

import ProfileWrapper from '../../components/ProfileWrapper';
import getRoutes from '../../routes';
import { PROFILE_PATHS } from '../../constants';

import { renderWithProfileReducers as render } from '../unit-test-helpers';

describe('ProfileWrapper', () => {
  const sandbox = sinon.createSandbox();
  const config = {};

  beforeEach(() => {
    sandbox.stub(featureToggles, 'useFeatureToggle').returns({
      useToggleValue: sandbox.stub().returns(false),
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

  const uiLOA3 = (
    <MemoryRouter initialEntries={[PROFILE_PATHS.PERSONAL_INFORMATION]}>
      <ProfileWrapper routes={getRoutes(config)} isLOA3 />
    </MemoryRouter>
  );

  it('should render NameTag when the full name of the user was fetched)', () => {
    const initialState = {
      vaProfile: {
        hero: {
          userFullName: {
            first: 'Test',
            last: 'Test',
          },
        },
      },
    };
    const { getByTestId } = render(uiLOA3, { initialState });

    const NameTag = getByTestId('name-tag');
    expect(NameTag.textContent.match(/Test Test/i)).not.to.be.null;
  });

  it('should not render NameTag when the full name of the user could not be fetched)', () => {
    const initialState = {
      vaProfile: {
        hero: {
          errors: ['This is an error'],
        },
      },
    };
    const { queryByTestId } = render(uiLOA3, { initialState });
    const NameTag = queryByTestId('name-tag');
    expect(NameTag).to.be.null;
  });

  it('should not render NameTag when the user is LOA1)', () => {
    const uiLOA1 = (
      <MemoryRouter initialEntries={[PROFILE_PATHS.PERSONAL_INFORMATION]}>
        <ProfileWrapper routes={getRoutes(config)} />
      </MemoryRouter>
    );

    const initialState = {
      vaProfile: {
        hero: {
          errors: ['This is an error'],
        },
      },
    };
    const { queryByTestId } = render(uiLOA1, { initialState });
    const NameTag = queryByTestId('name-tag');
    expect(NameTag).to.not.exist;
  });

  it('uses full-width-and-breadcrumbs layout for profile root path', () => {
    const ui = (
      <MemoryRouter initialEntries={[PROFILE_PATHS.PROFILE_ROOT]}>
        <ProfileWrapper routes={getRoutes(config)} isLOA3>
          <div data-testid="child">Content</div>
        </ProfileWrapper>
      </MemoryRouter>
    );
    const { getByTestId, container } = render(ui);
    expect(getByTestId('child')).to.exist;
    // Should not render the sidebar layout nav
    expect(container.querySelector('.va-subnav')).to.not.exist;
  });

  it('uses full-width layout for edit path', () => {
    const ui = (
      <MemoryRouter initialEntries={[PROFILE_PATHS.EDIT]}>
        <ProfileWrapper routes={getRoutes(config)} isLOA3>
          <div data-testid="child">Edit Content</div>
        </ProfileWrapper>
      </MemoryRouter>
    );
    const { getByTestId, container } = render(ui);
    expect(getByTestId('child')).to.exist;
    // Should not render the sidebar layout nav
    expect(container.querySelector('.va-subnav')).to.not.exist;
  });

  it('wraps content in InitializeVAPServiceID for LOA3 users in MVI', () => {
    const ui = (
      <MemoryRouter initialEntries={[PROFILE_PATHS.PERSONAL_INFORMATION]}>
        <ProfileWrapper routes={getRoutes(config)} isLOA3 isInMVI>
          <div data-testid="child">Content</div>
        </ProfileWrapper>
      </MemoryRouter>
    );
    const { getByTestId } = render(ui);
    expect(getByTestId('child')).to.exist;
  });
});
