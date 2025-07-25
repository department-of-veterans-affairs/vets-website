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
 * @property {string} [backLinkText]
 * @property {Record<string, FormConfigChapter>} [chapters]
 * @property {(props: any) => JSX.Element} [confirmation]
 * @property {JSX.Element | React.ReactNode} [CustomReviewTopContent]
 * @property {JSX.Element | React.ReactNode} [CustomTopContent]
 * @property {CustomText} [customText]
 * @property {Record<string, SchemaOptions> | Record<string, any>} [defaultDefinitions]
 * @property {Dev} [dev] - object of dev-only options
 * @property {Downtime} [downtime]
 * @property {(props: any) => JSX.Element} [errorText]
 * @property {(props: any) => JSX.Element} [footerContent]
 * @property {string} [formId]
 * @property {(props: any) => JSX.Element} [formSavedPage]
 * @property {() => JSX.Element} [getHelp]
 * @property {boolean} [hideFormTitle] Hide form titles on all pages. Pairs well with minimal header. Use hideFormTitle on individual pages to override setting on certain pages.
 * @property {boolean} [hideFormTitleConfirmation] If title should be hidden for confirmation page. Will override hideFormTitle.
 * @property {boolean} [hideNavButtons]
 * @property {boolean} [hideUnauthedStartLink]
 * @property {React.ReactNode | (props: any) => any} [introduction]
 * @property {Array<Function>} [migrations]
 * @property {(formConfig: any) => void} [onFormLoaded]
 * @property {boolean} [prefillEnabled]
 * @property {Function} [prefillTransformer]
 * @property {PreSubmitInfo} [preSubmitInfo]
 * @property {boolean} [reviewEditFocusOnHeaders]
 * @property {Object} [reviewErrors]
 * @property {string} [rootUrl]
 * @property {SavedFormMessages} [savedFormMessages]
 * @property {SaveInProgress} [saveInProgress]
 * @property {string | Function} [scrollAndFocusTarget] Applies when useCustomScrollAndFocus is true. Default scroll and focus for the form. will be overridden by individual page scrollAndFocusTarget
 * @property {boolean} [showReviewErrors]
 * @property {boolean} [showSaveLinkAfterButtons] by default, when logged in, a save link is present before the back/continue buttons, but setting this to true will make it show up below it.
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
 * @property {boolean} [useTopBackLink] will show a back link at the top of form pages and only a continue button at the bottom
 * @property {boolean | { useDiv: boolean }} [v3SegmentedProgressBar] - if true, the V3 segmented progress bar web component is used in place of the v2. Also accepts an object with options.
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
 * @property {boolean} [showNavLinks] - Show navigation links on every page to every route in your form (dev only)
 * @property {boolean} [collapsibleNavLinks] - Must be used with `showNavLinks: true`. If true, the nav links will be wrapped in a `va-additional-info` component
 */

/**
 * @typedef {Object} SavedFormMessages
 * @property {string} [notFound]
 * @property {string} [noAuth]
 */

/**
 * @typedef {Object} Downtime
 * @property {Array<string>} [dependencies]
 * @property {string} [endTime]
 * @property {string} [message]
 * @property {boolean} [requiredForPrefill]
 * @property {'down' |'downtimeApproaching' | 'ok'} [status]
 * @property {string} [startTime]
 */

/**
 * This is the same thing as `string`, but can be used with
 * literal string types and autocomplete will still work
 * e.g. `'email' | 'tel' | OrAnyString`
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
 * @property {() => string} [restartFormCallback] return restart destination url
 */

/**
 * @typedef {Object} StatementOfTruth
 * @property {string | JSX.Element} [body]
 * @property {string | (formData) => string} [fullNamePath] defaults to 'veteran.fullName'
 * @property {string} [heading] defaults to 'Statement of truth'
 * @property {string} [messageAriaDescribedby] defaults to 'Statement of truth'
 * @property {string} [textInputLabel] defaults to 'Your full name'
 * @property {boolean} [useProfileFullName] if you enable this it gets the name from profile data, default to false
 */

/**
 * @typedef {Object} FormConfigChapter
 * @property {FormConfigPages} [pages]
 * @property {string | ({ formData, formConfig }) => string} [title]
 * @property {boolean} [hideFormNavProgress]
 * @property {boolean} [hideFormTitle]
 * @property {boolean} [hideOnReviewPage]
 * @property {React.ReactNode} [reviewDescription]
 */

