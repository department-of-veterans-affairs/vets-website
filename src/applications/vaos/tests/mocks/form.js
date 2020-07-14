import React from 'react';
import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import sinon from 'sinon';
import { fireEvent, waitFor } from '@testing-library/dom';

import { commonReducer } from 'platform/startup/store';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';

import reducers from '../../reducers';
import newAppointmentReducer from '../../reducers/newAppointment';

import TypeOfCarePage from '../../containers/TypeOfCarePage';
import { cleanup } from '@testing-library/react';

export function createTestStore(initialState) {
  return createStore(
    combineReducers({
      ...commonReducer,
      ...reducers,
      newAppointment: newAppointmentReducer,
    }),
    initialState,
    applyMiddleware(thunk),
  );
}

export async function setTypeOfCare(store, label) {
  const router = {
    push: sinon.spy(),
  };
  const { findByLabelText, getByText } = renderInReduxProvider(
    <TypeOfCarePage router={router} />,
    { store },
  );

  const radioButton = await findByLabelText(label);
  fireEvent.click(radioButton);
  fireEvent.click(getByText(/Continue/));
  await waitFor(() => expect(router.push.called).to.be.true);
  await cleanup();

  return router.push.firstCall.args[0];
}
