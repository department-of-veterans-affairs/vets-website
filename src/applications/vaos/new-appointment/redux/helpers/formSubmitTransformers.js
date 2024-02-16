import moment from 'moment';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import titleCase from 'platform/utilities/data/titleCase';
import { selectVAPResidentialAddress } from 'platform/user/selectors';
import { getTimezoneByFacilityId } from '../../../utils/timezone';
import {
  PURPOSE_TEXT_V2,
  TYPE_OF_VISIT,
  LANGUAGES,
} from '../../../utils/constants';
import {
  getTypeOfCare,
  getFormData,
  getChosenClinicInfo,
  getChosenFacilityInfo,
  getSiteIdForChosenFacility,
  getChosenCCSystemById,
  getChosenSlot,
} from '../selectors';
import { getClinicId, getSiteCode } from '../../../services/healthcare-service';

const CC_PURPOSE = 'other';

function getUserMessage(data) {
  const label = PURPOSE_TEXT_V2.find(
    purpose => purpose.id === data.reasonForAppointment,
  ).short;

  return `${label}: ${data.reasonAdditionalInfo}`;
}

function getTestFacilityName(id, name) {
  if (!environment.isProduction() && id.startsWith('983')) {
    return `CHYSHR-${name}`;
  }

  if (!environment.isProduction() && id.startsWith('984')) {
    // The extra space here is intentional, that appears to be how it is named
    // in CDW
    return `DAYTSHR -${name}`;
  }

  return name;
}

function getRequestedDates(data) {
  return data.selectedDates.reduce(
    (acc, date, index) => ({
      ...acc,
      [`optionDate${index + 1}`]: moment(date).format('MM/DD/YYYY'),
      [`optionTime${index + 1}`]: moment(date).hour() >= 12 ? 'PM' : 'AM',
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

export function transformFormToVARequest(state) {
  const facility = getChosenFacilityInfo(state);
  const data = getFormData(state);
  const typeOfCare = getTypeOfCare(data);
  const siteId = getSiteIdForChosenFacility(state);
  const facilityId = facility.id;
  const facilityName = getTestFacilityName(facilityId, facility.name);

  return {
    typeOfCare: typeOfCare.id,
    typeOfCareId: typeOfCare.id,
    appointmentType: typeOfCare.name,
    facility: {
      name: facilityName,
      facilityCode: facilityId,
      parentSiteCode: siteId,
    },
    purposeOfVisit: PURPOSE_TEXT_V2.find(
      purpose => purpose.id === data.reasonForAppointment,
    )?.serviceName,
    otherPurposeOfVisit:
      data.reasonForAppointment === 'other'
        ? 'See additional information'
        : null,
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
  const provider = data.communityCareProvider;
  let preferredProviders = [];

  if (
    !!data.communityCareProvider &&
    Object.keys(data.communityCareProvider).length
  ) {
    preferredProviders = [
      {
        address: {
          street: provider.address.line.join(', '),
          city: provider.address.city,
          state: provider.address.state,
          zipCode: provider.address.postalCode,
        },
        practiceName: provider.name,
      },
    ];
  }

  const residentialAddress = selectVAPResidentialAddress(state);
  const organization = getChosenCCSystemById(state);
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
      preferredCity: organization.address?.city,
      preferredState: organization.address?.state,
    };
  }

  const typeOfCare = getTypeOfCare(data);

  return {
    typeOfCare: typeOfCare.ccId,
    typeOfCareId: typeOfCare.ccId,
    appointmentType: typeOfCare.name,
    facility: {
      name: organization.name,
      facilityCode: organization.id,
      parentSiteCode: organization.vistaId,
    },
    purposeOfVisit: CC_PURPOSE,
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
  const timezone = getTimezoneByFacilityId(data.vaFacility);

  const slot = getChosenSlot(state);
  const purpose = getUserMessage(data);
  const appointmentLength = moment(slot.end).diff(slot.start, 'minutes');
  return {
    appointmentType: getTypeOfCare(data).name,
    clinic: {
      siteCode: getSiteCode(clinic),
      clinicId: getClinicId(clinic),
      clinicName: clinic.serviceName,
      clinicFriendlyLocationName: clinic.serviceName,
      institutionName: clinic.stationName,
      institutionCode: clinic.stationId,
    },

    // These times are a lie, they're actually in local time, but the upstream
    // service expects the 0 offset.
    desiredDate: `${data.preferredDate}T00:00:00+00:00`,
    dateTime: `${slot.start}+00:00`,
    duration: appointmentLength,
    bookingNotes: purpose,
    preferredEmail: data.email,
    timeZone: timezone,
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