/**
 * @typedef {Record<string, FormConfigPage>} FormConfigPages
 */

/**
 * @typedef {Object} FormConfigPage
 * @property {boolean} [allowPathWithNoItems] For array pages. if true, will allow a path with no items in the array at /0. Used with showPagePerItem.
 * @property {string} [arrayPath] the name of the property in the schema/uiSchema that is `type: 'array'`
 * @property {({formData, formContext, router, setFormData}) => JSX.Element} [ContentBeforeButtons] React element that appears after the form but before save in progress and the navigation buttons
 * @property {(props: any) => JSX.Element} [CustomPage]
 * @property {(props: any) => JSX.Element} [CustomPageReview]
 * @property {((formData: Object) => boolean, index: number, context: any) | {}} [depends] optional condition when page should be shown or not. Index provided for arrays.
 * @property {Object} [initialData]
 * @property {boolean} [customPageUsesPagePerItemData] Used with `CustomPage` and arrays. If true, will treat `data` (`formData`) and `setFormData` at the array level instead of the entire `formData` level, which matches how default pages work.
 * @property {boolean} [hideNavButtons] Used to hide the 'Continue' and 'Back' buttons
 * @property {(formData: any) => void} [onContinue] Called when user clicks continue button. For simple callbacks/events. If you instead want to navigate to a different page, use onNavForward.
 * @property {({ formData, goPath, goPreviousPath, pageList, pathname, setFormData, urlParams, index }: { formData, goPath: (path: string) => void, goPreviousPath: (urlParams?: object) => void, pageList: PageList, pathname: string, setFormData, urlParams, index: number }) => void} [onNavBack] Called instead of default navigation when user clicks back button. Use goPath or goPreviousPath to navigate.
 * @property {({ formData, goPath, goNextPath, pageList, pathname, setFormData, urlParams, index }: { formData, goPath: (path: string) => void, goNextPath: (urlParams?: object) => void, pageList: PageList, pathname: string, setFormData, urlParams, index: number }) => void} [onNavForward] Called instead of default navigation when user clicks continue button. Use goPath or goNextPath to navigate.
 * @property {(data: any) => boolean} [itemFilter]
 * @property {string} [path] url path for page e.g. `'name-of-path'`, or `'name-of-path/:index'` for an array item page. Results in `http://localhost:3001/my-form/name-of-path`
 * @property {string} [returnUrl]
 * @property {SchemaOptions} [schema]
 * @property {string | Function} [scrollAndFocusTarget]
 * @property {boolean} [showPagePerItem] if true, will show an additional page for each item in the array at `'name-of-path/:index'`
 * @property {boolean} [hideSaveLinkAndStatus] will hide the save application later and save in progress message near the back/continue buttons
 * @property {string | (formData) => string} [title] Will show on review page (may require more than one word to show)
 * @property {UISchemaOptions} [uiSchema]
 * @property {(item, index) => void} [updateFormData]
 */

/**
 * @typedef {Object} CustomPageProps
 * @property {string} name route.pageConfig.pageKey
 * @property {string} title route.pageConfig.title
 * @property {Object} data
 * @property {number} pagePerItemIndex
 * @property {boolean} onReviewPage
 * @property {string} trackingPrefix
 * @property {Function} uploadFile
 * @property {Object} schema
 * @property {Object} uiSchema
 * @property {() => void} goBack
 * @property {({ formData }) => void} goForward
 * @property {(customPath: string, options?: { force: boolean }) => void} goToPath
 * @property {() => void} onContinue
 * @property {(formData) => void} onChange
 * @property {({ formData }) => void} onSubmit
 * @property {(pageName: string, index?: number) => boolean} recalculateErrors Only available
 * on review page. Recalculates errors for the page including the red chapter level styling.
 * Pass the prop.name to the pageName param. If the page is an array, pass the index as the second param.
 * @property {Function} setFormData
 * @property {React.ReactNode} contentBeforeButtons
 * @property {React.ReactNode} contentAfterButtons
 * @property {Object} appStateData
 * @property {Object} formContext
 * @property {Object} NavButtons Standard buttons at the bottom of the form e.g. back/continue
 */

/**
 * @typedef {(props: CustomPageProps) => React.ReactNode} CustomPageType
 */

/**
 * @typedef {{
 *  uiSchema: UISchemaOptions,
 *  schema: SchemaOptions,
 * } & Partial<FormConfigPage>} PageSchema The schema for a page (uiSchema and schema).
 */

