import moment from 'moment';
import titleCase from 'platform/utilities/data/titleCase';
import { PURPOSE_TEXT, TYPE_OF_VISIT, LANGUAGES } from './constants';
import {
  getTypeOfCare,
  getSystems,
  getFormData,
  getChosenClinicInfo,
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

  return `${label} - ${data.reasonAdditionalInfo}`;
}

export function transformFormToVARequest({ data }) {
  return {
    typeOfCare: data.typeOfCareId,
    typeOfCareId: data.typeOfCareId,
    cityState: {
      institutionCode: data.vaSystem,
      rootStationCode: data.vaSystem,
      parentStationCode: data.vaSystem,
      adminParent: true,
    },
    facility: {
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
    bestTimeToCall: Object.entries(data.bestTimeToCall)
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
    schedulingMethod: 'clerk',
    requestedPhoneCall: false,
    providerId: '0',
    pproviderOption: '',
  };
}

export function transformFormToCCRequest(state) {
  const data = state.newAppointment.data;
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
    cityState: {
      institutionCode: data.communityCareSystemId,
      rootStationCode: data.communityCareSystemId,
      parentStationCode: data.communityCareSystemId,
      adminParent: true,
    },
    facility: {
      facilityCode: data.communityCareSystemId,
      parentSiteCode: data.communityCareSystemId,
    },
    purposeOfVisit: PURPOSE_TEXT.find(
      purpose => purpose.id === data.reasonForAppointment,
    )?.id,
    phoneNumber: data.phoneNumber,
    verifyPhoneNumber: data.phoneNumber,
    bestTimeToCall: Object.entries(data.bestTimeToCall)
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
    pproviderOption: '',
  };
}

export function transformFormToAppointment(state) {
  const data = getFormData(state);
  const clinic = getChosenClinicInfo(state);

  return {
    clinic,
    direct: {
      purpose: getUserMessage(data),
    },
    bookingNotes: getUserMessage(data),
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
