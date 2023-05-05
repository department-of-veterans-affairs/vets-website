/**
 * @file Generic types for the form system
 *
 * Used for intellisense (autocompletion)
 */

// Example 1:
// /** @type {FormConfig} */
// const formConfig = {...};

// Example 2:
// /** @type {PageSchema} */
// export default {
//   uiSchema: {...},
//   schema: {...},
// };

// Use @typedef ({{}}) format to use [key: string]: Type
// Use @typedef {Object} format to be able to add comments to properties

/**
 * @typedef {Object} FormConfig
 * @property {Array<Object>} [additionalRoutes]
 * @property {string} [ariaDescribedBySubmit]
 * @property {Record<string, FormConfigChapter>} [chapters]
 * @property {(props: any) => JSX.Element} [confirmation]
 * @property {CustomText} [customText]
 * @property {Record<string, SchemaOptions>} [defaultDefinitions]
 * @property {Dev} [dev] - object of dev-only options
 * @property {Downtime} [downtime]
 * @property {(props: any) => JSX.Element} [errorText]
 * @property {(props: any) => JSX.Element} [footerContent]
 * @property {string} [formId]
 * @property {(props: any) => JSX.Element} [formSavedPage]
 * @property {() => JSX.Element} [getHelp]
 * @property {React.ReactNode | (props: any) => any} [introduction]
 * @property {Array<Function>} [migrations]
 * @property {(formConfig: any) => void} [onFormLoaded]
 * @property {boolean} [prefillEnabled]
 * @property {Function} [prefillTransformer]
 * @property {PreSubmitInfo} [preSubmitInfo]
 * @property {Object} [reviewErrors]
 * @property {string} [rootUrl]
 * @property {SavedFormMessages} [savedFormMessages]
 * @property {SaveInProgress} [saveInProgress]
 * @property {boolean} [showReviewErrors]
 * @property {(props: any) => JSX.Element} [submissionError]
 * @property {(form: any, formConfig: any) => Promise<any>} [submit]
 * @property {(props: any) => JSX.Element} [submitErrorText]
 * @property {string} [submitUrl]
 * @property {string} [subTitle]
 * @property {string} [title]
 * @property {string} [trackingPrefix]
 * @property {(form: any, formConfig: any) => any} [transformForSubmit]
 * @property {string} [urlPrefix]
 * @property {boolean} [useCustomScrollAndFocus]
 * @property {boolean} [verifyRequiredPrefill]
 * @property {number} [version]
 * @property {string} [wizardStorageKey]
 */

/**
 * @typedef {Object} CustomText
 * @property {string} [appSavedSuccessfullyMessage]
 * @property {string} [appType]
 * @property {string} [continueAppButtonText]
 * @property {string} [reviewPageTitle]
 * @property {string} [startNewAppButtonText]
 * @property {string} [submitButtonText]
 */

/**
 * @typedef {Object} Dev
 * @property {boolean} [showNavLinks]
 */

/**
 * @typedef {Object} SavedFormMessages
 * @property {string} [notFound]
 * @property {string} [noAuth]
 */

/**
 * @typedef {Object} Downtime
 * @property {Array<string>} [dependnecies]
 * @property {string} [endTime]
 * @property {string} [message]
 * @property {boolean} [requiredForPrefill]
 * @property {'down' |'downtimeApproaching' | 'ok'} [status]
 * @property {string} [startTime]
 */

/**
 * Add this to a union so that the literal types are not enforced
 * but we will still get intellisense for the union type.
 * (since all existing definitions will be interpretted as strings)
 *
 * This is a common TypeScript trick when you have a union + any string
 * {} defaults to mostly everything for types, including string
 * @typedef {string & {}} OrAnyString
 */

/**
 * @typedef {Object} PreSubmitInfo
 * @property {(props: any) => JSX.Element} [CustomComponent]
 * @property {string} [error]
 * @property {string} [field]
 * @property {JSX.Element} [label]
 * @property {string | JSX.Element} [notice]
 * @property {boolean} [required]
 * @property {StatementOfTruth} [statementOfTruth]
 */

/**
 * @typedef {Object} SaveInProgress
 * @property {Object} [messages]
 * @property {string} [messages.inProgress]
 * @property {string} [messages.expired]
 * @property {string} [messages.saved]
 */

/**
 * @typedef {Object} StatementOfTruth
 * @property {string | JSX.Element} [body]
 * @property {string | (formData) => string} [fullNamePath] - defaults to 'veteran.fullName'
 * @property {string} [heading] - defaults to 'Statement of truth'
 * @property {string} [messageAriaDescribedby] - defaults to 'Statement of truth'
 * @property {string} [textInputLabel] - defaults to 'Your full name'
 */

/**
 * @typedef {Object} FormConfigChapter
 * @property {Record<string, FormConfigPage>} [pages]
 * @property {string | Function} [title]
 * @property {boolean} [hideFormNavProgress]
 */

