import sharedTransformForSubmit from '../../shared/config/submit-transformer';
import {
  applicationInfoFields,
  vehicleReceiptFields,
  veteranFields,
} from '../definitions/constants';

const stringOrUndefined = value => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length ? trimmed : undefined;
  }
  return undefined;
};

const pruneEmpty = value => {
  if (Array.isArray(value)) {
    const pruned = value
      .map(item => pruneEmpty(item))
      .filter(item => item != null && item !== '');
    return pruned.length ? pruned : undefined;
  }
  if (value && typeof value === 'object') {
    const pruned = Object.entries(value).reduce((acc, [k, v]) => {
      const p = pruneEmpty(v);
      if (p !== undefined) acc[k] = p;
      return acc;
    }, {});
    return Object.keys(pruned).length ? pruned : undefined;
  }
  if (value === undefined || value === null || value === '') return undefined;
  return value;
};

const buildAddress = address => {
  if (!address || typeof address !== 'object') return undefined;
  const result = {
    street: stringOrUndefined(address.street),
    street2: stringOrUndefined(address.street2),
    city: stringOrUndefined(address.city),
    state: stringOrUndefined(address.state),
    postalCode: stringOrUndefined(address.postalCode),
    country: stringOrUndefined(address.country) || 'US',
  };
  return pruneEmpty(result);
};

const buildFullName = fullName => {
  if (!fullName || typeof fullName !== 'object') return undefined;
  return pruneEmpty({
    first: stringOrUndefined(fullName.first),
    middle: stringOrUndefined(fullName.middle),
    last: stringOrUndefined(fullName.last),
  });
};

const formatPhone = phone => {
  if (phone == null) return undefined;
  if (typeof phone === 'string') return stringOrUndefined(phone);
  if (typeof phone === 'object' && phone.contact)
    return stringOrUndefined(String(phone.contact));
  return undefined;
};

const buildSubmissionPayload = data => {
  const veteran = data?.veteran || {};
  const applicationInfo = data?.applicationInfo || {};
  const vehicleReceipt = data?.vehicleReceipt || {};

  const payload = {
    veteranFullName: buildFullName(veteran.fullName),
    veteranSocialSecurityNumber: stringOrUndefined(veteran.ssn),
    vaFileNumber: stringOrUndefined(veteran.vaFileNumber),
    veteranServiceNumber: stringOrUndefined(veteran.veteranServiceNumber),
    dateOfBirth: stringOrUndefined(veteran.dateOfBirth),
    veteranAddress: buildAddress(veteran.address),
    plannedAddress: buildAddress(veteran.plannedAddress),
    email: stringOrUndefined(veteran.email),
    agreeToElectronicCorrespondence:
      veteran[veteranFields.agreeToElectronicCorrespondence],
    veteranPhone: formatPhone(veteran.homePhone),
    alternatePhone: formatPhone(veteran.alternatePhone),
    branchOfService: stringOrUndefined(
      applicationInfo[applicationInfoFields.branchOfService],
    ),
    activeDutyStatus: applicationInfo[applicationInfoFields.activeDutyStatus],
    placeOfEntry: stringOrUndefined(
      applicationInfo[applicationInfoFields.placeOfEntry],
    ),
    dateOfEntry: stringOrUndefined(
      applicationInfo[applicationInfoFields.dateOfEntry],
    ),
    placeOfRelease: stringOrUndefined(
      applicationInfo[applicationInfoFields.placeOfRelease],
    ),
    dateOfRelease: stringOrUndefined(
      applicationInfo[applicationInfoFields.dateOfRelease],
    ),
    vaOfficeLocation: stringOrUndefined(
      applicationInfo[applicationInfoFields.vaOfficeLocation],
    ),
    conveyanceType: stringOrUndefined(
      applicationInfo[applicationInfoFields.conveyanceType],
    ),
    conveyanceTypeOther: stringOrUndefined(
      applicationInfo[applicationInfoFields.conveyanceTypeOther],
    ),
    previouslyAppliedConveyance:
      applicationInfo[applicationInfoFields.previouslyAppliedConveyance],
    previouslyAppliedPlace: stringOrUndefined(
      applicationInfo[applicationInfoFields.previouslyAppliedPlace],
    ),
    previouslyAppliedDate: stringOrUndefined(
      applicationInfo[applicationInfoFields.previouslyAppliedDate],
    ),
    appliedDisabilityCompensation:
      applicationInfo[applicationInfoFields.appliedDisabilityCompensation],
    appliedDisabilityCompensationPlace: stringOrUndefined(
      applicationInfo[applicationInfoFields.appliedDisabilityCompensationPlace],
    ),
    dateApplied: stringOrUndefined(
      applicationInfo[applicationInfoFields.dateApplied],
    ),
    certifyLicensing: data?.certifyLicensing,
    certifyNoPriorGrant: data?.certifyNoPriorGrant,
    vehicleMake: stringOrUndefined(vehicleReceipt[vehicleReceiptFields.make]),
    vehicleModel: stringOrUndefined(vehicleReceipt[vehicleReceiptFields.model]),
    vehicleYear: stringOrUndefined(vehicleReceipt[vehicleReceiptFields.year]),
    vehicleVin: stringOrUndefined(vehicleReceipt[vehicleReceiptFields.vin]),
    purchasePrice: stringOrUndefined(
      vehicleReceipt[vehicleReceiptFields.purchasePrice],
    ),
    dateOfSale: stringOrUndefined(
      vehicleReceipt[vehicleReceiptFields.dateOfSale],
    ),
    sellerName: stringOrUndefined(
      vehicleReceipt[vehicleReceiptFields.sellerName],
    ),
    sellerAddress: buildAddress(
      vehicleReceipt[vehicleReceiptFields.sellerAddress],
    ),
    hasDriversLicense: vehicleReceipt[vehicleReceiptFields.hasDriversLicense],
  };

  return pruneEmpty(payload) || {};
};

export default function transformForSubmit(formConfig, form) {
  const transformed = JSON.parse(
    sharedTransformForSubmit(formConfig, form, {
      allowPartialAddress: true,
    }),
  );

  const { formNumber, ...formData } = transformed;
  const payload = buildSubmissionPayload(formData);
  const stringifiedPayload = JSON.stringify(payload);

  return JSON.stringify({
    formNumber,
    // API contract requires this snake_case key
    // eslint-disable-next-line camelcase
    automobile_adaptive_claim: {
      form: stringifiedPayload,
    },
  });
}
