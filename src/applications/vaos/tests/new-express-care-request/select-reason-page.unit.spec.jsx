import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';

import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import { fireEvent } from '@testing-library/dom';

import { getExpressCareRequestCriteriaMock } from '../mocks/v0';
import { createTestStore } from '../mocks/setup';
import { mockRequestEligibilityCriteria } from '../mocks/helpers';
import ExpressCareReasonPage from '../../containers/ExpressCareReasonPage';
import { fetchExpressCareWindows } from '../../actions/expressCare';

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
    const today = moment();
    const requestCriteria = getExpressCareRequestCriteriaMock('983', [
      {
        day: today
          .clone()
          .tz('America/Denver')
          .format('dddd')
          .toUpperCase(),
        canSchedule: true,
        startTime: today
          .clone()
          .subtract('2', 'minutes')
          .tz('America/Denver')
          .format('HH:mm'),
        endTime: today
          .clone()
          .add('1', 'minutes')
          .tz('America/Denver')
          .format('HH:mm'),
      },
    ]);
    mockRequestEligibilityCriteria(['983'], requestCriteria);
    const store = createTestStore({
      ...initialState,
    });
    store.dispatch(fetchExpressCareWindows());

    const router = {
      push: sinon.spy(),
    };
    const screen = renderInReduxProvider(
      <ExpressCareReasonPage router={router} />,
      {
        store,
      },
    );

    expect(screen.baseElement).to.contain.text(
      'Select a reason for your Express Care request',
    );
    const radio = screen.getByLabelText('Cough');
    fireEvent.click(radio);
    waitFor(() => expect(radio.checked).to.be.true);
    expect(screen.baseElement).to.contain.text(
      'If you need a mental health appointment today',
    );
    expect(screen.getByText('Find a VA location').href).to.include(
      '/find-locations',
    );
    expect(screen.baseElement).to.contain.text(
      'If your health concern isn’t listed here',
    );
    screen.getByText(/appointments tool/i);
    await screen.getByRole('button', { name: /back/i });
    await screen.getByRole('button', { name: /continue/i });
  });
});
