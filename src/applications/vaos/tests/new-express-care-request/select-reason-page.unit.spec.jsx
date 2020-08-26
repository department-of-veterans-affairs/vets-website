import React from 'react';
import { expect } from 'chai';

import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import { fireEvent } from '@testing-library/dom';

import {
  createTestStore,
  setExpressCareFacility,
  renderWithStoreAndRouter,
} from '../mocks/setup';
import { setupExpressCareMocks } from '../mocks/helpers';
import ExpressCareReasonPage from '../../containers/ExpressCareReasonPage';

const initialState = {
  user: {
    profile: {
      facilities: [{ facilityId: '983', isCerner: false }],
    },
  },
};

describe('VAOS integration: Express Care form', () => {
  beforeEach(() => mockFetch());
  afterEach(() => resetFetch());

  it('should contain expected elements', async () => {
    setupExpressCareMocks({ isWindowOpen: true, isUnderRequestLimit: true });
    const store = createTestStore({
      ...initialState,
    });
    await setExpressCareFacility({ store });
    const screen = renderWithStoreAndRouter(<ExpressCareReasonPage />, {
      store,
    });

    await screen.findByText('Select a reason for your Express Care request');
    const radio = screen.getByLabelText('Cough');
    fireEvent.click(radio);
    expect(radio.checked).to.be.true;
    expect(screen.baseElement).to.contain.text(
      'If you need a mental health appointment today',
    );
    expect(screen.getByText('Find a VA location').href).to.include(
      '/find-locations',
    );
    expect(screen.baseElement).to.contain.text(
      'If your health concern isn’t listed here',
    );
    screen.getByRole('button', { name: /back/i });
    screen.getByRole('button', { name: /continue/i });
  });
});
