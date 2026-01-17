import { FEATURE_TOGGLES } from '../../hooks/useDefaultFormData';
import {
  hasMedicare,
  hasPartA,
  hasPartADenialNotice,
  hasPartB,
  hasPartC,
  hasPartD,
  hasPartsABorC,
  needsPartADenialNotice,
} from '../../utils/helpers';
import mbiNumber from './mbiNumber';
import overview from './overview';
import partACardUpload from './partACardUpload';
import partADenialNotice from './partADenialNotice';
import partADenialProofUpload from './partADenialProofUpload';
import partAEffectiveDates from './partAEffectiveDates';
import partAPartBCardUpload from './partAPartBCardUpload';
import partAPartBEffectiveDates from './partAPartBEffectiveDates';
import partBCardUpload from './partBCardUpload';
import partBEffectiveDates from './partBEffectiveDates';
import partCCardUpload from './partCCardUpload';
import partCEffectiveDate from './partCEffectiveDate';
import partCPharmacyBenefits from './partCPharmacyBenefits';
import partDCardUpload from './partDCardUpload';
import partDEffectiveDate from './partDEffectiveDate';
import partDStatus from './partDStatus.rev2025';
import planTypes from './planTypes.rev2025';
import reportPlans from './reportPlans.rev2025';

const REV2025_TOGGLE_KEY = `view:${FEATURE_TOGGLES[0]}`;

export const medicarePagesRev2025 = {
  medicareOverview: {
    path: 'medicare-overview',
    title: 'Report Medicare',
    depends: formData => formData[REV2025_TOGGLE_KEY],
    ...overview,
  },
  reportMedicare: {
    path: 'report-medicare-plan',
    title: 'Report Medicare plan',
    depends: formData => formData[REV2025_TOGGLE_KEY],
    ...reportPlans,
  },
  medicarePlanType: {
    path: 'medicare-plan-type',
    title: 'Medicare plan type',
    depends: formData => formData[REV2025_TOGGLE_KEY] && hasMedicare(formData),
    ...planTypes,
  },
  medicareBeneficiaryIdentifier: {
    path: 'medicare-beneficiary-identifier',
    title: 'Medicare beneficiary identifier',
    depends: formData => formData[REV2025_TOGGLE_KEY] && hasMedicare(formData),
    ...mbiNumber,
  },
  medicarePartAEffectiveDate: {
    path: 'medicare-part-a-effective-date',
    title: 'Medicare Part A effective date',
    depends: formData => formData[REV2025_TOGGLE_KEY] && hasPartA(formData),
    ...partAEffectiveDates,
  },
  medicarePartACardUpload: {
    path: 'medicare-part-a-card',
    title: 'Upload Medicare Part A card',
    depends: formData => formData[REV2025_TOGGLE_KEY] && hasPartA(formData),
    ...partACardUpload,
  },
  medicarePartBEffectiveDate: {
    path: 'medicare-part-b-effective-date',
    title: 'Medicare Part B effective date',
    depends: formData => formData[REV2025_TOGGLE_KEY] && hasPartB(formData),
    ...partBEffectiveDates,
  },
  medicarePartBCardUpload: {
    path: 'medicare-part-b-card',
    title: 'Upload Medicare Part B card',
    depends: formData => formData[REV2025_TOGGLE_KEY] && hasPartB(formData),
    ...partBCardUpload,
  },
  medicarePartADenial: {
    path: 'medicare-part-a-denial-notice',
    title: 'Medicare Part A denial',
    depends: formData =>
      formData[REV2025_TOGGLE_KEY] && needsPartADenialNotice(formData),
    ...partADenialNotice,
  },
  medicarePartADenialProofUpload: {
    path: 'medicare-proof-of-part-a-denial',
    title: 'Upload proof of Medicare ineligibility',
    depends: formData =>
      formData[REV2025_TOGGLE_KEY] && hasPartADenialNotice(formData),
    ...partADenialProofUpload,
  },
  medicarePartAPartBEffectiveDates: {
    path: 'medicare-parts-a-and-b-effective-dates',
    title: 'Medicare effective dates',
    depends: formData =>
      formData[REV2025_TOGGLE_KEY] && hasPartsABorC(formData),
    ...partAPartBEffectiveDates,
  },
  medicareABCardUpload: {
    path: 'medicare-parts-a-and-b-card',
    title: 'Medicare card (A/B)',
    depends: formData =>
      formData[REV2025_TOGGLE_KEY] && hasPartsABorC(formData),
    ...partAPartBCardUpload,
  },
  medicarePartCCarrierEffectiveDate: {
    path: 'medicare-part-c-carrier-and-effective-date',
    title: 'Medicare Part C carrier and effective date',
    depends: formData => formData[REV2025_TOGGLE_KEY] && hasPartC(formData),
    ...partCEffectiveDate,
  },
  medicarePartCPharmacyBenefits: {
    path: 'medicare-part-c-pharmacy-benefits',
    title: 'Medicare Part C pharmacy benefits',
    depends: formData => formData[REV2025_TOGGLE_KEY] && hasPartC(formData),
    ...partCPharmacyBenefits,
  },
  medicarePartCCardUpload: {
    path: 'medicare-part-c-card',
    title: 'Medicare Part C card',
    depends: formData => formData[REV2025_TOGGLE_KEY] && hasPartC(formData),
    ...partCCardUpload,
  },
  medicarePartDStatus: {
    path: 'medicare-part-d-status',
    title: 'Medicare Part D status',
    depends: formData => formData[REV2025_TOGGLE_KEY] && hasMedicare(formData),
    ...partDStatus,
  },
  medicarePartDCarrierEffectiveDate: {
    path: 'medicare-part-d-carrier-and-effective-date',
    title: 'Medicare Part D carrier and effective date',
    depends: formData => formData[REV2025_TOGGLE_KEY] && hasPartD(formData),
    ...partDEffectiveDate,
  },
  medicarePartDCardUpload: {
    path: 'medicare-part-d-card',
    title: 'Medicare Part D card',
    depends: formData => formData[REV2025_TOGGLE_KEY] && hasPartD(formData),
    ...partDCardUpload,
  },
};
