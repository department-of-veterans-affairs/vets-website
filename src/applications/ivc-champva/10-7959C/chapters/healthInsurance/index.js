import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import additionalComments from './addtlComments';
import cardUpload from './cardUpload';
import employer from './employer';
import medigap from './medigap';
import planTypes from './planTypes';
import prescriptionCoverage from './prescriptions';
import provider from './provider';
import summary, { ohiArrayOptions } from './summary';
import content from '../../locales/en/content.json';

const isMedigap = (formData, index) =>
  formData.healthInsurance?.[index].insuranceType === 'medigap';

export const healthInsurancePages = arrayBuilderPages(
  ohiArrayOptions,
  pageBuilder => ({
    healthInsuranceSummary: pageBuilder.summaryPage({
      path: 'other-health-insurance-plans',
      title: content['health-insurance--summary-title--review'],
      ...summary,
    }),
    healthInsuranceType: pageBuilder.itemPage({
      path: 'health-insurance-plan-type/:index',
      title: content['health-insurance--plan-type-title'],
      ...planTypes,
    }),
    medigapType: pageBuilder.itemPage({
      path: 'health-insurance-medigap-information/:index',
      title: content['health-insurance--medigap-title'],
      depends: isMedigap,
      ...medigap,
    }),
    provider: pageBuilder.itemPage({
      path: 'health-insurance-provider-information/:index',
      title: content['health-insurance--provider-title'],
      ...provider,
    }),
    throughEmployer: pageBuilder.itemPage({
      path: 'health-insurance-employer-sponsorship/:index',
      title: content['health-insurance--employer-title--review'],
      ...employer,
    }),
    prescriptionCoverage: pageBuilder.itemPage({
      path: 'health-insurance-prescription-coverage/:index',
      title: content['health-insurance--prescription-title--review'],
      ...prescriptionCoverage,
    }),
    comments: pageBuilder.itemPage({
      path: 'health-insurance-additional-comments/:index',
      title: content['health-insurance--addtl-comments-title--review'],
      ...additionalComments,
    }),
    insuranceCard: pageBuilder.itemPage({
      path: 'health-insurance-card/:index',
      title: content['health-insurance--card-upload-title--review'],
      ...cardUpload,
    }),
  }),
);