/**
 * Autocomplete values
 * @typedef {'on' | 'off' | 'name' | 'honorific-prefix' | 'given-name' | 'additional-name' | 'family-name' | 'honorific-suffix' | 'nickname' | 'email' | 'username' | 'current-password' | 'organization-title' | 'organization' | 'street-address' | 'address-line1' | 'address-line2' | 'address-line3' | 'address-level4' | 'address-level3' | 'address-level2' | 'address-level1' | 'country' | 'country-name' | 'postal-code' | 'cc-name' | 'cc-given-name' | 'cc-additional-name' | 'cc-family-name' | 'cc-number' | 'cc-exp' | 'cc-exp-month' | 'cc-exp-year' | 'cc-csc' | 'cc-type' | 'transaction-currency' | 'transaction-amount' | 'language' | 'bday' | 'bday-day' | 'bday-month' | 'bday-year' | 'sex' | 'tel' | 'tel-country-code' | 'tel-national' | 'tel-area-code' | 'tel-local' | 'tel-extension' | 'impp' | 'url' | 'photo' | OrAnyString} AutocompleteValue
 */

/**
 * Icon - any value from https://design.va.gov/storybook/?path=/docs/uswds-va-icon--docs
 * @typedef {'credit_card' | 'comment' | 'attach_money' | OrAnyString} Icon
 */

/**
 * @typedef {Array<{
 *    pageKey: string,
 *    path: string,
 *    chapterKey?: string,
 *    chapterTitle?: string,
 * } & Partial<FormConfigPage>>} PageList
 */

