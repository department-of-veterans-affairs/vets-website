import moment from 'moment';
import titleCase from 'platform/utilities/data/titleCase';
import { PURPOSE_TEXT, TYPE_OF_VISIT, LANGUAGES } from './constants';
import {
  getTypeOfCare,
  getSystems,
  getFormData,
  getChosenClinicInfo,
  getChosenFacilityInfo,
} from './selectors';
import { selectVet360ResidentialAddress } from 'platform/user/selectors';

function getRequestedDates(data) {
  return data.calendarData.selectedDates.reduce(
    (acc, { date, optionTime }, index) => ({
      ...acc,
      [`optionDate${index + 1}`]: moment(date).format('MM/DD/YYYY'),
      [`optionTime${index + 1}`]: optionTime,
    }),
    {
      optionDate1: 'No Date Selected',
      optionDate2: 'No Date Selected',
      optionDate3: 'No Date Selected',
      optionTime1: 'No Time Selected',
      optionTime2: 'No Time Selected',
      optionTime3: 'No Time Selected',
    },
  );
}

function getUserMessage(data) {
  const label = PURPOSE_TEXT.find(
    purpose => purpose.id === data.reasonForAppointment,
  ).short;

  return `${label}: ${data.reasonAdditionalInfo}`;
}

export function transformFormToVARequest(state) {
  const facility = getChosenFacilityInfo(state);
  const data = getFormData(state);

  return {
    typeOfCare: data.typeOfCareId,
    typeOfCareId: data.typeOfCareId,
    appointmentType: getTypeOfCare(data).name,
    cityState: {
      institutionCode: data.vaSystem,
      rootStationCode: data.vaSystem,
      parentStationCode: data.vaSystem,
      adminParent: true,
    },
    facility: {
      name: facility.authoritativeName,
      facilityCode: data.vaFacility,
      parentSiteCode: data.vaSystem,
    },
    purposeOfVisit: PURPOSE_TEXT.find(
      purpose => purpose.id === data.reasonForAppointment,
    )?.serviceName,
    visitType: TYPE_OF_VISIT.find(type => type.id === data.visitType)
      ?.serviceName,
    phoneNumber: data.phoneNumber,
    verifyPhoneNumber: data.phoneNumber,
    ...getRequestedDates(data),
    // The bad camel casing here is intentional, to match downstream
    // system
    bestTimetoCall: Object.entries(data.bestTimeToCall)
      .filter(item => item[1])
      .map(item => titleCase(item[0])),
    emailPreferences: {
      emailAddress: data.email,
      // defaulted values
      notificationFrequency: 'Each new message',
      emailAllowed: true,
      textMsgAllowed: false,
      textMsgPhNumber: '',
    },
    email: data.email,
    // defaulted values
    status: 'Submitted',
    schedulingMethod: 'clerk',
    requestedPhoneCall: false,
    providerId: '0',
    providerOption: '',
  };
}

