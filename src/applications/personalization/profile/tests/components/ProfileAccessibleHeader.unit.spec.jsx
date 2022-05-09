import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import ProfileAccessibleHeader from '@@profile/components/ProfileAccessibleHeader';
import {
  PROFILE_PATHS,
  PROFILE_PATHS_LGBTQ_ENHANCEMENT,
} from '../../constants';
import getRoutes from '../../routes';

describe('ProfileAccessibleHeader', () => {
  it('should render Personal and contact information heading for when profile enhancement toggle is false', () => {
    const routes = getRoutes({});
    const ui = (
      <MemoryRouter initialEntries={[PROFILE_PATHS.PERSONAL_INFORMATION]}>
        <ProfileAccessibleHeader routes={routes} />
      </MemoryRouter>
    );

    const screen = render(ui);

    expect(routes[0].name).to.equal('Personal and contact information');
    expect(screen.getByRole('heading').textContent).to.equal(routes[0].name);
  });

  it('should render "Personal Information" heading for when profile enhancement toggle is true', () => {
    const routes = getRoutes({ shouldShowProfileLGBTQEnhancements: true });
    const ui = (
      <MemoryRouter initialEntries={[PROFILE_PATHS.PERSONAL_INFORMATION]}>
        <ProfileAccessibleHeader routes={routes} />
      </MemoryRouter>
    );

    const screen = render(ui);

    expect(routes[0].name).to.equal('Personal information');
    expect(screen.getByRole('heading').textContent).to.equal(routes[0].name);
  });

  it('should render "Contact information" heading for when profile enhancement toggle is true', () => {
    const routes = getRoutes({ shouldShowProfileLGBTQEnhancements: true });
    const ui = (
      <MemoryRouter
        initialEntries={[PROFILE_PATHS_LGBTQ_ENHANCEMENT.CONTACT_INFORMATION]}
      >
        <ProfileAccessibleHeader routes={routes} />
      </MemoryRouter>
    );

    const screen = render(ui);

    expect(routes[1].name).to.equal('Contact information');
    expect(screen.getByRole('heading').textContent).to.equal(routes[1].name);
  });
});
