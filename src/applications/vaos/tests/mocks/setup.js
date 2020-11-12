import React from 'react';
import { Route, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history-v4';
import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import sinon from 'sinon';
import { fireEvent, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { commonReducer } from 'platform/startup/store';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';

import reducers from '../../redux/reducer';
import newAppointmentReducer from '../../new-appointment/redux/reducer';
import expressCareReducer from '../../express-care/redux/reducer';
import { fetchExpressCareWindows } from '../../appointment-list/redux/actions';

import TypeOfCarePage from '../../new-appointment/components/TypeOfCarePage';
import VAFacilityPage from '../../new-appointment/components/VAFacilityPage';
import ExpressCareInfoPage from '../../express-care/components/ExpressCareInfoPage';
import ExpressCareReasonPage from '../../express-care/components/ExpressCareReasonPage';
import { cleanup } from '@testing-library/react';
import ClinicChoicePage from '../../new-appointment/components/ClinicChoicePage';
import PreferredDatePage from '../../new-appointment/components/PreferredDatePage';
import { getParentSiteMock, getFacilityMock } from './v0';
import { mockParentSites, mockSupportedFacilities } from './helpers';

import createRoutesWithStore from '../../routes';
import TypeOfEyeCarePage from '../../new-appointment/components/TypeOfEyeCarePage';
import TypeOfFacilityPage from '../../new-appointment/components/TypeOfFacilityPage';

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
  sinon.spy(history, 'replace');
  sinon.spy(history, 'push');

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

export async function setTypeOfFacility(store, label) {
  const { findByLabelText, getByText, history } = renderWithStoreAndRouter(
    <TypeOfFacilityPage />,
    { store },
  );

  const radioButton = await findByLabelText(label);
  fireEvent.click(radioButton);
  fireEvent.click(getByText(/Continue/));
  await waitFor(() => expect(history.push.called).to.be.true);
  await cleanup();

  return history.push.firstCall.args[0];
}

export async function setTypeOfCare(store, label) {
  const { findByLabelText, getByText, history } = renderWithStoreAndRouter(
    <TypeOfCarePage />,
    { store },
  );

  const radioButton = await findByLabelText(label);
  fireEvent.click(radioButton);
  fireEvent.click(getByText(/Continue/));
  await waitFor(() => expect(history.push.called).to.be.true);
  await cleanup();

  return history.push.firstCall.args[0];
}

export async function setTypeOfEyeCare(store, label) {
  const { findByLabelText, getByText, history } = renderWithStoreAndRouter(
    <TypeOfEyeCarePage />,
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
  const screen = renderWithStoreAndRouter(
    <Route component={ClinicChoicePage} />,
    {
      store,
    },
  );

  fireEvent.click(await screen.findByLabelText(clinicLabel));
  fireEvent.click(await screen.findByText(/Continue/));
  await waitFor(() => expect(screen.history.push.called).to.be.true);
  await cleanup();

  return screen.history.push.firstCall.args[0];
}

export async function setPreferredDate(store, preferredDate) {
  const screen = renderWithStoreAndRouter(
    <Route component={PreferredDatePage} />,
    {
      store,
    },
  );

  await screen.findByText(/earliest date/);
  fireEvent.change(screen.getByLabelText('Month'), {
    target: { value: preferredDate.month() + 1 },
  });
  fireEvent.change(screen.getByLabelText('Day'), {
    target: { value: preferredDate.date() },
  });
  fireEvent.change(screen.getByLabelText('Year'), {
    target: { value: preferredDate.year() },
  });
  fireEvent.click(screen.getByText(/Continue/));
  await waitFor(() => expect(screen.history.push.called).to.be.true);
  await cleanup();

  return screen.history.push.firstCall.args[0];
}

export async function setExpressCareFacility({ store }) {
  const windowsThunk = fetchExpressCareWindows();
  await windowsThunk(store.dispatch, store.getState);
  const screen = renderWithStoreAndRouter(<ExpressCareInfoPage />, {
    store,
  });

  await screen.findByText(/How Express Care Works/i);
  fireEvent.click(screen.getByText(/^Continue/));
  await waitFor(() => expect(screen.history.push.called).to.be.true);
  await cleanup();
}

export async function setExpressCareReason({ store, label }) {
  const screen = renderWithStoreAndRouter(<ExpressCareReasonPage />, {
    store,
  });

  userEvent.click(await screen.findByLabelText(label));

  await waitFor(() => expect(screen.getByLabelText(label).checked).to.be.true);

  userEvent.click(screen.getByText(/^Continue/));
  await waitFor(() => expect(screen.history.push.called).to.be.true);
  await cleanup();
}
