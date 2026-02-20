import {
  HAS_OTHER_EVIDENCE,
  HAS_PRIVATE_LIMITATION,
  SUPPORTED_BENEFIT_TYPES_LIST,
} from '../constants';
import {
  getHomeless,
  getAddress,
  getClaimantData,
  getEmail,
  getEvidence,
  getForm4142,
  getMstData,
} from '../utils/submit';
import {
  getPhone,
  addIncludedIssues,
  getTimeZone,
} from '../../shared/utils/submit';
import { getFacilityType } from '../utils/submit/facilities';

export function transform(form) {
  // https://developer.va.gov/explore/appeals/docs/decision_reviews?version=current
  // match supplemental claims schema here
  const mainTransform = formData => {
    const {
      additionalDocuments,
      benefitType,
      limitedConsent,
      privacyAgreementAccepted,
      privateEvidence,
      scRedesign,
      vaEvidence,
    } = formData;

    const lcPrompt = formData[HAS_PRIVATE_LIMITATION];

    if (scRedesign) {
      const attributes = {
        // fall back to compensation; this will fix a few existing submission
        // with "other" benefit type set that are being rejected
        benefitType: SUPPORTED_BENEFIT_TYPES_LIST.includes(benefitType)
          ? benefitType
          : 'compensation',
        ...getClaimantData(formData),
        ...getHomeless(formData),
        ...getMstData(formData),
        veteran: {
          timezone: getTimeZone(),
          address: getAddress(formData),
          phone: getPhone(formData, true),
          email: getEmail(formData),
        },
        form5103Acknowledged: formData.form5103Acknowledged,
        ...getFacilityType(formData),
        socOptIn: true, // OAR requested no checkbox
      };

      if (vaEvidence && vaEvidence?.length) {
        attributes.vaEvidence = vaEvidence;
      }

      const dataToSend = {
        scRedesign: true,
        data: {
          type: 'supplementalClaim',
          attributes,
        },
        form4142: null,
        included: addIncludedIssues(formData),
        additionalDocuments:
          additionalDocuments && additionalDocuments?.length
            ? additionalDocuments
            : null,
      };

      if (privateEvidence && privateEvidence?.length) {
        dataToSend.form4142 = {
          evidenceEntries: privateEvidence,
          authorization: privacyAgreementAccepted,
          lcPrompt,
        };
      }

      if (lcPrompt) {
        dataToSend.form4142 = {
          ...dataToSend.form4142,
          lcDetails: limitedConsent,
        };
      }

      return dataToSend;
    }

    // Old data formatting
    return {
      data: {
        type: 'supplementalClaim',
        attributes: {
          // fall back to compensation; this will fix a few existing submission
          // with "other" benefit type set that are being rejected
          benefitType: SUPPORTED_BENEFIT_TYPES_LIST.includes(benefitType)
            ? benefitType
            : 'compensation',
          ...getClaimantData(formData),
          ...getHomeless(formData),
          ...getMstData(formData),
          veteran: {
            timezone: getTimeZone(),
            address: getAddress(formData),
            phone: getPhone(formData, true),
            email: getEmail(formData),
          },
          ...getEvidence(formData),
          socOptIn: true, // OAR requested no checkbox
        },
      },
      included: addIncludedIssues(formData),
      form4142: getForm4142(formData),
      additionalDocuments: formData[HAS_OTHER_EVIDENCE]
        ? additionalDocuments
        : null,
    };
  };

  // Not using _.cloneDeep on form data - it appears to replace `null` values
  // with an empty object; and causes submission errors due to type mismatch
  const transformedData = mainTransform(form.data);
  return JSON.stringify(transformedData);
}
