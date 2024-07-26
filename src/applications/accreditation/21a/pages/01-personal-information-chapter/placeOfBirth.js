import {
  addressNoMilitarySchema,
  addressNoMilitaryUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Place of birth',
  path: 'place-of-birth',
  uiSchema: {
    ...titleUI('Place of birth'),
    placeOfBirthAddress: addressNoMilitaryUI(),
  },
  schema: {
    type: 'object',
    properties: {
      placeOfBirthAddress: addressNoMilitarySchema({
        omit: ['street2', 'street3'], // TODO: [#87156 Update Address fields to not require street and postal code](https://app.zenhub.com/workspaces/accredited-representative-facing-team-65453a97a9cc36069a2ad1d6/issues/gh/department-of-veterans-affairs/va.gov-team/87156)
      }),
    },
  },
};
