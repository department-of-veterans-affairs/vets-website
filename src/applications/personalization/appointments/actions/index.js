import moment from 'moment';
import { replace, uniq, isEmpty } from 'lodash';
import environment from '~/platform/utilities/environment';
import { apiRequest } from '~/platform/utilities/api';
import {
  getCCTimeZone,
  getVATimeZone,
} from '~/applications/personalization/dashboard-2/utils/timezone';
import {
  FETCH_CONFIRMED_FUTURE_APPOINTMENTS,
  FETCH_CONFIRMED_FUTURE_APPOINTMENTS_FAILED,
  FETCH_CONFIRMED_FUTURE_APPOINTMENTS_SUCCEEDED,
  FUTURE_APPOINTMENTS_HIDDEN_SET,
  VIDEO_TYPES,
} from '~/applications/personalization/dashboard-2/constants';
import MOCK_FACILITIES from '~/applications/personalization/dashboard-2/utils/mocks/appointments/MOCK_FACILITIES.json';
import MOCK_VA_APPOINTMENTS from '~/applications/personalization/dashboard-2/utils/mocks/appointments/MOCK_VA_APPOINTMENTS';
import MOCK_CC_APPOINTMENTS from '~/applications/personalization/dashboard-2/utils/mocks/appointments/MOCK_CC_APPOINTMENTS';

function isAtlasLocation(appointment) {
  return appointment.attributes?.vvsAppointments?.some(
    element => element.tasInfo,
  );
}

function getAdditionalInfo(appointment) {
  const appointmentKind =
    appointment.attributes?.vvsAppointments?.[0]?.appointmentKind;

  if (isAtlasLocation(appointment)) {
    return 'at an ATLAS location';
  }

  if (appointmentKind === VIDEO_TYPES.clinic) {
    return 'at a VA location';
  }

  if (appointmentKind === VIDEO_TYPES.gfe) {
    return 'using a VA device';
  }

  if (
    appointmentKind === VIDEO_TYPES.adhoc ||
    appointmentKind === VIDEO_TYPES.mobile
  ) {
    return 'at home';
  }

  return null;
}

function getStagingID(facilityID) {
  if (!facilityID) {
    return facilityID;
  }

  if (environment.isProduction()) {
    return facilityID;
  }

  if (facilityID.startsWith('983')) {
    return facilityID.replace('983', '442');
  }

  if (facilityID.startsWith('984')) {
    return facilityID.replace('984', '552');
  }

  return facilityID;
}

