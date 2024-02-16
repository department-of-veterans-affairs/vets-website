import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '../mocks/setup';
import Breadcrumbs from '../../components/Breadcrumbs';

describe('VAOS <Breadcrumbs>', () => {
  it('should display new text within the breadcrumb', () => {
    const initialState = {
      featureToggles: { vaOnlineSchedulingBreadcrumbUrlUpdate: true },
    }; // eslint-disable-next-line camelcase

    const screen = renderWithStoreAndRouter(
      <Breadcrumbs>
        <a href="https://www.va.gov/">test</a>
      </Breadcrumbs>,
      { initialState },
    );

    expect(screen.getByText(/VA.gov home/i)).to.be.ok;
    expect(screen.getByText(/My HealtheVet/i)).to.be.ok;
    expect(screen.getByRole('link', { name: 'Appointments' })).to.be.ok;
    expect(screen.getByText(/test/i)).to.be.ok;
  });
});
