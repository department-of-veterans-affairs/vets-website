import React from 'react';
import { expect } from 'chai';
import { createTestStore, renderWithStoreAndRouter } from '../mocks/setup';
import Breadcrumbs from '../../components/Breadcrumbs';

describe('VAOS <Breadcrumbs>', () => {
  it('should display the text within the breadcrumb', () => {
    const store = createTestStore({});

    const screen = renderWithStoreAndRouter(<Breadcrumbs />, {
      store,
    });
    expect(screen.getByText(/Health care/i)).to.be.ok;
    expect(screen.getByText(/Schedule and view appointments/i)).to.be.ok;
    expect(screen.getByText(/VA online scheduling/i)).to.be.ok;
  });
});
