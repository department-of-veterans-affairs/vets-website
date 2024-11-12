import { mentalHealthConditions } from '..';
import { showMentalHealthPages } from '../../content/mentalHealth';

export const mentalHealthPages = {
  mentalHealthConditions: {
    title: 'Mental health conditions',
    path: `disabilities/781-screener`,
    depends: formData => showMentalHealthPages(formData),
    uiSchema: mentalHealthConditions.uiSchema,
    schema: mentalHealthConditions.schema,
  },
};
