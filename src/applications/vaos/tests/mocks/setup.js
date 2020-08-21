import React from 'react';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';
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
import { fetchExpressCareWindows } from '../../actions/expressCare';

import TypeOfCarePage from '../../containers/TypeOfCarePage';
import VAFacilityPage from '../../containers/VAFacilityPage';
import ExpressCareInfoPage from '../../containers/ExpressCareInfoPage';
import ExpressCareReasonPage from '../../containers/ExpressCareReasonPage';
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

export function renderFromRoutes({ initialState, store = null, path = '' }) {
  const testStore =
    store ||
    createStore(
      combineReducers({ ...commonReducer, ...reducers }),
      initialState,
      applyMiddleware(thunk),
    );
  const memoryHistory = createMemoryHistory(path);
  const screen = renderInReduxProvider(
    <Router history={memoryHistory}>{createRoutesWithStore(testStore)}</Router>,
    {
      store: testStore,
      initialState,
      reducers,
    },
  );

  return { ...screen, memoryHistory };
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

  const router = {
    push: sinon.spy(),
  };
  const { findByText } = renderInReduxProvider(
    <VAFacilityPage router={router} />,
    { store },
  );

  const continueButton = await findByText(/Continue/);
  fireEvent.click(continueButton);
  await waitFor(() => expect(router.push.called).to.be.true);
  await cleanup();

  return router.push.firstCall.args[0];
}

export async function setClinic(store, clinicLabel) {
  const router = {
    push: sinon.spy(),
  };
  const { findByText, findByLabelText } = renderInReduxProvider(
    <ClinicChoicePage router={router} />,
    { store },
  );

  fireEvent.click(await findByLabelText(clinicLabel));
  fireEvent.click(await findByText(/Continue/));
  await waitFor(() => expect(router.push.called).to.be.true);
  await cleanup();

  return router.push.firstCall.args[0];
}

export async function setPreferredDate(store, preferredDate) {
  const router = {
    push: sinon.spy(),
  };
  const { findByText, getByLabelText, getByText } = renderInReduxProvider(
    <PreferredDatePage router={router} />,
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
  await waitFor(() => expect(router.push.called).to.be.true);
  await cleanup();

  return router.push.firstCall.args[0];
}

export async function setExpressCareFacility({ store, router }) {
  store.dispatch(fetchExpressCareWindows());
  const screen = renderInReduxProvider(
    <ExpressCareInfoPage router={router} />,
    {
      store,
    },
  );

  await screen.findByText(/How Express Care Works/i);
  fireEvent.click(screen.getByText(/^Continue/));
  await waitFor(() => expect(router.push.called).to.be.true);
  await cleanup();
}

export async function setExpressCareReason({ store, router, label }) {
  const screen = renderInReduxProvider(
    <ExpressCareReasonPage router={router} />,
    {
      store,
    },
  );
  await screen.findByText('Select a reason for your Express Care request');
  fireEvent.click(screen.getByLabelText(label));
  fireEvent.click(screen.getByText(/^Continue/));
  await waitFor(() => expect(router.push.called).to.be.true);
  await cleanup();
}
