/**
 * @typedef {{
 *   ariaDescribedBySubmit: string,
 *   chapters: Record<string, FormConfigChapter>,
 *   confirmation: (props: any) => JSX.Element,
 *   defaultDefinitions: Record<string, SchemaOptions>,
 *   errorText: () => JSX.Element,
 *   footerContent: (props: any) => JSX.Element,
 *   formId: string,
 *   getHelp: () => JSX.Element,
 *   introduction:(props: any) => JSX.Element,
 *   migrations: Array<Function>,
 *   prefillEnabled: boolean,
 *   prefillTransformer: Function,
 *   preSubmitInfo: {
 *     CustomComponent: (props: any) => JSX.Element,
 *     field: string,
 *     required: boolean,
 *     notice: string | JSX.Element,
 *     label: JSX.Element
 *     error: string
 *   },
 *   rootUrl: string,
 *   savedFormMessages: {
 *     notFound: string,
 *     noAuth: string
 *   },
 *   saveInProgress: {
 *     messages: {
 *       inProgress: string,
 *       expired: string,
 *       saved: string
 *     }
 *   },
 *   submit: (form: any, formConfig: any) => Promise<any>
 *   submitUrl: string,
 *   subTitle: string,
 *   title: string,
 *   trackingPrefix: string,
 *   transformForSubmit: (form: any, formConfig: any) => any,
 *   urlPrefix: string,
 *   version: number
 * }} FormConfig
 */

/**
 * @typedef {{
 *   pages: Record<string, FormConfigPage>
 *   title: string
 * }} FormConfigChapter
 */

/**
 * @typedef {{
 *   path: string,
 *   depends: (formData: Object) => boolean,
 *   initialData: Object,
 *   onContinue: (formData: any) => void,
 *   schema: SchemaOptions
 *   title: string,
 *   uiSchema: UISchemaOptions,
 * }} FormConfigPage
 */

/**
 * @typedef {Object} PageSchema
 * @property {UISchemaOptions} uiSchema - The UI schema options for the form
 * @property {SchemaOptions} schema - The schema for the form
 */

/**
 * @typedef {{
 *   'ui:autocomplete': string,
 *   'ui:description': string | JSX.Element,
 *   'ui:disabled': boolean,
 *   'ui:errorMessages': {
 *     enum: string,
 *     maxLength: string,
 *     minLength: string,
 *     pattern: string,
 *     required: string,
 *    },
 *   'ui:field': (props: any) => JSX.Element,
 *   'ui:hidden': boolean,
 *   'ui:inputmode': string,
 *   'ui:options': {
 *     ariaDescribedby: string,
 *     classNames: string,
 *     customTitle: string,
 *     expandUnder: string,
 *     expandUnderCondition: boolean,
 *     forceDivWrapper: boolean,
 *     hideEmptyValueInReview: boolean,
 *     hideIf: (formData: any) => boolean,
 *     hideTitle: boolean,
 *     hideOnReview: boolean,
 *     hint: string,
 *     itemName: string,
 *     keepInPageOnReview: boolean,
 *     replaceSchema: (formData: any) => any,
 *     reviewTitle: string,
 *     showFieldLabel: boolean,
 *     updateSchema: (formData, addressSchema, addressUiSchema, index, path) => any,
 *     viewComponent: (props: any) => JSX.Element,
 *     viewField: (props: any) => JSX.Element,
 *     widgetClassNames: string,
 *     widgetProps: Record<string, any>
 *   },
 *   'ui:order': string[],
 *   'ui:required': (formData: any) => boolean,
 *   'ui:reviewField': (props: any) => JSX.Element,
 *   'ui:reviewWidget': (props: any) => JSX.Element,
 *   'ui:title': string,
 *   'ui:validations': Array<((errors, value) => void)>,
 *   'ui:webComponentField': (props: any) => JSX.Element
 *   'ui:widget': 'yesNo' | 'radio' | 'email' | 'date' | 'textarea' | (props: any) => JSX.Element,
 *   [key: string]: UISchemaOptions
 * }} UISchemaOptions
 */

/**
 * @typedef {{
 *   $ref: string,
 *   enum: string[],
 *   enumNames: string[],
 *   format: 'email' | 'date' | 'date-time' | 'uri' | 'data-url',
 *   items: SchemaOptions,
 *   maxLength: number,
 *   minItems: number,
 *   minLength: number,
 *   pattern : string,
 *   properties: Record<string, SchemaOptions>,
 *   required: string[]
 *   type: 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array',
 *   uniqueItems: boolean,
 * }} SchemaOptions
 */
