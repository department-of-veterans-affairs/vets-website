import { blankSchema } from 'platform/forms-system/src/js/utilities/data/profile';
import claimantRelationShip from '../../pages/claimantRelationship';
import IncorrectForm from '../../containers/IncorrectForm';

/** @type {ChapterSchema} */
export default {
  title: 'Your identity',
  pages: {
    claimantRelationship: {
      path: 'claimant-relationship',
      title: 'Your relationship to the Veteran',
      uiSchema: claimantRelationShip.uiSchema,
      schema: claimantRelationShip.schema,
    },
    claimantOther: {
      path: 'claimant-other',
      title: 'Claimant’s relationship to the Veteran',
      CustomPage: IncorrectForm,
      CustomPageReview: null,
      uiSchema: {},
      schema: blankSchema,
      depends: formData => formData.claimantRelationship === 'OTHER',
    },
  },
};
