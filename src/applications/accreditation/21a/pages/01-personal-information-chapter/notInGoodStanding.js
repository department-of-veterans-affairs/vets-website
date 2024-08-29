import NotInGoodStanding from '../../components/01-personal-information-chapter/NotInGoodStanding';

/** @type {PageSchema} */
export default {
  title: 'Not in good standing',
  path: 'not-in-good-standing',
  depends: formData =>
    formData.role === 'attorney' && formData.lawLicense === false,
  CustomPage: NotInGoodStanding,
  CustomPageReview: NotInGoodStanding,
  uiSchema: {},
  schema: {
    type: 'object',
    properties: {},
  },
};
