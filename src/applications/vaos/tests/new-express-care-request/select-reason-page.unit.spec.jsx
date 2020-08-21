import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import { fireEvent } from '@testing-library/dom';

import { createTestStore, setExpressCareFacility } from '../mocks/setup';
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
    setupExpressCareMocks();
    const store = createTestStore({
      ...initialState,
    });
    const router = {
      push: sinon.spy(),
      replace: sinon.spy(),
    };
    await setExpressCareFacility({ store, router });
    const screen = renderInReduxProvider(
      <ExpressCareReasonPage router={router} />,
      {
        store,
      },
    );
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
