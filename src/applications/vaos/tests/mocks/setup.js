import React from 'react';
import moment from '../../lib/moment-tz';
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
import projectCheetahReducer from '../../project-cheetah/redux/reducer';
import { fetchExpressCareWindows } from '../../appointment-list/redux/actions';

import TypeOfCarePage from '../../new-appointment/components/TypeOfCarePage';
import ExpressCareInfoPage from '../../express-care/components/ExpressCareInfoPage';
import ExpressCareReasonPage from '../../express-care/components/ExpressCareReasonPage';
import { cleanup } from '@testing-library/react';
import ClinicChoicePage from '../../new-appointment/components/ClinicChoicePage';
import PreferredDatePage from '../../new-appointment/components/PreferredDatePage';
import {
  getDirectBookingEligibilityCriteriaMock,
  getParentSiteMock,
  getRequestEligibilityCriteriaMock,
  getVAFacilityMock,
} from './v0';
import {
  mockDirectBookingEligibilityCriteria,
  mockFacilitiesFetch,
  mockParentSites,
  mockRequestEligibilityCriteria,
} from './helpers';

import createRoutesWithStore from '../../routes';
import TypeOfEyeCarePage from '../../new-appointment/components/TypeOfEyeCarePage';
import TypeOfFacilityPage from '../../new-appointment/components/TypeOfFacilityPage';
import VAFacilityPageV2 from '../../new-appointment/components/VAFacilityPage/VAFacilityPageV2';

export function createTestStore(initialState) {
  return createStore(
    combineReducers({
      ...commonReducer,
      ...reducers,
      newAppointment: newAppointmentReducer,
      expressCare: expressCareReducer,
      projectCheetah: projectCheetahReducer,
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

/*
 * This function returns a date for which adjusting the timezone
 * to the provided zone results in a date on a different day.
 * 
 * For example, if you're on ET and you call this function with 
 * America/Denver, then you'll get a time of 12:30 am, because that will
 * be a different day of the month than the same time in America/Denver
 * 
 * If the local zone and the passed zone are the same, you'll get a 12:30
 * am date, similar to zones that are ahead of the passed zone.
 * 
 * @export
 * @param {string} zone A timezone description
 * @returns An ISO date string for a date that will cross over midnight
 */
export function getTimezoneTestDate(zone = 'America/Denver') {
  let mockedDate;
  const localOffset = moment().utcOffset();
  const facilityTimezone = moment()
    .tz(zone)
    .utcOffset();

  if (localOffset >= facilityTimezone) {
    mockedDate = moment()
      .set('hour', 0)
      .set('minute', 30);
  } else {
    mockedDate = moment()
      .subtract(1, 'day')
      .set('hour', 23)
      .set('minute', 30);
  }

  return mockedDate.format('YYYY-MM-DD[T]HH:mm:ss');
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

  const directFacilities = [
    getDirectBookingEligibilityCriteriaMock({ id: facilityId, typeOfCareId }),
  ];

  const requestFacilities = [
    getRequestEligibilityCriteriaMock({ id: facilityId, typeOfCareId }),
  ];

  const realFacilityID = facilityId.replace('983', '442').replace('984', '552');

  const facilities = [
    {
      id: `vha_${realFacilityID}`,
      attributes: {
        ...getVAFacilityMock().attributes,
        uniqueId: realFacilityID,
      },
    },
  ];

  mockParentSites([siteCode], [parentSite]);
  mockDirectBookingEligibilityCriteria([siteCode], directFacilities);
  mockRequestEligibilityCriteria([siteCode], requestFacilities);
  mockFacilitiesFetch(`vha_${realFacilityID}`, facilities);

  const { findByText, history } = renderWithStoreAndRouter(
    <VAFacilityPageV2 />,
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
