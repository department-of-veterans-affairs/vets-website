import {
  resolutionExplainer,
  resolutionOption,
  resolutionOptions,
  resolutionComment,
  resolutionWaiverAgreement,
  resolutionComments,
} from '../../pages';

export default {
  resolutionOptionsChapter: {
    title: 'Repayment or relief options',
    pages: {
      optionExplainer: {
        path: 'option-explainer',
        title: 'Resolution Option Explainer',
        uiSchema: resolutionExplainer.uiSchema,
        schema: resolutionExplainer.schema,
      },
      resolutionOptions: {
        path: 'resolution-options',
        title: 'Resolution options',
        depends: formData => !formData['view:combinedFinancialStatusReport'],
        uiSchema: resolutionExplainer.uiSchema,
        schema: resolutionOptions.schema,
      },
      // New resolution radio options
      resolutionOption: {
        title: 'Resolution Option',
        depends: formData => {
          return (
            formData.selectedDebtsAndCopays?.length > 0 &&
            formData['view:combinedFinancialStatusReport']
          );
        },
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
          formData['view:combinedFinancialStatusReport'],
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
          formData['view:combinedFinancialStatusReport'],
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
      },
    },
  },
};
