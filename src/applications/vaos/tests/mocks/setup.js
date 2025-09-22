/** @module testing/mocks/setup */

import { fireEvent, waitFor } from '@testing-library/dom';
import { expect } from 'chai';
import React from 'react';
import { Route } from 'react-router-dom';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';

import { commonReducer } from '@department-of-veterans-affairs/platform-startup/store';
import { renderWithStoreAndRouter as platformRenderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';

import { cleanup } from '@testing-library/react';
import { format, setHours, setMinutes } from 'date-fns';
import covid19VaccineReducer from '../../covid-19-vaccine/redux/reducer';
import newAppointmentReducer from '../../new-appointment/redux/reducer';
import reducers from '../../redux/reducer';

import VaccineClinicChoicePage from '../../covid-19-vaccine/components/ClinicChoicePage';
import ClinicChoicePage from '../../new-appointment/components/ClinicChoicePage';
import PreferredDatePageVaDate from '../../new-appointment/components/PreferredDatePageVaDate';
import TypeOfCarePage from '../../new-appointment/components/TypeOfCarePage';

import VaccineFacilityPage from '../../covid-19-vaccine/components/VAFacilityPage';
import ClosestCityStatePage from '../../new-appointment/components/ClosestCityStatePage';
import TypeOfEyeCarePage from '../../new-appointment/components/TypeOfEyeCarePage';
import TypeOfFacilityPage from '../../new-appointment/components/TypeOfFacilityPage';
import VAFacilityPageV2 from '../../new-appointment/components/VAFacilityPage/VAFacilityPageV2';
import { vaosApi } from '../../redux/api/vaosApi';
import { TYPES_OF_CARE, TYPE_OF_CARE_IDS } from '../../utils/constants';
import MockFacilityResponse from '../fixtures/MockFacilityResponse';
import {
  mockFacilitiesApi,
  mockSchedulingConfigurationsApi,
  mockV2CommunityCareEligibility,
} from './mockApis';
import MockSchedulingConfigurationResponse, {
  MockServiceConfiguration,
} from '../fixtures/MockSchedulingConfigurationResponse';
import TypeOfMentalHealthPage from '../../new-appointment/components/TypeOfMentalHealthPage';

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
      covid19Vaccine: covid19VaccineReducer,
      [vaosApi.reducerPath]: vaosApi.reducer,
    }),
    initialState,
    applyMiddleware(thunk, vaosApi.middleware),
  );
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
  return platformRenderWithStoreAndRouter(ui, {
    initialState,
    reducers,
    store,
    path,
    history,
    additionalMiddlewares: [vaosApi.middleware],
  });
}

/**
 * This function returns a date string for use with MockDate
 *
 * @export
 * @returns {string} An ISO date string for a date
 */
export function getTestDate() {
  return format(
    setMinutes(setHours(new Date(), 0), 30),
    "yyyy-MM-dd'T'HH:mm:ss",
  );
}

/**
 * Renders the type of facility page and chooses the option indicated by the label param
 *
 * @export
 * @async
 * @param {ReduxStore} store The Redux store to use to render the page
 * @param {string|RegExp} label The string or regex to pass to *ByText query to get
 *   a radio button to click on
 * @returns {Promise string} The url path that was routed to after clicking Continue
 */
export async function setTypeOfFacility(store, label) {
  const screen = renderWithStoreAndRouter(<TypeOfFacilityPage />, { store });
  await screen.findByText(/Continue/i);

  const radioButton = await screen.findByLabelText(label);
  fireEvent.click(radioButton);
  fireEvent.click(screen.getByText(/Continue/));
  await waitFor(() => expect(screen.history.push.called).to.be.true);
  await cleanup();

  return screen.history.push.firstCall.args[0];
}