/**
 * @typedef {Object} FormConfigPage
 * @property {string} [arrayPath]
 * @property {(props: any) => JSX.Element} [CustomPage]
 * @property {(props: any) => JSX.Element} [CustomPageReview]
 * @property {(formData: Object) => boolean} [depends]
 * @property {Object} [initialData]
 * @property {(formData: any) => void} [onContinue]
 * @property {(data: any) => boolean} [itemFilter]
 * @property {string} [path]
 * @property {SchemaOptions} [schema]
 * @property {string | Function} [scrollAndFocusTarget]
 * @property {boolean} [showPagePerItem]
 * @property {string | Function} [title]
 * @property {UISchemaOptions} [uiSchema]
 * @property {(item, index) => void} [updateFormData]
 */

/**
 * @typedef {Object} PageSchema - The schema for a page (only uiSchema and schema). If you want all the page properties, use FormConfigPage
 * @property {UISchemaOptions} uiSchema
 * @property {SchemaOptions} schema
 */

/**
 * @typedef {{
 *    items?: UISchemaOptions,
 *   'ui:autocomplete'?: string,
 *   'ui:description'?: string | JSX.Element | ((props: any) => JSX.Element),
 *   'ui:disabled'?: boolean,
 *   'ui:errorMessages'?: UIErrorMessages,
 *   'ui:field'?: (props: any) => JSX.Element,
 *   'ui:hidden'?: boolean,
 *   'ui:objectViewField'?: (props: any) => JSX.Element,
 *   'ui:options'?: UIOptions,
 *   'ui:order'?: string[],
 *   'ui:required'?: (formData: any) => boolean,
 *   'ui:reviewField'?: (props: any) => JSX.Element,
 *   'ui:reviewWidget'?: (props: any) => JSX.Element,
 *   'ui:title'?: string | JSX.Element,
 *   'ui:validations'?: Array<((errors, value) => void)>,
 *   'ui:webComponentField'?: (props: any) => JSX.Element,
 *   'ui:widget'?: 'yesNo' | 'checkbox' | 'radio' | 'select' | 'email' | 'date' | 'textarea'  | OrAnyString | ((props: any) => JSX.Element),
 * } & {
 *  [key: string]: UISchemaOptions | {}
 * }} UISchemaOptions
 */

/**
 * @typedef {{
 *   atLeastOne?: string,
 *   enum?: string,
 *   maxItems?: string,
 *   maxLength?: string,
 *   minItems?: string,
 *   minLength?: string,
 *   pattern?: string,
 *   required?: string,
 * } | {
 *   [key: string]: string
 * }} UIErrorMessages
 */

/**
 * @typedef {Object} UIOptions
 * @property {string} [ariaDescribedby] - The id of the element that describes the field
 * @property {string} [classNames]
 * @property {string} [customTitle]
 * @property {number} [debounceRate]
 * @property {string} [duplicateKey]
 * @property {string} [expandUnder]
 * @property {boolean} [expandUnderCondition]
 * @property {boolean} [forceDivWrapper]
 * @property {boolean} [freeInput]
 * @property {boolean} [hideEmptyValueInReview]
 * @property {(formData: any) => boolean} [hideIf]
 * @property {boolean} [hideLabelText]
 * @property {boolean} [hideTitle]
 * @property {boolean} [hideOnReview]
 * @property {string} [hint]
 * @property {boolean} [includeRequiredLabelInTitle]
 * @property {Array<(input) => string>} [inputTransformers]
 * @property {'number' | 'text' | 'email' | 'search' | 'tel' | 'url'} inputType
 * @property {(item: any) => string} [itemAriaLabel]
 * @property {string} [itemName]
 * @property {boolean} [keepInPageOnReview]
 * @property {Record<string, string>} [labels]
 * @property {(formData: any) => any} [replaceSchema]
 * @property {(formData, schema, uiSchema, index, path) => any} [updateSchema]
 * @property {boolean} [useDlWrap]
 * @property {boolean} [uswds]
 * @property {(props: any) => JSX.Element} [viewComponent]
 * @property {(props: any) => JSX.Element} [viewField]
 * @property {string} [widgetClassNames]
 * @property {Record<string, any>} [widgetProps]
 */

/**
 * @typedef {{
 *   $ref?: string,
 *   default?: string,
 *   enum?: string[] | boolean[],
 *   enumNames?: string[],
 *   format?: 'email' | 'date' | 'date-time' | 'uri' | 'data-url' | OrAnyString,
 *   items?: SchemaOptions,
 *   maxLength?: number,
 *   minItems?: number,
 *   maxItems?: number,
 *   minLength?: number,
 *   oneOf?: SchemaOptions[],
 *   pattern?: string,
 *   properties?: Record<string, SchemaOptions>,
 *   required?: string[],
 *   type?: 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array' | OrAnyString,
 *   uniqueItems?: boolean,
 * } & {
 *   [key: string]: SchemaOptions | {}
 * }} SchemaOptions
 */
