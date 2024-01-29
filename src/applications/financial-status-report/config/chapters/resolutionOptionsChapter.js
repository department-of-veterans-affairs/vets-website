import {
  resolutionOption,
  resolutionComment,
  resolutionWaiverAgreement,
} from '../../pages';

import {
  isStreamlinedLongForm,
  isStreamlinedShortForm,
} from '../../utils/streamlinedDepends';

import ResolutionExplainerWidget from '../../components/resolution/ResolutionExplainerWidget';
import ResolutionExplainerReview from '../../components/resolution/ResolutionExplainerReview';
import ResolutionComments from '../../components/resolution/ResolutionComments';
import ResolutionCommentsReview from '../../components/resolution/ResolutionCommentsReview';
import CustomResolutionOptionReview from '../../components/shared/CustomResolutionOptionReview';

export default {
  resolutionOptionsChapter: {
    title: 'Repayment or relief options',
    depends: formData =>
      !isStreamlinedShortForm(formData) && !isStreamlinedLongForm(formData),
    pages: {
      optionExplainer: {
        path: 'option-explainer',
        title: 'Resolution Option Explainer',
        CustomPage: ResolutionExplainerWidget,
        CustomPageReview: ResolutionExplainerReview,
        uiSchema: {},
        schema: { type: 'object', properties: {} },
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
        CustomPage: null,
        CustomPageReview: CustomResolutionOptionReview,
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
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        CustomPage: ResolutionComments,
        CustomPageReview: ResolutionCommentsReview,
        depends: formData =>
          !isStreamlinedShortForm(formData) && !isStreamlinedLongForm(formData),
      },
    },
  },
};