/**
 * Renders the type of care page and chooses the option indicated by the label param
 *
 * @export
 * @async
 * @param {ReduxStore} store The Redux store to use to render the page
 * @param {string|RegExp} label The string or regex to pass to *ByText query to get
 *   a radio button to click on
 * @returns {Promise string} The url path that was routed to after clicking Continue
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
 * @returns {Promise string} The url path that was routed to after clicking Continue
 */
export async function setTypeOfEyeCare(store, label) {
  const screen = renderWithStoreAndRouter(<TypeOfEyeCarePage />, { store });
  await screen.findByText(/Continue/i);

  fireEvent.click(await screen.findByLabelText(label));
  fireEvent.click(screen.getByText(/Continue/));
  await waitFor(() => expect(screen.history.push.called).to.be.true);
  await cleanup();

  return screen.history.push.firstCall.args[0];
}

/**
 * Renders the type of mental health page and chooses the option indicated by the label param
 *
 * @export
 * @async
 * @param {ReduxStore} store The Redux store to use to render the page
 * @param {string|RegExp} label The string or regex to pass to *ByText query to get
 *   a radio button to click on
 * @returns {Promise string} The url path that was routed to after clicking Continue
 */
export async function setTypeOfMentalHealth(store, label) {
  const screen = renderWithStoreAndRouter(<TypeOfMentalHealthPage />, {
    store,
  });
  await screen.findByText(/Continue/i);

  fireEvent.click(await screen.findByLabelText(label));
  fireEvent.click(screen.getByText(/Continue/));
  await waitFor(() => expect(screen.history.push.called).to.be.true);
  await cleanup();

  return screen.history.push.firstCall.args[0];
}

/**
 * Renders the facility page and chooses the option indicated by the facility id param
 *
 * @export
 * @async
 * @param {ReduxStore} store The Redux store to use to render the page
 * @param {string} facilityId The facility id of the facility to be selected
 * @param {Object} params
 * @param {?VAFacility} params.facilityData The facility data to use in the mock
 * @returns {Promise string} The url path that was routed to after clicking Continue
 */
export async function setVAFacility(
  store,
  facilityId,
  typeOfCareId = 'primaryCare',
  { facilityData = null } = {},
) {
  // TODO: Make sure this works in staging before removal
  // const realFacilityID = facilityId.replace('983', '442').replace('984', '552');

  const facilities = [
    facilityData || new MockFacilityResponse({ id: facilityId }),
  ];

  mockFacilitiesApi({ children: true, response: facilities });
  mockSchedulingConfigurationsApi({
    response: [
      new MockSchedulingConfigurationResponse({
        facilityId: '983',
        services: [
          new MockServiceConfiguration({
            typeOfCareId,
            directEnabled: true,
            requestEnabled: true,
          }),
        ],
      }),
    ],
  });

  const screen = renderWithStoreAndRouter(<VAFacilityPageV2 />, { store });

  const continueButton = await screen.findByText(/Continue/);
  fireEvent.click(continueButton);
  await waitFor(() => expect(screen.history.push.called).to.be.true);
  await cleanup();

  return screen.history.push.firstCall.args[0];
}

/**
 * Renders the vaccine flow facility page and chooses the option indicated by the facility id param
 *
 * @export
 * @async
 * @param {ReduxStore} store The Redux store to use to render the page
 * @param {string} facilityId The facility id of the facility to be selected
 * @returns {Promise string} The url path that was routed to after clicking Continue
 */