export function fetchConfirmedFutureAppointments() {
  return async dispatch => {
    dispatch({
      type: FETCH_CONFIRMED_FUTURE_APPOINTMENTS,
    });

    let facilitiesLookup = {};
    let facilitiesResponse;
    let vaAppointments = [];
    let ccAppointments = [];
    let vaAppointmentsResponse;
    let ccAppointmentsResponse;

    const startOfToday = moment()
      .startOf('day')
      .toISOString();

    // Maximum number of days you can schedule an appointment in advance in VAOS
    const endDate = moment()
      .add(395, 'days')
      .startOf('day')
      .toISOString();

    try {
      if (environment.isLocalhost() && !window.Cypress) {
        vaAppointments = MOCK_VA_APPOINTMENTS;
        ccAppointments = MOCK_CC_APPOINTMENTS;
      } else {
        vaAppointmentsResponse = await apiRequest(
          `/appointments?start_date=${startOfToday}&end_date=${endDate}&type=va`,
          { apiVersion: 'vaos/v0' },
        );
        ccAppointmentsResponse = await apiRequest(
          `/appointments?start_date=${startOfToday}&end_date=${endDate}&type=cc`,
          { apiVersion: 'vaos/v0' },
        );

        // This catches partial errors on the meta object
        if (
          vaAppointmentsResponse?.meta?.errors?.length > 0 ||
          ccAppointmentsResponse?.meta?.errors?.length > 0
        ) {
          dispatch({
            type: FETCH_CONFIRMED_FUTURE_APPOINTMENTS_FAILED,
            errors: [
              ...(vaAppointmentsResponse?.meta?.errors || []),
              ...(ccAppointmentsResponse?.meta?.errors || []),
            ],
          });
          return;
        }

        vaAppointments = vaAppointmentsResponse?.data;
        ccAppointments = ccAppointmentsResponse?.data;
      }

      const facilityIDs = uniq(
        vaAppointments?.map(
          appointment =>
            getStagingID(appointment?.attributes?.sta6aid)
              ? `vha_${getStagingID(appointment?.attributes?.sta6aid)}`
              : undefined,
        ),
      );

      if (environment.isLocalhost() && !window.Cypress) {
        facilitiesResponse = MOCK_FACILITIES;
      } else {
        facilitiesResponse = await apiRequest(
          `/facilities/va?ids=${facilityIDs.join(',')}`,
          { apiVersion: 'v1' },
        );
      }

      facilitiesLookup = facilitiesResponse?.data?.reduce(
        (lookup, facility) => {
          const facilityID = replace(facility?.id, 'vha_', '');
          // eslint-disable-next-line no-param-reassign
          lookup[facilityID] = facility;
          return lookup;
        },
        {},
      );
    } catch (error) {
      dispatch({
        type: FETCH_CONFIRMED_FUTURE_APPOINTMENTS_FAILED,
        errors: [
          ...(vaAppointmentsResponse?.errors || []),
          ...(ccAppointmentsResponse?.errors || []),
          ...(facilitiesResponse?.data?.errors || []),
        ],
      });
    }

    const formattedVAAppointments = vaAppointments?.reduce(
      (accumulator, appointment) => {
        const startDate = moment(appointment?.attributes?.startDate);
        const now = moment();
        const appointmentStatus =
          appointment?.attributes?.vdsAppointments?.[0]?.currentStatus;

        // Past appointments should be filtered out already on the api side, this is a safe guard.
        if (startDate.isBefore(now)) {
          return accumulator;
        }

        // Hide cancelled or no-show appointments
        if (FUTURE_APPOINTMENTS_HIDDEN_SET.has(appointmentStatus)) {
          return accumulator;
        }

        // Derive the facility.
        const facility =
          facilitiesLookup[getStagingID(appointment?.attributes?.facilityId)];

        accumulator.push({
          additionalInfo: getAdditionalInfo(appointment),
          facility,
          id: appointment?.id,
          isVideo: !isEmpty(appointment?.attributes?.vvsAppointments),
          providerName: facility?.attributes?.name,
          startsAt: startDate.toISOString(),
          type: 'va',
          timeZone: getVATimeZone(
            getStagingID(appointment?.attributes?.facilityId),
          ),
        });

        return accumulator;
      },
      [],
    );

    const formattedCCAppointments = ccAppointments?.reduce(
      (accumulator, appointment) => {
        const startDate = moment(appointment?.attributes?.appointmentTime);
        const now = moment();

        // Escape early if the appointment is in the past.
        if (startDate.isBefore(now)) {
          return accumulator;
        }

        accumulator.push({
          additionalInfo: getAdditionalInfo(appointment),
          id: appointment?.id,
          isVideo: false,
          providerName: appointment?.attributes?.providerPractice,
          startsAt: startDate.toISOString(),
          timeZone: getCCTimeZone(appointment),
          type: 'cc',
        });

        return accumulator;
      },
      [],
    );

    const allAppointments = [
      ...(formattedCCAppointments || []),
      ...(formattedVAAppointments || []),
    ];

    // Sort the appointments by which is soonest.
    const sortedAppointments = allAppointments.sort((a, b) => {
      return moment(a.startsAt).diff(b.startsAt);
    });

    dispatch({
      type: FETCH_CONFIRMED_FUTURE_APPOINTMENTS_SUCCEEDED,
      appointments: sortedAppointments,
    });
  };
}