export function transformFormToCCRequest(state) {
  const data = getFormData(state);
  const preferredProviders = data.hasCommunityCareProvider
    ? [
        {
          address: {
            city: '',
            state: '',
            street: '',
            zipCode: data.communityCareProvider.address.postalCode,
          },
          firstName: data.communityCareProvider.firstName,
          lastName: data.communityCareProvider.lastName,
          practiceName: data.communityCareProvider.practiceName,
          providerStreet: `${data.communityCareProvider.address.street}, ${
            data.communityCareProvider.address.street2
          }`,
          providerCity: data.communityCareProvider.address.city,
          providerState: data.communityCareProvider.address.state,
          providerZipCode1: data.communityCareProvider.address.postalCode,
        },
      ]
    : [];
  const residentialAddress = selectVet360ResidentialAddress(state);
  const system = getSystems(state).find(
    sys => sys.institutionCode === data.communityCareSystemId,
  );
  let cityState;

  if (
    residentialAddress &&
    residentialAddress.addressType !== 'MILITARY OVERSEAS'
  ) {
    cityState = {
      preferredCity: residentialAddress.city,
      preferredState: residentialAddress.stateCode,
    };
  } else {
    cityState = {
      preferredCity: system.city,
      preferredState: system.stateAbbrev,
    };
  }

  return {
    typeOfCare: getTypeOfCare(data).ccId,
    typeOfCareId: getTypeOfCare(data).ccId,
    appointmentType: getTypeOfCare(data).name,
    cityState: {
      institutionCode: data.communityCareSystemId,
      rootStationCode: data.communityCareSystemId,
      parentStationCode: data.communityCareSystemId,
      adminParent: true,
    },
    facility: {
      name: system.authoritativeName,
      facilityCode: data.communityCareSystemId,
      parentSiteCode: data.communityCareSystemId,
    },
    purposeOfVisit: PURPOSE_TEXT.find(
      purpose => purpose.id === data.reasonForAppointment,
    )?.id,
    phoneNumber: data.phoneNumber,
    verifyPhoneNumber: data.phoneNumber,
    // The bad camel casing here is intentional, to match downstream
    // system
    bestTimetoCall: Object.entries(data.bestTimeToCall)
      .filter(item => item[1])
      .map(item => titleCase(item[0])),
    preferredProviders,
    newMessage: data.reasonAdditionalInfo,
    preferredLanguage: LANGUAGES.find(
      lang => lang.id === data.preferredLanguage,
    )?.value,
    ...getRequestedDates(data),
    ...cityState,
    // defaulted values
    requestedPhoneCall: false,
    email: data.email,
    officeHours: [],
    reasonForVisit: '',
    distanceWillingToTravel: 40,
    secondRequest: false,
    secondRequestSubmitted: false,
    inpatient: false,
    status: 'Submitted',
    providerId: '0',
    providerOption: '',
  };
}

export function transformFormToAppointment(state) {
  const data = getFormData(state);
  const clinic = getChosenClinicInfo(state);
  const facility = getChosenFacilityInfo(state);
  const slot = data.calendarData.selectedDates[0];
  const purpose = getUserMessage(data);
  const appointmentLength = parseInt(
    state.newAppointment.appointmentLength,
    10,
  );

  return {
    clinic,
    direct: {
      purpose,
      desiredDate: moment(slot.date, 'YYYY-MM-DD').format(
        'MM/DD/YYYY [00:00:00]',
      ),
      dateTime: moment(slot.datetime).format('MM/DD/YYYY HH:mm:ss'),
      apptLength: appointmentLength,
    },
    // These times are a lie, they're actually in local time, but the upstream
    // service expects the 0 offset.
    desiredDate: `${slot.date}T00:00:00+00:00`,
    dateTime: moment(slot.datetime).format('YYYY-MM-DD[T]HH:mm:ss[+00:00]'),
    duration: appointmentLength,
    bookingNotes: purpose,
    patients: {
      patient: [
        {
          contactInformation: {
            preferredEmail: data.email,
            timeZone: facility.institutionTimezone,
          },
          location: {
            type: 'VA',
            facility: {
              name: facility.name,
              siteCode: facility.rootStationCode,
              timeZone: facility.institutionTimezone,
            },
            clinic: {
              ien: clinic.clinicId,
              name: clinic.clinicName,
            },
          },
        },
      ],
    },
    // defaulted values
    apptType: 'P',
    purpose: '9',
    lvl: '1',
    ekg: '',
    lab: '',
    xRay: '',
    schedulingRequestType: 'NEXT_AVAILABLE_APPT',
    type: 'REGULAR',
    appointmentKind: 'TRADITIONAL',
    schedulingMethod: 'direct',
    providers: {
      provider: [
        {
          location: {
            type: 'VA',
          },
        },
      ],
    },
  };
}

export function createPreferenceBody(preferences, data) {
  return {
    ...preferences,
    emailAddress: data.email,
    notificationFrequency: 'Each new message',
    emailAllowed: true,
  };
}

export function createMessageBody(id, { data }) {
  return {
    AppointmentRequestId: id,
    messageText: getUserMessage(data),
    isLastMessage: true,
    messageDateTime: '',
    messageSent: true,
  };
}
