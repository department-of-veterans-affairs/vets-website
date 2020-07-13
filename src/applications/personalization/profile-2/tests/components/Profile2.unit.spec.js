import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { expect } from 'chai';

import Profile2 from '../../components/Profile2Wrapper';
import getRoutes from '../../routes';
import { PROFILE_PATHS } from '../../constants';

import { renderWithProfileReducers as render } from '../unit-test-helpers';

describe('Profile2', () => {
  it('should render the correct breadcrumb (Personal and contact Information)', () => {
    const config = {};
    const ui = (
      <MemoryRouter initialEntries={[PROFILE_PATHS.PERSONAL_INFORMATION]}>
        <Profile2 routes={getRoutes(config)} />
      </MemoryRouter>
    );
    const { getByTestId } = render(ui);

    const breadcrumbs = getByTestId('breadcrumbs');

    expect(breadcrumbs.textContent.match(/personal and contact information/i))
      .not.to.be.null;
  });
});
