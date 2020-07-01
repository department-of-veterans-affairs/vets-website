import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { expect } from 'chai';

import Profile2 from '../../components/Profile2Wrapper';
import getRoutes from '../../routes';

import { renderWithProfileReducers as render } from '../unit-test-helpers';

describe('Profile2', () => {
  it('should render the correct breadcrumb (Personal and contact Information)', () => {
    const ui = (
      <MemoryRouter initialEntries={['/profile/personal-information']}>
        <Profile2 routes={getRoutes()} />
      </MemoryRouter>
    );
    const { getByTestId } = render(ui);

    const breadcrumbs = getByTestId('breadcrumbs');

    expect(breadcrumbs.textContent.match(/personal and contact information/i))
      .not.to.be.null;
  });
});
