import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '../mocks/setup';
import Breadcrumbs from '../../components/Breadcrumbs';

describe('VAOS <Breadcrumbs>', () => {
  it('should display the text within the breadcrumb', () => {
    const initialState = {};

    const screen = renderWithStoreAndRouter(
      <Breadcrumbs>
        <a>test</a>
      </Breadcrumbs>,
      { initialState },
    );

    expect(screen.getByText(/Health care/i)).to.be.ok;
    expect(screen.getByText(/Schedule and manage health appointments/i)).to.be
      .ok;
    expect(screen.getByText(/VA online scheduling/i)).to.be.ok;
    expect(screen.getByText(/test/i)).to.be.ok;
  });
});
