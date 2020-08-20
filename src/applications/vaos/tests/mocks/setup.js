import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history-v4';
import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import sinon from 'sinon';
import { fireEvent, waitFor } from '@testing-library/dom';

import { commonReducer } from 'platform/startup/store';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';

import reducers from '../../reducers';
import newAppointmentReducer from '../../reducers/newAppointment';
import expressCareReducer from '../../reducers/expressCare';

import TypeOfCarePage from '../../containers/TypeOfCarePage';
import VAFacilityPage from '../../containers/VAFacilityPage';
import { cleanup } from '@testing-library/react';
import ClinicChoicePage from '../../containers/ClinicChoicePage';
import PreferredDatePage from '../../containers/PreferredDatePage';
import { getParentSiteMock, getFacilityMock } from './v0';
import { mockParentSites, mockSupportedFacilities } from './helpers';

import createRoutesWithStore from '../../routes';

export function createTestStore(initialState) {
  return createStore(
    combineReducers({
      ...commonReducer,
      ...reducers,
      newAppointment: newAppointmentReducer,
      expressCare: expressCareReducer,
    }),
    initialState,
    applyMiddleware(thunk),
  );
}

export function createTestHistory(path = '/') {
  const history = createMemoryHistory({ initialEntries: [path] });
  history.replace = sinon.spy();
  history.push = sinon.spy();

  return history;
}

export function renderWithStoreAndRouter(
  ui,
  { initialState, store = null, path = '/', history = null },
) {
  const testStore =
    store ||
    createStore(
      combineReducers({ ...commonReducer, ...reducers }),
      initialState,
      applyMiddleware(thunk),
    );

  const historyObject = history || createTestHistory(path);
  const screen = renderInReduxProvider(
    <Router history={historyObject}>{ui}</Router>,
    {
      store: testStore,
      initialState,
      reducers,
    },
  );

  return { ...screen, history: historyObject };
}

export function renderFromRoutes({ initialState, store = null, path = '/' }) {
  const testStore =
    store ||
    createStore(
      combineReducers({ ...commonReducer, ...reducers }),
      initialState,
      applyMiddleware(thunk),
    );
  const history = createTestHistory(path);
  const screen = renderInReduxProvider(
    <Router history={history}>{createRoutesWithStore(testStore)}</Router>,
    {
      store: testStore,
      initialState,
      reducers,
    },
  );

  return { ...screen, history };
}

export async function setTypeOfCare(store, label) {
  const history = {
    push: sinon.spy(),
  };
  const { findByLabelText, getByText } = renderWithStoreAndRouter(
    <TypeOfCarePage history={history} />,
    { store },
  );

  const radioButton = await findByLabelText(label);
  fireEvent.click(radioButton);
  fireEvent.click(getByText(/Continue/));
  await waitFor(() => expect(history.push.called).to.be.true);
  await cleanup();

  return history.push.firstCall.args[0];
}

export async function setVAFacility(store, facilityId) {
  const siteCode = facilityId.substring(0, 3);
  const typeOfCareId = store.getState().newAppointment.data.typeOfCareId;
  const parentSite = {
    id: siteCode,
    attributes: {
      ...getParentSiteMock().attributes,
      institutionCode: siteCode,
      rootStationCode: siteCode,
      parentStationCode: siteCode,
    },
  };
  mockParentSites([siteCode], [parentSite]);
  const facilities = [
    {
      id: facilityId,
      attributes: {
        ...getFacilityMock().attributes,
        institutionCode: facilityId,
        rootStationCode: siteCode,
        parentStationCode: siteCode,
        requestSupported: true,
        directSchedulingSupported: true,
      },
    },
  ];
  mockSupportedFacilities({
    siteId: siteCode,
    parentId: siteCode,
    typeOfCareId,
    data: facilities,
  });

  const history = {
    push: sinon.spy(),
  };
  const { findByText } = renderWithStoreAndRouter(
    <VAFacilityPage history={history} />,
    { store },
  );

  const continueButton = await findByText(/Continue/);
  fireEvent.click(continueButton);
  await waitFor(() => expect(history.push.called).to.be.true);
  await cleanup();

  return history.push.firstCall.args[0];
}

export async function setClinic(store, clinicLabel) {
  const history = {
    push: sinon.spy(),
  };
  const { findByText, findByLabelText } = renderWithStoreAndRouter(
    <ClinicChoicePage history={history} />,
    { store },
  );

  fireEvent.click(await findByLabelText(clinicLabel));
  fireEvent.click(await findByText(/Continue/));
  await waitFor(() => expect(history.push.called).to.be.true);
  await cleanup();

  return history.push.firstCall.args[0];
}

export async function setPreferredDate(store, preferredDate) {
  const history = {
    push: sinon.spy(),
  };
  const { findByText, getByLabelText, getByText } = renderWithStoreAndRouter(
    <PreferredDatePage history={history} />,
    { store },
  );

  await findByText(/earliest date/);
  fireEvent.change(getByLabelText('Month'), {
    target: { value: preferredDate.month() + 1 },
  });
  fireEvent.change(getByLabelText('Day'), {
    target: { value: preferredDate.date() },
  });
  fireEvent.change(getByLabelText('Year'), {
    target: { value: preferredDate.year() },
  });
  fireEvent.click(getByText(/Continue/));
  await waitFor(() => expect(history.push.called).to.be.true);
  await cleanup();

  return history.push.firstCall.args[0];
}
