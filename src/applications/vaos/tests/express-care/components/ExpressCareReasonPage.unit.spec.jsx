import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';

import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import {
  createTestStore,
  setExpressCareFacility,
  renderWithStoreAndRouter,
} from '../../mocks/setup';
import { setupExpressCareMocks } from '../../mocks/helpers';
import ExpressCareReasonPage from '../../../express-care/components/ExpressCareReasonPage';

const initialState = {
  user: {
    profile: {
      facilities: [{ facilityId: '983', isCerner: false }],
    },
  },
};

describe('VAOS integration: Express Care form', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(moment('2020-01-26T14:00:00'));
  });
  afterEach(() => {
    resetFetch();
    MockDate.reset();
  });

  it('should contain expected elements', async () => {
    setupExpressCareMocks({ isWindowOpen: true, isUnderRequestLimit: true });
    const store = createTestStore({
      ...initialState,
    });
    await setExpressCareFacility({ store });
    const screen = renderWithStoreAndRouter(<ExpressCareReasonPage />, {
      store,
    });

    await screen.findByLabelText('Cough');
    expect(screen.getByText('Select a reason for your Express Care request')).to
      .exist;

    userEvent.click(screen.getByLabelText('Cough'));
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
    userEvent.click(screen.getByRole('button', { name: /continue/i }));
    await waitFor(() => expect(screen.history.push.called).to.be.true);
  });
});
