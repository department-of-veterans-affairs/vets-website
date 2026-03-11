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
import partDCardUpload from './partDCardUpload';
import partDEffectiveDate from './partDEffectiveDate';
import partDStatus from './partDStatus';
import planTypes from './planTypes';
import reportPlans from './reportPlans';

export const medicarePages = {
  medicareOverview: {
    path: 'medicare-overview',
    title: 'Report Medicare',
    ...overview,
  },
  reportMedicare: {
    path: 'report-medicare-plan',
    title: 'Report Medicare plan',
    ...reportPlans,
  },
  medicarePlanType: {
    path: 'medicare-plan-type',
    title: 'Medicare plan type',
    depends: hasMedicare,
    ...planTypes,
  },
  medicareBeneficiaryIdentifier: {
    path: 'medicare-beneficiary-identifier',
    title: 'Medicare beneficiary identifier',
    depends: hasMedicare,
    ...mbiNumber,
  },
  medicarePartAEffectiveDate: {
    path: 'medicare-part-a-effective-date',
    title: 'Medicare Part A effective date',
    depends: hasPartA,
    ...partAEffectiveDates,
  },
  medicarePartACardUpload: {
    path: 'medicare-part-a-card',
    title: 'Medicare Part A card',
    depends: hasPartA,
    ...partACardUpload,
  },
  medicarePartBEffectiveDate: {
    path: 'medicare-part-b-effective-date',
    title: 'Medicare Part B effective date',
    depends: hasPartB,
    ...partBEffectiveDates,
  },
  medicarePartBCardUpload: {
    path: 'medicare-part-b-card',
    title: 'Medicare Part B card',
    depends: hasPartB,
    ...partBCardUpload,
  },
  medicarePartADenial: {
    path: 'medicare-part-a-denial-notice',
    title: 'Medicare Part A denial notice',
    depends: needsPartADenialNotice,
    ...partADenialNotice,
  },
  medicarePartADenialProofUpload: {
    path: 'medicare-proof-of-part-a-denial',
    title: 'Proof of Medicare ineligibility',
    depends: hasPartADenialNotice,
    ...partADenialProofUpload,
  },
  medicarePartAPartBEffectiveDates: {
    path: 'medicare-parts-a-and-b-effective-dates',
    title: 'Medicare Parts A & B effective dates',
    depends: hasPartsABorC,
    ...partAPartBEffectiveDates,
  },
  medicareABCardUpload: {
    path: 'medicare-parts-a-and-b-card',
    title: 'Medicare Parts A & B card',
    depends: hasPartsABorC,
    ...partAPartBCardUpload,
  },
  medicarePartCCarrierEffectiveDate: {
    path: 'medicare-part-c-carrier-and-effective-date',
    title: 'Medicare Part C carrier and effective date',
    depends: hasPartC,
    ...partCEffectiveDate,
  },
  medicarePartCCardUpload: {
    path: 'medicare-part-c-card',
    title: 'Medicare Part C card',
    depends: hasPartC,
    ...partCCardUpload,
  },
  medicarePartDStatus: {
    path: 'medicare-part-d-status',
    title: 'Medicare Part D status',
    depends: hasMedicare,
    ...partDStatus,
  },
  medicarePartDCarrierEffectiveDate: {
    path: 'medicare-part-d-carrier-and-effective-date',
    title: 'Medicare Part D carrier and effective date',
    depends: hasPartD,
    ...partDEffectiveDate,
  },
  medicarePartDCardUpload: {
    path: 'medicare-part-d-card',
    title: 'Medicare Part D card',
    depends: hasPartD,
    ...partDCardUpload,
  },
};
