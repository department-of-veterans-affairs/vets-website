import moment from 'moment';
import titleCase from 'platform/utilities/data/titleCase';
import { selectVAPResidentialAddress } from 'platform/user/selectors';
import { LANGUAGES, PURPOSE_TEXT } from '../../../utils/constants';
import { getTypeOfCare, getFormData, getChosenCCSystemId } from '../selectors';

export function transformFormToVAOSCCRequest(state) {
  const data = getFormData(state);
  const provider = data.communityCareProvider;
  const residentialAddress = selectVAPResidentialAddress(state);
  const parentFacility = getChosenCCSystemId(state);
  let practitioners = [];

  if (provider?.identifier) {
    practitioners = [
      {
        id: {
          system: 'HSRM',
          value: data.communityCareProvider.identifier.find(
            item => item.system === 'PPMS',
          )?.value,
        },
      },
    ];
  }

  let preferredLocation;

  if (
    residentialAddress &&
    residentialAddress.addressType !== 'MILITARY OVERSEAS'
  ) {
    preferredLocation = {
      city: residentialAddress.city,
      state: residentialAddress.stateCode,
    };
  } else if (parentFacility.address) {
    preferredLocation = {
      city: parentFacility.address.city,
      state: parentFacility.address.state,
    };
  }

  const typeOfCare = getTypeOfCare(data);

  return {
    kind: 'cc',
    status: 'proposed',
    locationId: data.communityCareSystemId,
    // This may need to change when we get the new service type ids
    serviceType: typeOfCare.id,
    reason: data.reasonAdditionalInfo,
    contact: {
      telecom: [
        {
          type: 'phone',
          value: data.phoneNumber,
        },
        {
          type: 'email',
          value: data.email,
        },
      ],
    },
    requestedPeriods: data.selectedDates.map(date => ({
      start: moment.utc(date).format(),
      end: moment
        .utc(date)
        .add(12, 'hours')
        .subtract(1, 'minute')
        .format(),
    })),
    // These four fields aren't in the current schema, but probably should be
    preferredTimesForPhoneCall: Object.entries(data.bestTimeToCall)
      .filter(item => item[1])
      .map(item => titleCase(item[0])),
    preferredLanguage: LANGUAGES.find(
      lang => lang.id === data.preferredLanguage,
    )?.value,
    preferredLocation,
    practitioners,
  };
}

export function transformFormToVAOSVARequest(state) {
  const data = getFormData(state);
  const typeOfCare = getTypeOfCare(data);

  return {
    kind: data.visitType,
    status: 'proposed',
    locationId: data.vaFacility,
    // This may need to change when we get the new service type ids
    serviceType: typeOfCare.id,
    reason: PURPOSE_TEXT.find(
      purpose => purpose.id === data.reasonForAppointment,
    )?.serviceName,
    comment: data.reasonAdditionalInfo,
    contact: {
      telecom: [
        {
          type: 'phone',
          value: data.phoneNumber,
        },
        {
          type: 'email',
          value: data.email,
        },
      ],
    },
    requestedPeriods: data.selectedDates.map(date => ({
      start: moment.utc(date).format(),
      end: moment
        .utc(date)
        .add(12, 'hours')
        .subtract(1, 'minute')
        .format(),
    })),
    // This field isn't in the schema yet
    preferredTimesForPhoneCall: Object.entries(data.bestTimeToCall)
      .filter(item => item[1])
      .map(item => titleCase(item[0])),
  };
}