/**
 * @typedef {{
 *    items?: UISchemaOptions,
 *   'ui:autocomplete'?: AutocompleteValue,
 *   'ui:description'?: string | JSX.Element | React.ReactNode,
 *   'ui:disabled'?: boolean,
 *   'ui:errorMessages'?: UIErrorMessages,
 *   'ui:field'?: React.ReactNode,
 *   'ui:hidden'?: boolean,
 *   'ui:objectViewField'?: React.ReactNode,
 *   'ui:options'?: UIOptions,
 *   'ui:order'?: string[],
 *   'ui:required'?: (formData: any, index: number, fullData: any, path: Array<string | number>) => boolean,
 *   'ui:reviewField'?: React.ReactNode,
 *   'ui:reviewWidget'?: React.ReactNode,
 *   'ui:title'?: string | JSX.Element | React.ReactNode,
 *   'ui:validations'?: Array<((errors, formData, uiSchema, schema, errorMessages) => void)>,
 *   'ui:webComponentField'?: React.ReactNode,
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
 * @property {string} [ariaDescribedby] The id of the element that describes the field. Use `messageAriaDescribedby` for web components.
 * @property {boolean} [charcount] Whether a web-component should show a character count message. Has no effect without `maxLength` being set in the schema.
 * @property {string} [classNames] additional CSS classes to add to the field
 * @property {boolean} [confirmRemove] For arrays. If true, will show a confirmation modal when removing an item.
 * @property {string} [confirmRemoveDescription] For arrays. Description for the confirmation modal when removing an item.
 * @property {boolean} [currency] For textUI / vaTextInputField. If true, will show a currency symbol in the input field.
 * @property {string} [customTitle] For the review page, for arrays and some widgets. This doesn't appear to change any text, but is just used for a hack to prevent an outer DL wrapper. Often set to `' '`, and used with `useDlWrap: true` to get a11y issues to pass. Will format field title and body vertically instead of horizontally. `useDlWrap` will format text horizontally.
 * @property {number} [debounceRate] Used for AutoSuggest widget
 * @property {boolean} [displayEmptyObjectOnReview] For objects with empty properties object. This will display ui:title and ui:description on the review page.
 * @property {number} [doNotScroll] For arrays. By default when adding a new item it will scroll to the next item. Set this to true to disable that behavior.
 * @property {string} [duplicateKey] For arrays.
 * @property {boolean} [enableAnalytics] Enable google analytic events. Sent on blur. Use a browser extension such as Adswerve to view the events in the console.
 * @property {string} [expandUnder] The key of the uiSchema directly before this field
 * @property {boolean} [expandContentFocus] Used with expandUnder. When the field expands under, it exclusively shows a vertical, blue bar, is indented, and focuses on the field's input.
 * @property {boolean | (value: string, formData: any, index: boolean, fullData: any) => boolean} [expandUnderCondition] `expandUnderCondition: (value, formData, index, fullData) => !!value`. value is the value of the target `expandUnder` field.
 * @property {boolean} [forceDivWrapper] Used as an a11y helper when you need to wrap a field in a div
 * @property {string | JSX.Element} [formDescription] Used with `useFormsPattern`. A JSX or string description that it is also a11y (screen reader) friendly. useFormsPattern and uswds must be true.
 * @property {string} [formHeading] Used with `useFormsPattern`. Intended to be used as the form page header. useFormsPattern and uswds must be true.
 * @property {number} [formHeadingLevel] Used with `useFormsPattern`. The header level of the formHeading. useFormsPattern and uswds must be true.
 * @property {boolean} [freeInput] for AutoSuggest widget
 * @property {boolean} [generateIndividualItemHeaders] For array field generation that would use the "new item" logic. Items created before it will now have "item" headers attached to them if there are multiple and it is not the final one in the series.
 * @property {boolean} [hideEmptyValueInReview] Field will not be displayed in review page if empty if set to true
 * @property {(formData: any, index: number, fullData: any, path: Array<string | number>) => boolean} [hideIf] Conditional logic if the field should be hidden
 * @property {boolean} [hideLabelText] Hide the text above a form field. May be useful for checkbox widgets and some other corner cases.
 * @property {boolean} [hideTitle] For arrays.
 * @property {boolean} [hideOnReview] Used to hide a field on review page
 * @property {string} [hint] The hint text for the field. For web components.
 * @property {UIOptions} [ifMinimalHeader] An object of options that will override existing options if minimal header is applicable.
 * @property {boolean} [includeRequiredLabelInTitle]
 * @property {Array<(input) => string>} [inputTransformers]
 * @property {'number' | 'text' | 'email' | 'search' | 'tel' | 'url' | OrAnyString} [inputType] Keyboard type for mobile users. Equivalent to HTML input 'type' attribute.
 * @property {(item: any) => string} [itemAriaLabel] for arrays
 * @property {string} [itemName] The name of the item - for arrays. For example a value of 'Child' will result in 'Add another child', 'New child', and if 'using confirmRemove', 'Are you sure you want to remove this child item?', 'Yes, remove this child item'.
 * @property {boolean} [invalid] For web components. Whether or not aria-invalid will be set on the inner input. Useful when composing the component into something larger, like a date component.
 * @property {boolean} [keepInPageOnReview] Used to keep a field on the review page. Often used with arrays or expandUnder fields. When used with arrays, removes the default editor box on the review page and shows view-only data with an edit button instead.
 * @property {Record<string, string>} [labels] Used to specify radio button or yes/no labels
 * @property {'' | '1' | '2' | '3' | '4' | '5'} [labelHeaderLevel] The header level for the label. For web components such as radio buttons or checkboxes.
 * @property {'' | '1' | '2' | '3' | '4' | '5'} [labelHeaderLevelStyle] The header style level for the label. For web components such as radio buttons or checkboxes.
 * @property {string} [messageAriaDescribedby] For web components. An optional message that will be read by screen readers when the input is focused.
 * @property {boolean} [monthSelect] For VaMemorableDate web component. If true, will use a select dropdown for the month instead of an input.
 * @property {string} [inputPrefix] For textUI / VaTextInputField. Displays a fixed prefix string at the start of the input field.
 * @property {Icon} [inputIconPrefix] For textUI / VaTextInputField. This property displays a prefix that accepts a string which represents icon name.
 * @property {string} [inputSuffix] For textUI / VaTextInputField. Displays a fixed suffix string at the start of the input field.
 * @property {Icon} [inputIconSuffix] For textUI / VaTextInputField. This property displays a suffix that accepts a string which represents icon name.
 * @property {(formData: any, schema: SchemaOptions, uiSchema: UISchemaOptions, index, path: string[], fullData: any) => SchemaOptions} [replaceSchema] Replace the entire `schema` based on `formData`. Must provide the entire `schema` in the return. Recalculates on every form data change.
 *
 * Also accepts `title` one-off property to update `'ui:title'` as long as `'ui:title'` it is not defined. (can be useful if you are working inside of an array where `updateUiSchema` is not supported).
 *
 * When using dynamic fields you need to consider accessibility and screen readers. For these reasons it is not recommended to change fields live, because the changes may not get read out. Instead, it is recommended to already have some previous `formData` set so that when you get to the dynamic fields, they are static while on that page.
 * @property {(formData: any, schema: SchemaOptions, uiSchema: UISchemaOptions, index, path: string[], fullData: any) => SchemaOptions} [updateSchema] Update the `schema` based on `formData`. The function should return a partial `schema` of only the properties you want to update. Recalculates on every form data change.
 *
 * Also accepts `title` one-off property to update `'ui:title'` as long as `'ui:title'` it is not defined. (can be useful if you are working inside of an array where `updateUiSchema` is not supported).
 *
 * When using dynamic fields you need to consider accessibility and screen readers. For these reasons it is not recommended to change fields live, because the changes may not get read out. Instead, it is recommended to already have some previous `formData` set so that when you get to the dynamic fields, they are static while on that page.
 * @property {(formData: any, fullData: any, index: number) => UISchemaOptions} [updateUiSchema] Update the `uiSchema` based on `formData`. The function should return a partial `uiSchema` of only the properties you want to update, including `'ui:options'` if desired. Recalculates on every form data change.
 *
 * If you need page title or description to be dynamic, instead use `'ui:title'` and `'ui:description'` with a function (or `...titleUI()`) (doesn't work with fields but only the root).
 *
 * `updateUiSchema` does not work inside of an array, however a workaround for arrays is to use `updateSchema` which allows for a `title` attribute as long as `'ui:title'` is not defined.
 *
 * When using dynamic fields you need to consider accessibility and screen readers. For these reasons it is not recommended to change fields live, because the changes may not get read out. Instead, it is recommended to already have some previous `formData` set so that when you get to the dynamic fields, they are static while on that page.
 * @property {boolean} [useVaCards] For arrays on a single page. If true, will use the `VaCard` component to wrap each item in the array. Has a white background with border instead of gray background.
 * @property {boolean} [reflectInputError] Whether or not to add usa-input--error as class if error message is outside of component.
 * @property {string} [reviewItemHeaderLevel] Optional level for the item-header on Review page - for arrays. Defaults to '5' for a <h5> header-tag.
 * @property {boolean} [useAllFormData] `formData` will return all form data instead of just the current item in an array. Applicable to `ui:validations`. TODO other fields.
 * @property {boolean} [useDlWrap] On the review page, moves \<dl\> tag to immediately surrounding the \<dt\> field instead of using a \<div\>. \<dt\> fields should be wrapped in \<dl\> fields, so this fixes that a11y issue. Formats fields horizontally.
 * @property {'single' | 'multiple'} [useFormsPattern] Used if you want to define the formHeading and formDescription for the web component field, which can include JSX, so it can be read out by screen readers. Accepts 'single' for a single field on the page where the error will show on the entire block, or 'multiple' for multiple fields on the page where the error will show only on the field.
 * @property {boolean} [useHeaderStyling] Enables developer to implement and use alternate style classes for auto generated html elements such as in ObjectField or ArrayField
 * @property {boolean} [uswds] For web components. `true` will use the v3 web components and is the default option for `'ui:webComponentField'` if omitted. `false` will use the v1 web components.
 * @property {React.ReactNode} [viewComponent]
 * @property {React.ReactNode} [viewField] For arrays. The display of each item after you've added it.
 * @property {'2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'} [width] For web component text inputs. Displays the input at a specific width. Accepts 2xs (4ex), xs (7ex), sm or small (10ex), md or medium (20ex), lg (30ex), xl (40ex), and 2xl (50ex).
 * @property {string} [widgetClassNames] additional CSS classes to add to the widget. For web components use classNames instead.
 * @property {Record<string, any>} [widgetProps]
 */

