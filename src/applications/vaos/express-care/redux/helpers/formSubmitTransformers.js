import moment from 'moment';
import { EXPRESS_CARE } from '../../../utils/constants';
import { selectExpressCareFormData } from '../selectors';

// express-care
export function transformFormToExpressCareRequest(state, facility) {
  const data = selectExpressCareFormData(state);
  const { facilityId, siteId, name } = facility;

  return {
    typeOfCare: EXPRESS_CARE,
    typeOfCareId: EXPRESS_CARE,
    appointmentType: 'Express Care',
    facility: {
      name,
      facilityCode: facilityId,
      parentSiteCode: siteId,
    },
    reasonForVisit: data.reason,
    additionalInformation: data.additionalInformation,
    phoneNumber: data.contactInfo.phoneNumber,
    verifyPhoneNumber: data.contactInfo.phoneNumber,
    emailPreferences: {
      emailAddress: data.email,
      // defaulted values
      notificationFrequency: 'Each new message',
      emailAllowed: true,
      textMsgAllowed: false,
      textMsgPhNumber: '',
    },
    email: data.contactInfo.email,
    // defaulted values
    status: 'Submitted',
    purposeOfVisit: 'Express Care Request',
    visitType: 'Express Care',
    optionDate1: moment().format('MM/DD/YYYY'),
    optionTime1: 'No Time Selected',
    optionDate2: 'No Date Selected',
    optionTime2: 'No Time Selected',
    optionDate3: 'No Date Selected',
    optionTime3: 'No Time Selected',
    schedulingMethod: 'clerk',
    requestedPhoneCall: false,
    providerId: '0',
    providerOption: '',
    // The bad camel casing here is intentional, to match downstream
    // system
    bestTimetoCall: ['Morning', 'Afternoon', 'Evening'],
  };
}