export async function setVaccineFacility(store, facilityData = {}) {
  // TODO: Make sure this works in staging before removal
  // const realFacilityID = facilityId.replace('983', '442').replace('984', '552');

  const facilities = [facilityData];

  mockFacilitiesApi({ children: true, response: facilities });
  mockSchedulingConfigurationsApi({
    response: [
      new MockSchedulingConfigurationResponse({
        facilityId: '983',
        services: [
          new MockServiceConfiguration({
            typeOfCareId: TYPE_OF_CARE_IDS.COVID_VACCINE_ID,
            directEnabled: true,
          }),
        ],
      }),
    ],
  });

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
 * @returns {Promise string} The url path that was routed to after clicking Continue
 */
export async function setClinic(store, label) {
  const screen = renderWithStoreAndRouter(
    <Route component={ClinicChoicePage} />,
    {
      store,
    },
  );
  await screen.findByText(/Continue/i);

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
 * @returns {Promise string} The url path that was routed to after clicking Continue
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
 * @param {Date} preferredDate A date object with the preferred date
 * @returns {Promise string} The url path that was routed to after clicking Continue
 */
export async function setPreferredDate(store, preferredDate) {
  const screen = renderWithStoreAndRouter(
    <Route component={PreferredDatePageVaDate} />,
    {
      store,
    },
  );

  const vaDate = screen.container.querySelector('va-date');
  vaDate.__events.dateChange({
    target: { value: format(preferredDate, 'yyyy-MM-dd') },
  });

  fireEvent.click(screen.getByText(/Continue/));
  await waitFor(() => expect(screen.history.push.called).to.be.true);
  await cleanup();

  return screen.history.push.firstCall.args[0];
}

/**
 * Set up community care flow for use in page tests from
 * the calendar page forward.
 *
 * @export
 * @param {Object} params
 * @param {Object} toggles Any feature toggles to set. CC toggle is set by default
 * @param {Array<Object>} parentSites List of parent sites and data, in the format used
 *  by the createMockFacility params, so you can pass name, id, and address
 * @param {?Array<string>} supportedSites List of site ids that support community care.
 *  Defaults to the parent site ids if not provided
 * @param {?Array<string>} registeredSites List of registered site ids. Will use ids
 *  from parentSites list if not provided
 * @param {string} typeOfCareId Type of care id string to use. Use V2 id format (idV2 in
 *  type of care list)
 * @param {Object} [residentialAddress=null] VA Profile address to use for the user
 * @returns {Promise ReduxStore} Redux store with data set up
 */
export async function setCommunityCareFlow({
  parentSites,
  registeredSites,
  supportedSites,
  typeOfCareId = 'primaryCare',
  residentialAddress = null,
}) {
  const typeOfCare = TYPES_OF_CARE.find(care => care.idV2 === typeOfCareId);
  const registered =
    registeredSites ||
    parentSites.filter(data => data.id.length === 3).map(data => data.id);

  const store = createTestStore({
    featureToggles: {
      vaOnlineSchedulingCommunityCare: true,
    },
    user: {
      profile: {
        facilities: registered.map(id => ({
          facilityId: id,
          isCerner: false,
        })),
      },
      vapContactInfo: {
        residentialAddress,
      },
    },
  });

  mockFacilitiesApi({
    ids: registered,
    response: parentSites.map(data => {
      const facility = new MockFacilityResponse({
        id: data.id,
        isParent: true,
      });
      if (data.address) facility.setAddress(data.address);
      return facility;
    }),
  });
  mockV2CommunityCareEligibility({
    parentSites: parentSites.map(data => data.id),
    supportedSites: supportedSites || parentSites.map(data => data.id),
    careType: typeOfCare.cceType,
  });

  await setTypeOfCare(store, new RegExp(typeOfCare.name));
  await setTypeOfFacility(store, 'Community care facility');

  return store;
}

/**
 * Renders the closest city page and selects the city.
 *
 * @export
 * @async
 * @param {ReduxStore} store The Redux store to use to render the page
 * @param {*} cityValue The value of the city to select
 * @returns {Promise string} The url path that was routed to after clicking Continue
 */
export async function setClosestCity(store, cityValue) {
  const screen = renderWithStoreAndRouter(<ClosestCityStatePage />, { store });

  fireEvent.click(await screen.findByLabelText(cityValue));
  fireEvent.click(screen.getByText(/Continue/));
  await waitFor(() => expect(screen.history.push.called).to.be.true);
  await cleanup();

  return screen.history.push.firstCall.args[0];
}
