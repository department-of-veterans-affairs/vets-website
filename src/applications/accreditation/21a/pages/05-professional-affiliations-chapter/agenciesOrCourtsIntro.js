import { descriptionUI } from '~/platform/forms-system/src/js/web-component-patterns';

import AgenciesOrCourtsIntro from '../../components/05-professional-affiliations-chapter/AgenciesOrCourtsIntro';

export default {
  title: 'Agencies or courts',
  path: 'agencies-or-courts-intro',
  depends: formData => formData.standingWithBar === false,
  uiSchema: {
    ...descriptionUI(AgenciesOrCourtsIntro),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
