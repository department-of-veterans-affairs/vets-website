import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '../mocks/setup';
import Breadcrumbs from '../../components/Breadcrumbs';

describe('VAOS <Breadcrumbs>', () => {
  it('should display the text within the breadcrumb', () => {
    const initialState = {};

    const screen = renderWithStoreAndRouter(
      <Breadcrumbs>
        <a href="https://www.va.gov/">test</a>
      </Breadcrumbs>,
      { initialState },
    );

    expect(screen.queryByTestId('vaos-healthcare-link')).to.exist;
    expect(screen.queryByTestId('vaos-home-link')).to.exist;

    expect(
      screen.queryByTestId('vaos-healthcare-link').getAttribute('text'),
    ).to.equal('Health care');
    expect(
      screen.queryByTestId('vaos-home-link').getAttribute('text'),
    ).to.equal('Schedule and manage health appointments');

    expect(screen.getByText(/VA online scheduling/i)).to.be.ok;
    expect(screen.getByText(/test/i)).to.be.ok;
  });
});
