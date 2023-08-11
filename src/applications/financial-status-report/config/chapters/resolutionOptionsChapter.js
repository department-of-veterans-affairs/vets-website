import {
  resolutionExplainer,
  resolutionOption,
  resolutionComment,
  resolutionWaiverAgreement,
  resolutionComments,
} from '../../pages';

import {
  isStreamlinedLongForm,
  isStreamlinedShortForm,
} from '../../utils/streamlinedDepends';

export default {
  resolutionOptionsChapter: {
    title: 'Repayment or relief options',
    depends: formData =>
      !isStreamlinedShortForm(formData) && !isStreamlinedLongForm(formData),
    pages: {
      optionExplainer: {
        path: 'option-explainer',
        title: 'Resolution Option Explainer',
        uiSchema: resolutionExplainer.uiSchema,
        schema: resolutionExplainer.schema,
        depends: formData =>
          !isStreamlinedShortForm(formData) && !isStreamlinedLongForm(formData),
      },
      resolutionOption: {
        title: 'Resolution Option',
        depends: formData =>
          formData.selectedDebtsAndCopays?.length > 0 &&
          !isStreamlinedShortForm(formData) &&
          !isStreamlinedLongForm(formData),
        path: 'resolution-option/:index',
        showPagePerItem: true,
        arrayPath: 'selectedDebtsAndCopays',
        uiSchema: resolutionOption.uiSchema,
        schema: resolutionOption.schema,
      },
      resolutionComment: {
        title: 'Resolution Amount',
        depends: formData =>
          formData.selectedDebtsAndCopays?.length > 0 &&
          !isStreamlinedShortForm(formData) &&
          !isStreamlinedLongForm(formData),
        itemFilter: item => item.resolutionOption !== 'waiver',
        path: 'resolution-comment/:index',
        showPagePerItem: true,
        arrayPath: 'selectedDebtsAndCopays',
        uiSchema: resolutionComment.uiSchema,
        schema: resolutionComment.schema,
      },
      resolutionWaiverCheck: {
        title: 'Resolution Waiver Agreement',
        depends: formData =>
          formData.selectedDebtsAndCopays?.length > 0 &&
          !isStreamlinedShortForm(formData) &&
          !isStreamlinedLongForm(formData),
        itemFilter: item => item.resolutionOption === 'waiver',
        path: 'resolution-waiver-agreement/:index',
        showPagePerItem: true,
        arrayPath: 'selectedDebtsAndCopays',
        uiSchema: resolutionWaiverAgreement.uiSchema,
        schema: resolutionWaiverAgreement.schema,
      },
      resolutionComments: {
        path: 'resolution-comments',
        title: 'Resolution comments',
        uiSchema: resolutionComments.uiSchema,
        schema: resolutionComments.schema,
        depends: formData =>
          !isStreamlinedShortForm(formData) && !isStreamlinedLongForm(formData),
      },
    },
  },
};
