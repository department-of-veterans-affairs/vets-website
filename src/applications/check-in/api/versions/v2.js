/* istanbul ignore file */
import appendQuery from 'append-query';
// eslint-disable-next-line import/no-unresolved
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { makeApiCallWithSentry } from '../utils';

const v2 = {
  getSession: async ({ token, checkInType }) => {
    const url = '/check_in/v2/sessions/';
    let requestUrl = `${environment.API_URL}${url}${token}`;
    if (checkInType) {
      requestUrl = appendQuery(requestUrl, {
        checkInType,
      });
    }
    const eventLabel = `${checkInType || 'day-of'}-get-current-session-dob`;

    const json = await makeApiCallWithSentry(
      apiRequest(requestUrl),
      eventLabel,
      token,
    );
    return {
      ...json,
    };
  },
  postSession: async ({ lastName, dob, token, checkInType = '' }) => {
    const url = '/check_in/v2/sessions/';
    const headers = { 'Content-Type': 'application/json' };
    const data = {
      session: {
        uuid: token,
        dob,
        lastName: lastName.trim(),
        checkInType,
      },
    };
    const body = JSON.stringify(data);
    const settings = {
      headers,
      body,
      method: 'POST',
      mode: 'cors',
    };

    const eventLabel = `${checkInType || 'day-of'}-validating-user-dob`;

    const json = await makeApiCallWithSentry(
      apiRequest(`${environment.API_URL}${url}`, settings),
      eventLabel,
      token,
    );
    return {
      ...json,
    };
  },

  getCheckInData: async (token, facilityType = null) => {
    const url = '/check_in/v2/patient_check_ins/';
    let requestUrl = `${environment.API_URL}${url}${token}`;
    if (facilityType) {
      requestUrl = appendQuery(requestUrl, {
        facilityType,
      });
    }
    const json = await makeApiCallWithSentry(
      apiRequest(requestUrl),
      'get-lorota-data',
      token,
    );
    return {
      ...json,
    };
  },
  postCheckInData: async ({
    uuid,
    appointmentIen,
    setECheckinStartedCalled,
    isTravelEnabled,
    travelSubmitted,
  }) => {
    const url = '/check_in/v2/patient_check_ins/';
    const headers = { 'Content-Type': 'application/json' };
    const data = {
      patientCheckIns: {
        uuid,
        appointmentIen,
        setECheckinStartedCalled,
        isTravelEnabled,
        travelSubmitted,
      },
    };
    const body = JSON.stringify(data);
    const settings = {
      headers,
      body,
      method: 'POST',
      mode: 'cors',
    };

    const json = await makeApiCallWithSentry(
      apiRequest(`${environment.API_URL}${url}`, settings),
      `check-in-user${setECheckinStartedCalled ? '' : '-45MR'}`,
      uuid,
    );
    return {
      ...json,
    };
  },
  getPreCheckInData: async token => {
    const url = '/check_in/v2/pre_check_ins/';
    const requestUrl = appendQuery(`${environment.API_URL}${url}${token}`, {
      checkInType: 'preCheckIn',
    });

    const json = await makeApiCallWithSentry(
      apiRequest(requestUrl),
      'get-lorota-data',
      token,
    );
    return {
      ...json,
    };
  },
  postPreCheckInData: async ({
    uuid,
    demographicsUpToDate,
    nextOfKinUpToDate,
    emergencyContactUpToDate,
    checkInType = 'preCheckIn',
  }) => {
    const url = '/check_in/v2/pre_check_ins/';
    const headers = { 'Content-Type': 'application/json' };
    const data = {
      preCheckIn: {
        uuid,
        demographicsUpToDate,
        nextOfKinUpToDate,
        emergencyContactUpToDate,
        checkInType,
      },
    };
    const body = JSON.stringify(data);
    const settings = {
      headers,
      body,
      method: 'POST',
      mode: 'cors',
    };

    const json = await makeApiCallWithSentry(
      apiRequest(`${environment.API_URL}${url}`, settings),
      'pre-check-in-user',
      uuid,
    );
    return {
      ...json,
    };
  },
  patchDayOfDemographicsData: async ({
    uuid,
    demographicsUpToDate,
    nextOfKinUpToDate,
    emergencyContactUpToDate,
  }) => {
    const url = '/check_in/v2/demographics/';
    const headers = { 'Content-Type': 'application/json' };
    const data = {
      demographics: {
        demographicConfirmations: {
          uuid,
          demographicsUpToDate,
          nextOfKinUpToDate,
          emergencyContactUpToDate,
        },
      },
    };
    const body = JSON.stringify(data);
    const settings = {
      headers,
      body,
      method: 'PATCH',
      mode: 'cors',
    };

    const json = await makeApiCallWithSentry(
      apiRequest(`${environment.API_URL}${url}${uuid}`, settings),
      'patch-demographics-update-flags',
      uuid,
    );
    return {
      ...json,
    };
  },

  postDayOfTravelPayClaim: async (data, setECheckinStartedCalled) => {
    const url = '/check_in/v0/travel_claims/';
    const headers = { 'Content-Type': 'application/json' };

    const travelClaimData = {
      travelClaims: {
        uuid: data.uuid,
        appointmentDate: data.appointmentDate,
      },
    };

    const body = JSON.stringify(travelClaimData);

    const settings = {
      headers,
      body,
      method: 'POST',
      mode: 'cors',
    };

    const json = await makeApiCallWithSentry(
      apiRequest(`${environment.API_URL}${url}`, settings),
      `submit-travel-pay-claim${setECheckinStartedCalled ? '' : '-45MR'}`,
      data.uuid,
      true,
    );
    return {
      ...json,
    };
  },
};

export { v2 };
