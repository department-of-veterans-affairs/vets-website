import { merge } from 'lodash';
import {
  radioUI,
  titleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import RepresentativeDescription from '../../../components/FormDescriptions/ApplicationSignatureDescription';
import RepresentativeReviewField from '../../../components/FormReview/RepresentativeReviewField';
import content from '../../../locales/en/content.json';

const signAsRepresentative = {
  uiSchema: {
    ...titleUI(content['sign-as-rep-title--review']),
    ...descriptionUI(RepresentativeDescription),
    signAsRepresentativeYesNo: merge(
      {},
      radioUI({
        title: content['sign-as-rep-input-label'],
        labels: {
          no: content['sign-as-rep-no-text'],
          yes: content['sign-as-rep-yes-text'],
        },
      }),
      { 'ui:reviewField': RepresentativeReviewField },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      signAsRepresentativeYesNo: {
        type: 'string',
        enum: ['no', 'yes'],
      },
    },
  },
};

export default signAsRepresentative;
