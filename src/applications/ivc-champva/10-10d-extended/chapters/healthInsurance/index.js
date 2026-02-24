import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import addtlComments from './addtlComments';
import cardUpload from './cardUpload';
import employer from './employer';
import medigap from './medigap';
import participants from './participants';
import planTypes from './planTypes';
import prescriptions from './prescriptions';
import provider from './provider';
import sectionOverview from './sectionOverview';
import summary, { ohiArrayOptions } from './summary';
import content from '../../locales/en/content.json';

const isMedigap = (formData, index) =>
  formData.healthInsurance?.[index]?.insuranceType === 'medigap';

export const healthInsurancePages = {
  ohiOverview: {
    path: 'report-other-health-insurance',
    title: content['health-insurance--summary-title--review'],
    ...sectionOverview,
  },
  ...arrayBuilderPages(ohiArrayOptions, pageBuilder => ({
    ohiSummary: pageBuilder.summaryPage({
      path: 'other-health-insurance-plans',
      title: content['health-insurance--summary-title--review'],
      uiSchema: summary.uiSchema,
      schema: summary.schema,
    }),
    ohiPlanType: pageBuilder.itemPage({
      path: 'health-insurance-plan-type/:index',
      title: content['health-insurance--plan-type-title'],
      ...planTypes,
    }),
    ohiMedigapType: pageBuilder.itemPage({
      path: 'health-insurance-medigap-information/:index',
      title: content['health-insurance--medigap-title'],
      depends: isMedigap,
      ...medigap,
    }),
    ohiProvider: pageBuilder.itemPage({
      path: 'health-insurance-provider-information/:index',
      title: content['health-insurance--provider-title'],
      ...provider,
    }),
    ohiThroughEmployer: pageBuilder.itemPage({
      path: 'health-insurance-employer-sponsorship/:index',
      title: content['health-insurance--employer-title--review'],
      ...employer,
    }),
    ohiPrescriptionCoverage: pageBuilder.itemPage({
      path: 'health-insurance-prescription-coverage/:index',
      title: content['health-insurance--prescription-title--review'],
      ...prescriptions,
    }),
    ohiComments: pageBuilder.itemPage({
      path: 'health-insurance-additional-comments/:index',
      title: content['health-insurance--addtl-comments-title--review'],
      ...addtlComments,
    }),
    ohiParticipants: pageBuilder.itemPage({
      path: 'health-insurance-participants/:index',
      title: content['health-insurance--participant-title--review'],
      ...participants,
    }),
    ohiCard: pageBuilder.itemPage({
      path: 'health-insurance-card/:index',
      title: content['health-insurance--card-upload-title--review'],
      ...cardUpload,
    }),
  })),
};
