import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { expect } from 'chai';

import ProfileWrapper from '../../components/ProfileWrapper';
import getRoutes from '../../routes';
import { PROFILE_PATHS } from '../../constants';

import { renderWithProfileReducers as render } from '../unit-test-helpers';

describe('ProfileWrapper', () => {
  const config = {};
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
});
