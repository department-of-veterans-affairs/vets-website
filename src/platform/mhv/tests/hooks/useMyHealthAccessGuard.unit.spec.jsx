import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/react';

import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { useMyHealthAccessGuard } from '../../hooks/useMyHealthAccessGuard';

const stateFn = ({ mhvAccountState = 'OK' } = {}) => ({
  user: {
    profile: {
      mhvAccountState,
    },
  },
});

const Component = () => {
  useMyHealthAccessGuard();
  return <h1>Health Tool</h1>;
};

const setup = (initialState = stateFn()) =>
  renderWithStoreAndRouter(<Component />, {
    initialState,
  });

describe('useMyHealthAccessGuard', () => {
  let originalLocation;

  beforeEach(() => {
    originalLocation = window.location;
    delete window.location;
    window.location = {
      replace: sinon.spy(),
    };
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  describe('with valid MHV account', () => {
    it('renders the component', () => {
      const { getByRole } = setup();
      getByRole('heading', { name: 'Health Tool' });
    });
  });

  describe('with multiple MHV accounts', () => {
    it('renders the component', () => {
      const initialState = stateFn({ mhvAccountState: 'MULTIPLE' });
      const { getByRole } = setup(initialState);
      getByRole('heading', { name: 'Health Tool' });
    });
  });

  describe('without a valid MHV account', () => {
    it('redirects to the /my-health path', async () => {
      const initialState = stateFn({ mhvAccountState: 'NONE' });
      setup(initialState);

      await waitFor(() => {
        expect(window.location.replace.calledOnce).to.be.true;
        expect(window.location.replace.calledWith('/my-health')).to.be.true;
      });
    });
  });
});
