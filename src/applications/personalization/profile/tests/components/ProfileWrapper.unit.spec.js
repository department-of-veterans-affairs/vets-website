import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { expect } from 'chai';

import ProfileWrapper from '../../components/ProfileWrapper';
import getRoutes from '../../routes';
import { PROFILE_PATHS } from '../../constants';

import { renderWithProfileReducers as render } from '../unit-test-helpers';

describe('ProfileWrapper', () => {
  const config = {};
  const ui = (
    <MemoryRouter initialEntries={[PROFILE_PATHS.PERSONAL_INFORMATION]}>
      <ProfileWrapper routes={getRoutes(config)} />
    </MemoryRouter>
  );

  it('should render the correct breadcrumb (Personal and contact Information)', () => {
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
    const { getByTestId } = render(ui, { initialState });
    const breadcrumbs = getByTestId('breadcrumbs');
    expect(breadcrumbs.textContent.match(/Personal and contact information/i))
      .not.to.be.null;
  });

  it('should render ProfileHeader when the full name of the user was fetched)', () => {
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
    const { getByTestId } = render(ui, { initialState });
    const profileHeader = getByTestId('profile-header');
    expect(profileHeader.textContent.match(/Test Test/i)).not.to.be.null;
  });

  it('should not render ProfileHeader when the full name of the user could not be fetched)', () => {
    const initialState = {
      vaProfile: {
        hero: {
          errors: ['This is an error'],
        },
      },
    };
    const { queryByTestId } = render(ui, { initialState });
    const profileHeader = queryByTestId('profile-header');
    expect(profileHeader).to.be.null;
  });
});
