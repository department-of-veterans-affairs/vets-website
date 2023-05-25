import {
  arrayOf,
  bool,
  element,
  elementType,
  func,
  number,
  objectOf,
  oneOf,
  oneOfType,
  shape,
  string,
} from 'prop-types';

export const CustomPageProps = shape({
  contentAfterButtons: element,
  contentBeforeButtons: element,
  data: shape({}),
  goBack: func,
  goForward: func,
  goToPath: func,
  name: string,
  onReviewPage: bool,
  pagePerItemIndex: number,
  setFormData: func,
  title: string,
  trackingPrefix: string,
  updatePage: func,
  uploadFile: func,
});

export const CustomPageReviewProps = shape({
  data: shape({}),
  editPage: func,
  name: string,
  pagePerItemIndex: number,
  title: string,
});

// form config
export const schema = shape({});
export const uiSchema = shape({});

export const page = shape({
  arrayPath: string,
  CustomPage: element,
  CustomPageReview: element,
  depends: func,
  initialData: shape({}),
  path: string,
  returnUrl: string,
  schema,
  scrollAndFocusTarget: oneOfType([string, func]),
  showPagePerItem: bool,
  title: oneOfType([string, func]),
  uiSchema,
  updateFormData: func,
});

// form config chapter
export const chapter = shape({
  hideFormNavProgress: bool,
  pages: objectOf(page),
  reviewDescription: element,
  title: oneOfType([string, func]),
});

export const additionalRoutes = arrayOf(
  shape({
    path: string,
    component: element,
    pageKey: string,
    depends: func,
  }),
);

export const customText = shape({
  appAction: string,
  appContinuing: string,
  appType: string,
  appSavedSuccessfullyMessage: string,
  continueAppButtonText: string,
  finishAppLaterMessage: string,
  reviewPageTitle: string,
  startNewAppButtonText: string,
  submitButtonText: string,
});

export const downtime = shape({
  dependencies: arrayOf(string),
  endTime: string,
  message: string,
  requiredForPrefill: bool,
  status: oneOf(['down', 'downtimeApproaching', 'ok']),
  starttime: string,
});

export const statementOfTruth = shape({
  body: element,
  fullNamePath: oneOfType([func, string]),
  heading: string,
  messageAriaDescribedby: string,
  textInputLabel: string,
});

export const preSubmitInfo = shape({
  CustomComponent: element,
  error: string,
  field: string,
  label: element,
  notice: element,
  required: bool,
  statementOfTruth,
});

export const savedFormMessages = shape({
  notFound: string,
  noAuth: string,
  success: string,
  forbidden: string,
});

export const saveInProgress = shape({
  messages: shape({
    inProgress: string,
    expired: string,
    saved: string,
  }),
});

export const formConfig = shape({
  additionalRoutes,
  ariaDescribedBySubmit: string,
  chapters: objectOf(chapter),
  confirmation: element,
  customText,
  defaultDefinitions: shape({}),
  downtime,
  errorText: oneOfType([string, element]),
  footerContent: element,
  formId: string,
  formSavedPage: element,
  getHelp: element,
  introduction: element,
  migrations: arrayOf(func),
  prefillEnabled: bool,
  prefillTransformer: func,
  preSubmitInfo,
  reviewErrors: shape({}),
  rootUrl: string,
  savedFormMessages,
  saveInProgress,
  showReviewErrors: bool,
  submit: func,
  submitUrl: string,
  subTitle: string,
  title: string,
  trackingPrefix: string,
  transformForSubmit: func,
  urlPrefix: string,
  verifyRequiredPrefill: bool,
  version: number,
});

export const pageConfig = shape({
  arrayPath: string,
  CustomPage: oneOfType([element, func]),
  onContinue: func,
  pageClass: string,
  pageKey: string,
  schema,
  scrollAndFocusTarget: oneOfType([string, func]),
  showPagePerItem: bool,
  title: string,
  uiSchema,
  updateFormData: func,
});

export const formContext = shape({
  hideHeaderRow: bool,
  hideTitle: bool,
  onEdit: func,
  onError: func,
  onReviewPage: bool,
  pagePerItemIndex: number,
  pageTitle: string,
  reviewMode: bool,
  reviewTitle: string,
  setTouched: func,
  submitted: bool,
  touched: arrayOf(shape({})),
  trackingPrefix: string,
  uploadFile: func,
});

export const pageList = arrayOf(
  shape({
    appStateSelector: func,
    arrayPath: string,
    chapterKey: string,
    chapterTitle: string,
    CustomPage: element,
    CustomPageReview: element,
    pageKey: string,
    path: string,
    schema,
    showPagePerItem: bool,
    title: string,
    uiSchema,
  }),
);

export const registry = shape({
  fields: shape({
    SchemaField: elementType,
  }),
  definitions: shape({}),
});

export const route = shape({
  formConfig,
  pageList: shape([]),
});

export const routes = arrayOf(
  oneOfType([
    shape({
      childRoutes: arrayOf([
        shape({
          component: element,
          formConfig,
          pageList,
          path: string,
        }),
      ]),
      component: element,
      indexRoute: shape({

      }),
      path: string,
    }),
  ]),
);


export const savedForms = arrayOf(
  shape({
    form: string,
    lastUpdated: number,
    metadata: shape({
      expiresAt: number,
      inProgressFormId: number,
      lastUpdated: number,
      returnUrl: string,
      savedAt: number,
      submission: shape({
        errorMessage: bool,
        hasAttemptedSubmit: bool,
        id: bool,
        status: bool,
        timestamp: bool,
      }),
      version: number,
    }),
  }),
);
