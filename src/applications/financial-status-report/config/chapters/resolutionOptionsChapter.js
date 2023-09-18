import {
  resolutionOption,
  resolutionComment,
  resolutionWaiverAgreement,
} from '../../pages';

import {
  isStreamlinedLongForm,
  isStreamlinedShortForm,
} from '../../utils/streamlinedDepends';

import ResolutionComments from '../../components/resolution/ResolutionComments';
import ResolutionCommentsReview from '../../components/resolution/ResolutionCommentsReview';
import ResolutionExplainerWidget from '../../components/resolution/ResolutionExplainerWidget';
import ResolutionExplainerReview from '../../components/resolution/ResolutionExplainerReview';

export default {
  resolutionOptionsChapter: {
    title: 'Repayment or relief options',
    depends: formData =>
      !isStreamlinedShortForm(formData) && !isStreamlinedLongForm(formData),
    pages: {
      optionExplainer: {
        path: 'option-explainer',
        title: 'Resolution Option Explainer',
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        depends: formData =>
          !isStreamlinedShortForm(formData) && !isStreamlinedLongForm(formData),
        CustomPage: ResolutionExplainerWidget,
        CustomPageReview: ResolutionExplainerReview,
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
        CustomPage: ResolutionComments,
        CustomPageReview: ResolutionCommentsReview,
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        depends: formData =>
          !isStreamlinedShortForm(formData) && !isStreamlinedLongForm(formData),
      },
    },
  },
};