/**
 * @typedef {{
 *   $ref?: string,
 *   default?: string,
 *   enum?: string[] | boolean[],
 *   enumNames?: string[],
 *   format?: 'email' | 'date' | 'date-time' | 'uri' | 'data-url' | OrAnyString,
 *   hideMaxItemsAlert?: boolean,
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

/**
 * @typedef {Object} WebComponentFieldProps
 * @property {string | JSX.Element | Function} description
 * @property {string} textDescription
 * @property {string | JSX.Element} label
 * @property {boolean} required
 * @property {string} error
 * @property {UIOptions} uiOptions
 * @property {number | string} index
 * @property {{
 *  schema: SchemaOptions,
 *  uiSchema: UISchemaOptions,
 *  formData: any,
 * } | {
 *  [key: string]: any
 * }} childrenProps
 * @property {any} DescriptionField
 */

/**
 * @typedef {{
 *   getItemName: (itemData: any, index: number, fullData: any) => string,
 *   itemData: any,
 *   nounPlural: string,
 *   nounSingular: string,
 *   index?: number,
 * }} ArrayBuilderTextProps
 */

/**
 * @typedef {{
 *   alertItemUpdated?: (props: ArrayBuilderTextProps) => string,
 *   alertItemDeleted?: (props: ArrayBuilderTextProps) => string,
 *   alertMaxItems?: (props: ArrayBuilderTextProps) => string,
 *   cancelAddButtonText?: (props: ArrayBuilderTextProps) => string,
 *   cancelAddDescription?: (props: ArrayBuilderTextProps) => string,
 *   cancelAddReviewDescription?: (props: ArrayBuilderTextProps) => string,
 *   cancelAddYes?: (props: ArrayBuilderTextProps) => string,
 *   cancelAddNo?: (props: ArrayBuilderTextProps) => string,
 *   cancelAddTitle?: (props: ArrayBuilderTextProps) => string,
 *   cancelEditButtonText?: (props: ArrayBuilderTextProps) => string,
 *   cancelEditDescription?: (props: ArrayBuilderTextProps) => string,
 *   cancelEditReviewDescription?: (props: ArrayBuilderTextProps) => string,
 *   cancelEditYes?: (props: ArrayBuilderTextProps) => string,
 *   cancelEditNo?: (props: ArrayBuilderTextProps) => string,
 *   cancelEditTitle?: (props: ArrayBuilderTextProps) => string,
 *   cardDescription?: (props: ArrayBuilderTextProps) => string,
 *   cardItemMissingInformation?: (itemData: any) => string,
 *   editSaveButtonText?: (props: ArrayBuilderTextProps) => string,
 *   getItemName?: (itemData: any, index: number, fullData: any) => string,
 *   deleteDescription?: (props: ArrayBuilderTextProps) => string,
 *   deleteNeedAtLeastOneDescription?: (props: ArrayBuilderTextProps) => string,
 *   deleteNo?: (props: ArrayBuilderTextProps) => string,
 *   deleteTitle?: (props: ArrayBuilderTextProps) => string,
 *   deleteYes?: (props: ArrayBuilderTextProps) => string,
 *   reviewAddButtonText?: (props: ArrayBuilderTextProps) => string,
 *   summaryTitle?: (props: ArrayBuilderTextProps) => string,
 *   summaryTitleWithoutItems?: (props: ArrayBuilderTextProps) => string,
 *   summaryDescription?: (props: ArrayBuilderTextProps) => string,
 *   summaryDescriptionWithoutItems?: (props: ArrayBuilderTextProps) => string,
 *   summaryAddLinkText?: (props: ArrayBuilderTextProps) => string,
 *   summaryAddButtonText?: (props: ArrayBuilderTextProps) => string,
 *   yesNoBlankReviewQuestion?: (props: ArrayBuilderTextProps) => string,
 * }} ArrayBuilderText
 */

