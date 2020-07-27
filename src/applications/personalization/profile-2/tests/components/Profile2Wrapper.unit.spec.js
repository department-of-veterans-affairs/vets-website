import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { expect } from 'chai';

import Profile2Wrapper from '../../components/Profile2Wrapper';
import getRoutes from '../../routes';
import { PROFILE_PATHS } from '../../constants';

import { renderWithProfileReducers as render } from '../unit-test-helpers';
import { Test } from 'mocha';

describe('Profile2Wrapper', () => {
  it('should render the correct breadcrumb (Personal and contact Information)', () => {
    const config = {};

    const initialState = {
      vaProfile: {
        hero: {
          fullUserName: {
            first: 'Test',
            last: 'Test',
          },
        },
      },
    };

    const ui = (
      <MemoryRouter initialEntries={[PROFILE_PATHS.PERSONAL_INFORMATION]}>
        <Profile2Wrapper routes={getRoutes(config)} />
      </MemoryRouter>
    );
    const { getByTestId } = render(ui, { initialState });

    const breadcrumbs = getByTestId('breadcrumbs');

    expect(breadcrumbs.textContent.match(/personal and contact information/i))
      .not.to.be.null;
  });
});
