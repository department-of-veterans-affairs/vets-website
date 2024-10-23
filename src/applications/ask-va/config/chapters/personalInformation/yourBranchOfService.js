import {
  selectUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import PageFieldSummary from '../../../components/PageFieldSummary';
import { branchesOfService, CHAPTER_3 } from '../../../constants';

const yourBranchOfServicePage = {
  uiSchema: {
    ...titleUI(CHAPTER_3.BRANCH_OF_SERVICE.TITLE),
    'ui:objectViewField': PageFieldSummary,
    yourBranchOfService: selectUI({
      title: CHAPTER_3.BRANCH_OF_SERVICE.DESCRIPTION,
      errorMessages: {
        required: CHAPTER_3.BRANCH_OF_SERVICE.ERROR,
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['yourBranchOfService'],
    properties: {
      yourBranchOfService: {
        type: 'string',
        enum: branchesOfService,
      },
    },
  },
};

export default yourBranchOfServicePage;
