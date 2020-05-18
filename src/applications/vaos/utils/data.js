import moment from 'moment';
import titleCase from 'platform/utilities/data/titleCase';
import { PURPOSE_TEXT, TYPE_OF_VISIT, LANGUAGES } from './constants';
import { getSiteIdFromOrganization } from '../services/organization';
import {
  getTypeOfCare,
  getFormData,
  getChosenClinicInfo,
  getChosenFacilityInfo,
  getSiteIdForChosenFacility,
  getChosenParentInfo,
} from './selectors';
import { selectVet360ResidentialAddress } from 'platform/user/selectors';
import { getFacilityIdFromLocation } from '../services/location';

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
  const typeOfCare = getTypeOfCare(data);
  const siteId = getSiteIdForChosenFacility(state);
  const facilityId = getFacilityIdFromLocation(facility);

  return {
    typeOfCare: typeOfCare.id,
    typeOfCareId: typeOfCare.id,
    appointmentType: typeOfCare.name,
    facility: {
      name: facility.name,
      facilityCode: facilityId,
      parentSiteCode: siteId,
    },
    purposeOfVisit: PURPOSE_TEXT.find(
      purpose => purpose.id === data.reasonForAppointment,
    )?.serviceName,
    otherPurposeOfVisit:
      data.reasonForAppointment === 'other' ? 'See message' : null,
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
  let preferredProviders = [];

  if (data.hasCommunityCareProvider) {
    const street = `${data.communityCareProvider.address.street}, ${
      data.communityCareProvider.address.street2
    }`;
    preferredProviders = [
      {
        address: {
          street,
          city: data.communityCareProvider.address.city,
          state: data.communityCareProvider.address.state,
          zipCode: data.communityCareProvider.address.postalCode,
        },
        firstName: data.communityCareProvider.firstName,
        lastName: data.communityCareProvider.lastName,
        practiceName: data.communityCareProvider.practiceName,
        providerStreet: street,
        providerCity: data.communityCareProvider.address.city,
        providerState: data.communityCareProvider.address.state,
        providerZipCode1: data.communityCareProvider.address.postalCode,
      },
    ];
  }

  const residentialAddress = selectVet360ResidentialAddress(state);
  const organization = getChosenParentInfo(state, data.communityCareSystemId);
  const siteId = getSiteIdFromOrganization(organization);
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
      preferredCity: organization.address[0].city,
      preferredState: organization.address[0].state,
    };
  }

  const typeOfCare = getTypeOfCare(data);

  return {
    typeOfCare: typeOfCare.ccId,
    typeOfCareId: typeOfCare.ccId,
    appointmentType: typeOfCare.name,
    facility: {
      name: organization.name,
      facilityCode: siteId,
      parentSiteCode: siteId,
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
    visitType: 'Office Visit',
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
    appointmentType: getTypeOfCare(data).name,
    clinic,
    // These times are a lie, they're actually in local time, but the upstream
    // service expects the 0 offset.
    desiredDate: `${data.preferredDate}T00:00:00+00:00`,
    dateTime: moment(slot.datetime).format('YYYY-MM-DD[T]HH:mm:ss[+00:00]'),
    duration: appointmentLength,
    bookingNotes: purpose,
    preferredEmail: data.email,
    timeZone: facility.legacyVAR.institutionTimezone,
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
