/** @module testing/mocks/setup */

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
import VaccineClinicChoicePage from '../../project-cheetah/components/ClinicChoicePage';
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
import VaccineFacilityPage from '../../project-cheetah/components/VAFacilityPage';
import { TYPE_OF_CARE_ID } from '../../project-cheetah/utils';

/**
 * Creates a Redux store when the VAOS reducers loaded and the thunk middleware applied
 *
 * @export
 * @param {Object} initialState The initial state of the Redux store
 * @returns {ReduxStore} A Redux store
 */
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

/**
 * Creates a history object and attaches a spy to replace and push
 *
 * The history object is fully functional, not stubbed
 *
 * @export
 * @param {string} [path='/'] The url to use initially for the history
 * @returns {History} Returns a History object
 */
export function createTestHistory(path = '/') {
  const history = createMemoryHistory({ initialEntries: [path] });
  sinon.spy(history, 'replace');
  sinon.spy(history, 'push');

  return history;
}

/**
 * Takes a React element and wraps it in a Redux Provider and React Router
 *
 * We use this function to be able to render part of the app with the usual
 * context it operates in, namely with a Redux store and Router.
 *
 * You can pass this our components with routes defined in them and routing
 * between those pages will work. Or, you can pass a single page component.
 *
 * Will return the {@link https://testing-library.com/docs/react-testing-library/api#render-result|result of the render function}
 * from React Testing Library, with the history object added in.
 *
 * @export
 * @param {ReactElement} ui ReactElement that you want to render for testing
 * @param {Object} renderParams
 * @param {Object} [renderParams.initialState] Initial Redux state, used to create a new store if a store is not passed
 * @param {ReduxStore} [renderParams.store=null] Redux store to use for the rendered page or section of the app
 * @param {string} [renderParams.path='/'] Url path to start from
 * @param {History} [renderParams.history=null] Custom history object to use, will create one if not passed
 * @returns {Object} Return value of the React Testing Library render function, plus the history object used
 */
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

/**
 * @deprecated Please use renderWithStoreAndRouter instead
 *
 * @export
 * @param {{ initialState: Object, store: ReduxStore, path: string }} params
 * @returns RTL render result plus history
 */
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

/**
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
 * @param {string} [zone=America/Denver] The timezone of the facility being used for testing
 * @returns {string} An ISO date string for a date that will cross over midnight
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

/**
 * Renders the type of facility page and chooses the option indicated by the label param
 *
 * @export
 * @async
 * @param {ReduxStore} store The Redux store to use to render the page
 * @param {string|RegExp} label The string or regex to pass to *ByText query to get
 *   a radio button to click on
 * @returns {string} The url path that was routed to after clicking Continue
 */
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

/**
 * Renders the type of care page and chooses the option indicated by the label param
 *
 * @export
 * @async
 * @param {ReduxStore} store The Redux store to use to render the page
 * @param {string|RegExp} label The string or regex to pass to *ByText query to get
 *   a radio button to click on
 * @returns {string} The url path that was routed to after clicking Continue
 */
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

/**
 * Renders the type of eye care page and chooses the option indicated by the label param
 *
 * @export
 * @async
 * @param {ReduxStore} store The Redux store to use to render the page
 * @param {string|RegExp} label The string or regex to pass to *ByText query to get
 *   a radio button to click on
 * @returns {string} The url path that was routed to after clicking Continue
 */
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

/**
 * Renders the facility page and chooses the option indicated by the facility id param
 *
 * @export
 * @async
 * @param {ReduxStore} store The Redux store to use to render the page
 * @param {string} facilityId The facility id of the facility to be selected
 * @returns {string} The url path that was routed to after clicking Continue
 */
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

/**
 * Renders the vaccine flow facility page and chooses the option indicated by the facility id param
 *
 * @export
 * @async
 * @param {ReduxStore} store The Redux store to use to render the page
 * @param {string} facilityId The facility id of the facility to be selected
 * @returns {string} The url path that was routed to after clicking Continue
 */
export async function setVaccineFacility(store, facilityId, facilityData = {}) {
  const siteCode = facilityId.substring(0, 3);

  const directFacilities = [
    getDirectBookingEligibilityCriteriaMock({
      id: facilityId,
      typeOfCareId: TYPE_OF_CARE_ID,
    }),
  ];

  const realFacilityID = facilityId.replace('983', '442').replace('984', '552');

  const facilities = [
    {
      id: `vha_${realFacilityID}`,
      attributes: {
        ...getVAFacilityMock().attributes,
        uniqueId: realFacilityID,
        ...facilityData,
      },
    },
  ];

  mockDirectBookingEligibilityCriteria([siteCode], directFacilities);
  mockRequestEligibilityCriteria([siteCode], []);
  mockFacilitiesFetch(`vha_${realFacilityID}`, facilities);

  const { findByText, history } = renderWithStoreAndRouter(
    <VaccineFacilityPage />,
    {
      store,
    },
  );

  const continueButton = await findByText(/Continue/);
  fireEvent.click(continueButton);
  await waitFor(() => expect(history.push.called).to.be.true);
  await cleanup();

  return history.push.firstCall.args[0];
}
/**
 * Renders the clinic page and chooses the option indicated by the label param
 *
 * @export
 * @async
 * @param {ReduxStore} store The Redux store to use to render the page
 * @param {string|RegExp} label The string or regex to pass to *ByText query to get
 *   a radio button to click on
 * @returns {string} The url path that was routed to after clicking Continue
 */
export async function setClinic(store, label) {
  const screen = renderWithStoreAndRouter(
    <Route component={ClinicChoicePage} />,
    {
      store,
    },
  );

  fireEvent.click(await screen.findByLabelText(label));
  fireEvent.click(await screen.findByText(/Continue/));
  await waitFor(() => expect(screen.history.push.called).to.be.true);
  await cleanup();

  return screen.history.push.firstCall.args[0];
}

/**
 * Renders the vaccine flow clinic page and chooses the option indicated by the label param
 *
 * @export
 * @async
 * @param {ReduxStore} store The Redux store to use to render the page
 * @param {string|RegExp} label The string or regex to pass to *ByText query to get
 *   a radio button to click on
 * @returns {string} The url path that was routed to after clicking Continue
 */
export async function setVaccineClinic(store, label) {
  const screen = renderWithStoreAndRouter(<VaccineClinicChoicePage />, {
    store,
  });

  fireEvent.click(await screen.findByLabelText(label));
  fireEvent.click(await screen.findByText(/Continue/));
  await waitFor(() => expect(screen.history.push.called).to.be.true);
  await cleanup();

  return screen.history.push.firstCall.args[0];
}

/**
 * Renders the preferred date page and enters the preferredDate
 *
 * @export
 * @async
 * @param {ReduxStore} store The Redux store to use to render the page
 * @param {MomentDate} preferredDate A Moment date object with the preferred date
 * @returns {string} The url path that was routed to after clicking Continue
 */
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

/**
 * Renders the Express Care info page and continues on
 *
 * @export
 * @async
 * @param {Object} params The Redux store to use to render the page
 * @param {ReduxStore} params.store The Redux store to use to render the page
 */
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

/**
 * Renders the Express Care reason page and selects a reason
 *
 * @export
 * @async
 * @param {Object} params The Redux store to use to render the page
 * @param {ReduxStore} params.store The Redux store to use to render the page
 * @param {string|RegExp} params.label The label of the reason option to choose
 */
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