/**
 * @typedef {Object} ArrayBuilderOptions
 * @property {string} arrayPath the formData key for the array e.g. `"employers"` for `formData.employers`
 * @property {string} nounSingular Used for text in cancel, remove, and modals. Used with nounPlural
 * ```
 * // Example:
 * nounSingular: "employer"
 * nounPlural: "employers"
 * ```
 * @property {string} nounPlural Used for text in cancel, remove, and modals. Used with nounSingular
 * ```
 * // Example:
 * nounSingular: "employer"
 * nounPlural: "employers"
 * ```
 * @property {boolean} [hideMaxItemsAlert] This will not display the alert when the [maxItems] number is reached.
 * @property {(item) => boolean} [isItemIncomplete] Will display error on the cards if item is incomplete. You should include all of your required fields here. e.g. `item => !item?.name`
 * @property {number} [maxItems] The maximum number of items allowed in the array. Omit to allow unlimited items.
 * @property {boolean} required This determines the flow type of the array builder. Required starts with an intro page, optional starts with the yes/no question (summary page).
 * @property {string} [reviewPath] Defaults to `'review-and-submit'` if not provided.
 * @property {ArrayBuilderText} [text] Override any default text used in the array builder pattern
 * @property {boolean} [useLinkInsteadOfYesNo]
 * @property {boolean} [useButtonInsteadOfYesNo]
 */

/**
 * @typedef {Object} ReplacerOptions
 * @property {boolean} [allowPartialAddress] Allows addresses with missing fields
 * @property {boolean} [replaceEscapedCharacters] Replaces escaped characters
 */
