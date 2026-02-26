import { isCustodian } from '../../utils/helpers';
import benefitType from '../../pages/benefitType';
import claimantNameDob, { nameDobTitle } from '../../pages/claimantNameDob';
import claimantIdentification, {
  identificationTitle,
} from '../../pages/claimantIdentification';
import claimantHistory, { historyTitle } from '../../pages/claimantHistory';
import claimantAddress, { addressTitle } from '../../pages/claimantAddress';
import claimantContact, { contactTitle } from '../../pages/claimantContact';

/** @type {ChapterSchema} */
export default {
  title: ({ formData }) =>
    `${isCustodian(formData) ? 'Child’s' : 'Your'} information`,
  pages: {
    claimantNameDob: {
      path: 'claimant-information',
      title: formData => nameDobTitle(formData),
      uiSchema: claimantNameDob.uiSchema,
      schema: claimantNameDob.schema,
    },
    claimantIdentification: {
      path: 'claimant-identification',
      title: formData => identificationTitle(formData),
      uiSchema: claimantIdentification.uiSchema,
      schema: claimantIdentification.schema,
    },
    claimantHistory: {
      path: 'claimant-service-history',
      title: historyTitle,
      uiSchema: claimantHistory.uiSchema,
      schema: claimantHistory.schema,
      depends: formData => !isCustodian(formData),
    },
    claimantAddress: {
      path: 'claimant-address',
      title: formData => addressTitle(formData),
      uiSchema: claimantAddress.uiSchema,
      schema: claimantAddress.schema,
    },
    claimantContact: {
      path: 'claimant-contact',
      title: formData => contactTitle(formData),
      uiSchema: claimantContact.uiSchema,
      schema: claimantContact.schema,
    },
    benefitType: {
      path: 'claimant-benefit-type',
      title: 'Benefit type',
      uiSchema: benefitType.uiSchema,
      schema: benefitType.schema,
    },
  },
};
