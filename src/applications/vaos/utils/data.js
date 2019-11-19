import moment from 'moment';
import titleCase from 'platform/utilities/data/titleCase';
import { PURPOSE_TEXT, TYPE_OF_VISIT, LANGUAGES } from './constants';
import { getTypeOfCare, getChosenFacilityInfo } from './selectors';
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
  const facility = getChosenFacilityInfo(state);
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
      preferredCity: facility.city,
      preferredState: facility.stateAbbrev,
    };
  }

  return {
    typeOfCare: getTypeOfCare(data).ccId,
    typeOfCareId: getTypeOfCare(data).ccId,
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
    )?.id,
    visitType: TYPE_OF_VISIT.find(type => type.id === data.visitType)
      ?.serviceName,
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

export function createPreferenceBody(preferences, data) {
  return {
    ...preferences,
    emailAddress: data.email,
    notificationFrequency: 'Each new message',
    emailAllowed: true,
  };
}

export function createMessageBody(id, { data }) {
  const label = PURPOSE_TEXT.find(
    purpose => purpose.id === data.reasonForAppointment,
  ).short;

  return {
    AppointmentRequestId: id,
    messageText: `${label} - ${data.reasonAdditionalInfo}`,
    isLastMessage: true,
    messageDateTime: '',
    messageSent: true,
  };
}
