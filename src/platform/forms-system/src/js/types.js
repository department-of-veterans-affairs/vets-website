/**
 * @file Generic types for the form system
 *
 * Used for intellisense (autocompletion)
 */

/**
 * @callback JSXElementFunction
 * @param {Object} props
 * @returns {JSX.Element}
 */

/**
 * @callback FormConfigCallback
 * @param {Object} formConfig
 * @returns {void}
 */

/**
 * @callback SubmitCallback
 * @param {Object} form
 * @param {Object} formConfig
 * @returns {Promise<any>}
 */

/**
 * @callback TransformForSubmitCallback
 * @param {Object} form
 * @param {Object} formConfig
 * @returns {any}
 */

/**
 * @typedef {Object} FormConfig
 * @property {Array<Object>} [additionalRoutes]
 * @property {string} [ariaDescribedBySubmit]
 * @property {Record<string, FormConfigChapter>} [chapters]
 * @property {JSXElementFunction} [confirmation]
 * @property {JSX.Element | React.ReactNode} [CustomReviewTopContent]
 * @property {JSX.Element | React.ReactNode} [CustomTopContent]
 * @property {CustomText} [customText]
 * @property {Record<string, SchemaOptions> | Record<string, any>} [defaultDefinitions]
 * @property {Dev} [dev] - object of dev-only options
 * @property {Downtime} [downtime]
 * @property {JSXElementFunction} [errorText]
 * @property {JSXElementFunction} [footerContent]
 * @property {string} [formId]
 * @property {JSXElementFunction} [formSavedPage]
 * @property {JSXElementFunction} [getHelp]
 * @property {boolean} [hideNavButtons]
 * @property {boolean} [hideUnauthedStartLink]
 * @property {React.ReactNode | JSXElementFunction} [introduction]
 * @property {Array<Function>} [migrations]
 * @property {FormConfigCallback} [onFormLoaded]
 * @property {boolean} [prefillEnabled]
 * @property {Function} [prefillTransformer]
 * @property {PreSubmitInfo} [preSubmitInfo]
 * @property {Object} [reviewErrors]
 * @property {string} [rootUrl]
 * @property {SavedFormMessages} [savedFormMessages]
 * @property {SaveInProgress} [saveInProgress]
 * @property {boolean} [showReviewErrors]
 * @property {boolean} [showSaveLinkAfterButtons] by default, when logged in, a save link is present before the back/continue buttons, but setting this to true will make it show up below it.
 * @property {JSXElementFunction} [submissionError]
 * @property {SubmitCallback} [submit]
 * @property {JSXElementFunction} [submitErrorText]
 * @property {string} [submitUrl]
 * @property {string} [subTitle]
 * @property {string} [title]
 * @property {string} [trackingPrefix]
 * @property {TransformForSubmitCallback} [transformForSubmit]
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
 * @description custom text options throughout the form, such as for save in progress, app type, and submit button text
 * @property {string} [appSavedSuccessfullyMessage]
 * @property {string} [appType]
 * @property {string} [continueAppButtonText]
 * @property {string} [reviewPageTitle]
 * @property {string} [startNewAppButtonText]
 * @property {string} [submitButtonText]
 */

/**
 * @typedef {Object} Dev
 * @description dev only options (not applicable in production)
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
 * @property {JSXElementFunction} [CustomComponent]
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
 * @property {function(): string} [restartFormCallback] return restart destination url
 */

/**
 * @typedef {Object} StatementOfTruth
 * @property {string | JSX.Element} [body]
 * @property {string | function(formData): string} [fullNamePath] defaults to 'veteran.fullName'
 * @property {string} [heading] defaults to 'Statement of truth'
 * @property {string} [messageAriaDescribedby] defaults to 'Statement of truth'
 * @property {string} [textInputLabel] defaults to 'Your full name'
 */

/**
 * @callback FormConfigChapterTitle
 * @param {Object} props
 * @param {Object} props.formData
 * @param {Object} props.formConfig
 * @returns {string}
 */

/**
 * @typedef {Object} FormConfigChapter
 * @property {Record<string, FormConfigPage>} [pages]
 * @property {string | FormConfigChapterTitle} [title]
 * @property {boolean} [hideFormNavProgress]
 * @property {boolean} [hideFormTitle]
 * @property {boolean} [hideOnReviewPage]
 * @property {React.ReactNode} [reviewDescription]
 */

/**
 * @callback ContentBeforeButtons
 * @param {Object} props
 * @param {Object} props.formData
 * @param {Object} props.formContext
 * @param {Object} props.router
 * @param {function} props.setFormData
 * @returns {JSX.Element}
 */

/**
 * @callback FormConfigDepends
 * @param {Object} formData
 * @returns {boolean}
 */

/**
 * @callback OnNavBack
 * @param {Object} props
 * @param {Object} props.formData
 * @param {function} props.goPath
 * @param {function} props.goPreviousPath
 * @param {PageList} props.pageList
 * @param {string} props.pathname
 * @param {function} props.setFormData
 * @param {Object} props.urlParams
 * @returns {void}
 */

/**
 * @callback OnNavForward
 * @param {Object} props
 * @param {Object} props.formData
 * @param {function} props.goPath
 * @param {function} props.goNextPath
 * @param {PageList} props.pageList
 * @param {string} props.pathname
 * @param {function} props.setFormData
 * @param {Object} props.urlParams
 * @returns {void}
 */

/**
 * @typedef {Object} FormConfigPage
 * @property {boolean} [allowPathWithNoItems] For array pages. if true, will allow a path with no items in the array at /0. Used with showPagePerItem.
 * @property {string} [arrayPath] the name of the property in the schema/uiSchema that is `type: 'array'`
 * @property {ContentBeforeButtons} [ContentBeforeButtons] React element that appears after the form but before save in progress and the navigation buttons
 * @property {JSXElementFunction} [CustomPage]
 * @property {JSXElementFunction} [CustomPageReview]
 * @property {FormConfigDepends} [depends] optional condition when page should be shown or not
 * @property {Object} [initialData]
 * @property {boolean} [customPageUsesPagePerItemData] Used with `CustomPage` and arrays. If true, will treat `data` (`formData`) and `setFormData` at the array level instead of the entire `formData` level, which matches how default pages work.
 * @property {boolean} [hideNavButtons] Used to hide the 'Continue' and 'Back' buttons
 * @property {function(formData) : void} [onContinue] Called when user clicks continue button. For simple callbacks/events. If you instead want to navigate to a different page, use onNavForward.
 * @property {OnNavBack} [onNavBack] Called instead of default navigation when user clicks back button. Use goPath or goPreviousPath to navigate.
 * @property {OnNavForward} [onNavForward] Called instead of default navigation when user clicks continue button. Use goPath or goNextPath to navigate.
 * @property {function(data): boolean} [itemFilter]
 * @property {string} [path] url path for page e.g. `'name-of-path'`, or `'name-of-path/:index'` for an array item page. Results in `http://localhost:3001/my-form/name-of-path`
 * @property {string} [returnUrl]
 * @property {SchemaOptions} [schema]
 * @property {string | Function} [scrollAndFocusTarget]
 * @property {boolean} [showPagePerItem] if true, will show an additional page for each item in the array at `'name-of-path/:index'`
 * @property {boolean} [hideSaveLinkAndStatus] will hide the save application later and save in progress message near the back/continue buttons
 * @property {string | function(formData): string} [title] Will show on review page (may require more than one word to show)
 * @property {UISchemaOptions} [uiSchema]
 * @property {function(item, index): void} [updateFormData]
 */

/**
 * @callback CustomPageType
 * @param {Object} props
 * @param {string} props.name
 * @param {string} props.title
 * @param {Object} props.data
 * @param {number} props.pagePerItemIndex
 * @param {boolean} props.onReviewPage
 * @param {string} props.trackingPrefix
 * @param {function} props.uploadFile
 * @param {SchemaOptions} props.schema
 * @param {UISchemaOptions} props.uiSchema
 * @param {function} props.goBack
 * @param {function} props.goForward
 * @param {function} props.goToPath
 * @param {function} props.onContinue
 * @param {function} props.onChange
 * @param {function} props.onSubmit
 * @param {function} props.setFormData
 * @param {ContentBeforeButtons} props.contentBeforeButtons
 * @param {React.ReactNode} props.contentAfterButtons
 * @param {Object} props.appStateData
 * @param {Object} props.formContext
 * @returns {React.ReactNode}
 */

/**
 * @typedef {FormConfigPage} PageSchema The schema for a page (uiSchema and schema).
 */

/**
 * @typedef {Object} PageListUnique
 * @property {string} pageKey
 * @property {string} path
 * @property {string} [chapterKey]
 * @property {string} [chapterTitle]
 */

/**
 * @typedef {Array<PageListUnique & FormConfigPage>} PageList
 */

/**
 * @name UISchemaOptions
 * @description Duplicate of UISchemaOptions for jsdocs only (This allows `ui:name` format to show up in the docs)
 * @property {UISchemaOptions} [items] For arrays. The schema for each item in the array.
 * @property {UIAutocomplete} ['ui:autocomplete']
 * @property {UIDescription} ['ui:description'] Additional text or JSX displayed underneath the label.
 * @property {boolean} ['ui:disabled']
 * @property {UIErrorMessages} ['ui:errorMessages']
 * @property {React.ReactNode} ['ui:field']
 * @property {boolean} ['ui:hidden']
 * @property {React.ReactNode} ['ui:objectViewField']
 * @property {UIOptions} ['ui:options']
 * @property {string[]} ['ui:order']
 * @property {UIRequired} ['ui:required']
 * @property {React.ReactNode} ['ui:reviewField']
 * @property {React.ReactNode} ['ui:reviewWidget']
 * @property {UITitle} ['ui:title'] The title of the field.
 * @property {UIValidations} ['ui:validations']
 * @property {React.ReactNode} ['ui:webComponentField'] If specified, will render using web component patterns instead of default RJSF widgets. Accepts react components such as as VaTextInputField.
 * @property {UIWidget} ['ui:widget'] Deprecated. Favor using 'ui:webComponentField' instead.
 */

/**
 * @ignoreDocs
 * @typedef {{
 *    items?: UISchemaOptions,
 *   'ui:autocomplete'?: UIAutocomplete,
 *   'ui:description'?: UIDescription,
 *   'ui:disabled'?: boolean,
 *   'ui:errorMessages'?: UIErrorMessages,
 *   'ui:field'?: React.ReactNode,
 *   'ui:hidden'?: boolean,
 *   'ui:objectViewField'?: React.ReactNode,
 *   'ui:options'?: UIOptions,
 *   'ui:order'?: string[],
 *   'ui:required'?: UIRequired,
 *   'ui:reviewField'?: React.ReactNode,
 *   'ui:reviewWidget'?: React.ReactNode,
 *   'ui:title'?: UITitle,
 *   'ui:validations'?: UIValidations,
 *   'ui:webComponentField'?: React.ReactNode,
 *   'ui:widget'?: UIWidget,
 * } & {
 *  [key: string]: UISchemaOptions | {}
 * }} UISchemaOptions
 */

/**
 * @callback UITitleFunction
 * @param {Object} props
 * @param {Object} props.formData
 * @param {Object} props.formConfig
 * @returns {string | JSX.Element}
 */

/**
 * @callback UIDescriptionFunction
 * @param {Object} props
 * @param {Object} props.formData
 * @param {Object} props.formConfig
 * @returns {string | JSX.Element}
 */

/**
 * @callback UIRequired
 * @param {any} formData
 * @param {boolean} index For arrays. The index of the item.
 * @returns {boolean}
 */

/** @typedef {string | JSX.Element | React.ReactNode | UITitleFunction} UITitle for ui:title. Can only be a string for web component fields, but may also be a JSX or function for page titles */
/** @typedef {string | JSX.Element | React.ReactNode | UIDescriptionFunction} UIDescription for ui:description. May also be a function that returns a string or JSX.Element depending on the use case. */
/** @typedef {boolean} UITile use tile style - for radio and checkbox */
/** @typedef {string} UIHint The gray hint text below the label and description for a field */
/** @typedef {'2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'} UIWidth Displays the text input at a specific width. Accepts 2xs (4ex), xs (7ex), sm or small (10ex), md or medium (20ex), lg (30ex), xl (40ex), and 2xl (50ex). */
/** @typedef {boolean} UICharcount Whether a web-component should show a character count message. Has no effect without `maxLength` being set in the schema. */
/** @typedef {'on' | 'off' | 'name' | 'honorific-prefix' | 'given-name' | 'additional-name' | 'family-name' | 'honorific-suffix' | 'nickname' | 'email' | 'username' | 'current-password' | 'organization-title' | 'organization' | 'street-address' | 'address-line1' | 'address-line2' | 'address-line3' | 'address-level4' | 'address-level3' | 'address-level2' | 'address-level1' | 'country' | 'country-name' | 'postal-code' | 'cc-name' | 'cc-given-name' | 'cc-additional-name' | 'cc-family-name' | 'cc-number' | 'cc-exp' | 'cc-exp-month' | 'cc-exp-year' | 'cc-csc' | 'cc-type' | 'transaction-currency' | 'transaction-amount' | 'language' | 'bday' | 'bday-day' | 'bday-month' | 'bday-year' | 'sex' | 'tel' | 'tel-country-code' | 'tel-national' | 'tel-area-code' | 'tel-local' | 'tel-extension' | 'impp' | 'url' | 'photo' | OrAnyString} UIAutocomplete Whether a web-component should show a character count message. Has no effect without `maxLength` being set in the schema. */
/** @typedef {'number' | 'text' | 'email' | 'search' | 'tel' | 'url' | OrAnyString} UIInputType Keyboard type for mobile users. Equivalent to HTML input 'type' attribute. */
/** @typedef {'' | '1' | '2' | '3' | '4' | '5'} UILabelHeaderLevel Change the label of the field into a header e.g. `h3` with specified header level. */
/** @typedef {Record<string, string>} UILabels An object of `property: "value"` */
/** @typedef {'yesNo' | 'checkbox' | 'radio' | 'select' | 'email' | 'date' | 'textarea' | OrAnyString | JSXElementFunction} UIWidget */
/** @typedef {'single' | 'multiple'} UIUseFormsPattern  Used if you want to define the formHeading and formDescription for the web component field, which can include JSX, so it can be read out by screen readers. Accepts 'single' for a single field on the page where the error will show on the entire block, or 'multiple' for multiple fields on the page where the error will show only on the field. */
/** @typedef {string | JSX.Element} UIFormDescription Used with `useFormsPattern`. A JSX or string description that it is also a11y (screen reader) friendly. useFormsPattern and uswds must be true. */
/** @typedef {string} UIFormHeading Used with `useFormsPattern`. Intended to be used as the form page header. useFormsPattern and uswds must be true. */
/** @typedef {number} UIFormHeadingLevel Used with `useFormsPattern`. The header level of the formHeading. useFormsPattern and uswds must be true. */

/**
 * @callback UIHideIf Conditional logic if the field should be hidden
 * @param {any} formData
 * @returns {boolean}
 */

/**
 * @callback UIValidation
 * @param {any} errors
 * @param {any} formData
 * @param {UISchemaOptions} uiSchema
 * @param {SchemaOptions} schema
 * @param {UIErrorMessages} errorMessages
 * @returns {void}
 */

/** @typedef {Array<UIValidation>} UIValidations */

/**
 * @name UIErrorMessages
 * @description Duplicate of UIErrorMessages for jsdocs only (This allows complex types to show up in the docs)
 * @property {string} [atLeastOne]
 * @property {string} [enum]
 * @property {string} [maxItems]
 * @property {string} [maxLength]
 * @property {string} [minItems]
 * @property {string} [minLength]
 * @property {string} [pattern] Error message for regex pattern validation
 * @property {string} [required] Error message when user doesn't enter the field but it is required
 */

/**
 * @ignoreDocs
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

/**
 * @callback ReplaceOrUpdateSchema
 * @param {any} formData
 * @param {SchemaOptions} schema
 * @param {UISchemaOptions} uiSchema
 * @param {number} index
 * @param {string[]} Path
 * @returns {SchemaOptions}
 */

/**
 * @callback UpdateUiSchema
 * @param {any} formData
 * @returns {UISchemaOptions}
 */

/**
 * @callback ExpandUnderConditionFunction
 * @param {string} value
 * @param {any} formData
 * @returns {boolean}
 */

/**
 * @typedef {Object} UIOptions
 * @property {string} [ariaDescribedby] The id of the element that describes the field. Use `messageAriaDescribedby` for web components.
 * @property {boolean} [charcount] Whether a web-component should show a character count message. Has no effect without `maxLength` being set in the schema.
 * @property {string} [classNames] additional CSS classes to add to the field
 * @property {boolean} [confirmRemove] For arrays. If true, will show a confirmation modal when removing an item.
 * @property {string} [confirmRemoveDescription] For arrays. Description for the confirmation modal when removing an item.
 * @property {string} [customTitle] For the review page, for arrays and some widgets. This doesn't appear to change any text, but is just used for a hack to prevent an outer DL wrapper. Often set to `' '`, and used with `useDlWrap: true` to get a11y issues to pass. Will format field title and body vertically instead of horizontally. `useDlWrap` will format text horizontally.
 * @property {number} [debounceRate] Used for AutoSuggest widget
 * @property {boolean} [displayEmptyObjectOnReview] For objects with empty properties object. This will display ui:title and ui:description on the review page.
 * @property {number} [doNotScroll] For arrays. By default when adding a new item it will scroll to the next item. Set this to true to disable that behavior.
 * @property {string} [duplicateKey] For arrays.
 * @property {boolean} [enableAnalytics] Enable google analytic events. Sent on blur. Use a browser extension such as Adswerve to view the events in the console.
 * @property {string} [expandUnder] The key of the uiSchema directly before this field
 * @property {boolean} [expandContentFocus] Used with expandUnder. When the field expands under, it exclusively shows a vertical, blue bar, is indented, and focuses on the field's input.
 * @property {boolean | ExpandUnderConditionFunction} [expandUnderCondition] `expandUnderCondition: (value, formData) => !!value`
 * @property {boolean} [forceDivWrapper] Used as an a11y helper when you need to wrap a field in a div
 * @property {string | JSX.Element} [formDescription] Used with `useFormsPattern`. A JSX or string description that it is also a11y (screen reader) friendly. useFormsPattern and uswds must be true.
 * @property {string} [formHeading] Used with `useFormsPattern`. Intended to be used as the form page header. useFormsPattern and uswds must be true.
 * @property {number} [formHeadingLevel] Used with `useFormsPattern`. The header level of the formHeading. useFormsPattern and uswds must be true.
 * @property {boolean} [freeInput] for AutoSuggest widget
 * @property {boolean} [generateIndividualItemHeaders] For array field generation that would use the "new item" logic. Items created before it will now have "item" headers attached to them if there are multiple and it is not the final one in the series.
 * @property {boolean} [hideEmptyValueInReview] Field will not be displayed in review page if empty if set to true
 * @property {UIHideIf} [hideIf] Conditional logic if the field should be hidden
 * @property {boolean} [hideLabelText] Hide the text above a form field. May be useful for checkbox widgets and some other corner cases.
 * @property {boolean} [hideTitle] For arrays.
 * @property {boolean} [hideOnReview] Used to hide a field on review page
 * @property {string} [hint] The hint text for the field. For web components.
 * @property {boolean} [includeRequiredLabelInTitle]
 * @property {Array<function(input): string>} [inputTransformers]
 * @property {UIInputType} [inputType] `"number" | "email" | "tel" | "url" | "text" | "search"`
 *
 * Keyboard type for mobile users. Equivalent to HTML input 'type' attribute.
 * @property {function(item): string} [itemAriaLabel] for arrays
 * @property {string} [itemName] The name of the item - for arrays. For example a value of 'Child' will result in 'Add another child', 'New child', and if 'using confirmRemove', 'Are you sure you want to remove this child item?', 'Yes, remove this child item'.
 * @property {boolean} [invalid] For web components. Whether or not aria-invalid will be set on the inner input. Useful when composing the component into something larger, like a date component.
 * @property {boolean} [keepInPageOnReview] Used to keep a field on the review page. Often used with arrays or expandUnder fields. When used with arrays, removes the default editor box on the review page and shows view-only data with an edit button instead.
 * @property {Record<string, string>} [labels] Used to specify radio button or yes/no labels
 * @property {UILabelHeaderLevel} [labelHeaderLevel] `"", "1", "2", "3", "4", "5"`
 *
 * The header level for the label. For web components such as radio buttons or checkboxes.
 * @property {string} [messageAriaDescribedby] For web components. An optional message that will be read by screen readers when the input is focused.
 * @property {boolean} [monthSelect] For VaMemorableDate web component. If true, will use a select dropdown for the month instead of an input.
 * @property {ReplaceOrUpdateSchema} [replaceSchema] `(formData, schema, uiSchema, index, path) => object`
 *
 * Replace the entire `schema` based on `formData`. Must provide the entire `schema` in the return. Recalculates on every form data change.
 *
 * Also accepts `title` one-off property to update `'ui:title'` as long as `'ui:title'` it is not defined. (can be useful if you are working inside of an array where `updateUiSchema` is not supported).
 *
 * When using dynamic fields you need to consider accessibility and screen readers. For these reasons it is not recommended to change fields live, because the changes may not get read out. Instead, it is recommended to already have some previous `formData` set so that when you get to the dynamic fields, they are static while on that page.
 * @property {ReplaceOrUpdateSchema} [updateSchema] `(formData, schema, uiSchema, index, path) => object`
 *
 * Update the `schema` based on `formData`. The function should return a partial `schema` of only the properties you want to update. Recalculates on every form data change.
 *
 * Also accepts `title` one-off property to update `'ui:title'` as long as `'ui:title'` it is not defined. (can be useful if you are working inside of an array where `updateUiSchema` is not supported).
 *
 * When using dynamic fields you need to consider accessibility and screen readers. For these reasons it is not recommended to change fields live, because the changes may not get read out. Instead, it is recommended to already have some previous `formData` set so that when you get to the dynamic fields, they are static while on that page.
 * @property {UpdateUiSchema} [updateUiSchema] `(formData) => partial uiSchema`
 *
 * Update the `uiSchema` based on `formData`. The function should return a partial `uiSchema` of only the properties you want to update, including `'ui:options'` if desired. Recalculates on every form data change.
 *
 * If you need page title or description to be dynamic, instead use `'ui:title'` and `'ui:description'` with a function (or `...titleUI()`) (doesn't work with fields but only the root).
 *
 * `updateUiSchema` does not work inside of an array, however a workaround for arrays is to use `updateSchema` which allows for a `title` attribute as long as `'ui:title'` is not defined.
 *
 * When using dynamic fields you need to consider accessibility and screen readers. For these reasons it is not recommended to change fields live, because the changes may not get read out. Instead, it is recommended to already have some previous `formData` set so that when you get to the dynamic fields, they are static while on that page.
 * @property {boolean} [useVaCards] For arrays on a single page. If true, will use the `VaCard` component to wrap each item in the array. Has a white background with border instead of gray background.
 * @property {boolean} [reflectInputError] Whether or not to add usa-input--error as class if error message is outside of component.
 * @property {string} [reviewItemHeaderLevel] Optional level for the item-header on Review page - for arrays. Defaults to '5' for a <h5> header-tag.
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
 * @name SchemaOptions
 * @description Duplicate of SchemaOptions for jsdocs only (This allows complex types to show up in the docs)
 * @property {string} [$ref] A reference to a schema that is defined elsewhere. This is useful for reusing the same schema in multiple places.
 * @property {string} [default]
 * @property {string[]} [enum]
 * @property {string[]} [enumNames]
 * @property {'email' | 'date' | 'date-time' | 'uri' | 'data-url' | OrAnyString} [format]
 * @property {SchemaOptions} [items] For arrays. The schema for each item in the array.
 * @property {number} [maxLength]
 * @property {number} [minLength]
 * @property {number} [minItems]
 * @property {number} [maxItems]
 * @property {SchemaOptions[]} [oneOf] An array of schemas, where each schema is a valid option.
 * @property {string} [pattern] A regex pattern that the value must match.
 * @property {Record<string, SchemaOptions>} [properties] For objects. The schema for each property in the object.
 * @property {string[]} [required] An array of required properties/fields for objects.
 * @property {'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array' | OrAnyString} [type]
 * @property {boolean} [uniqueItems]
 */

/**
 * @ignoreDocs
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

/**
 * @typedef {Object} WebComponentFieldProps
 * @property {string | JSX.Element | Function} description
 * @property {string} textDescription
 * @property {string | JSX.Element} label
 * @property {boolean} required
 * @property {string} error
 * @property {UIOptions} uiOptions
 * @property {number | string} index
 * @property {Object} childrenProps
 * @property {SchemaOptions} childrenProps.schema
 * @property {UISchemaOptions} childrenProps.uiSchema
 * @property {any} childrenProps.formData
 * @property {any} DescriptionField
 */

/**
 * @callback GetItemName
 * @param {any} itemData
 * @returns {string}
 */

/**
 * @typedef {Object} ArrayBuilderTextProps
 * @property {GetItemName} getItemName
 * @property {any} itemData
 * @property {string} nounPlural
 * @property {string} nounSingular
 * @memberof module:ArrayBuilderPatterns
 */

/**
 * @callback ArrayBuilderTextFunction
 * @param {ArrayBuilderTextProps} props
 * @returns {string}
 */

/**
 * @callback ArrayBuilderItemStringFunction
 * @param {Object} item
 * @returns {string}
 */

/**
 * @typedef {Object} ArrayBuilderText
 * @property {ArrayBuilderTextFunction} [alertItemUpdated]
 * @property {ArrayBuilderTextFunction} [alertItemDeleted]
 * @property {ArrayBuilderTextFunction} [alertMaxItems]
 * @property {ArrayBuilderTextFunction} [cancelAddButtonText]
 * @property {ArrayBuilderTextFunction} [cancelAddDescription]
 * @property {ArrayBuilderTextFunction} [cancelAddReviewDescription]
 * @property {ArrayBuilderTextFunction} [cancelAddYes]
 * @property {ArrayBuilderTextFunction} [cancelAddNo]
 * @property {ArrayBuilderTextFunction} [cancelAddTitle]
 * @property {ArrayBuilderTextFunction} [cancelEditButtonText]
 * @property {ArrayBuilderTextFunction} [cancelEditDescription]
 * @property {ArrayBuilderTextFunction} [cancelEditReviewDescription]
 * @property {ArrayBuilderTextFunction} [cancelEditYes]
 * @property {ArrayBuilderTextFunction} [cancelEditNo]
 * @property {ArrayBuilderTextFunction} [cancelEditTitle]
 * @property {ArrayBuilderTextFunction} [cardDescription]
 * @property {ArrayBuilderItemStringFunction} [cardItemMissingInformation]
 * @property {ArrayBuilderTextFunction} [editSaveButtonText]
 * @property {ArrayBuilderItemStringFunction} [getItemName]
 * @property {ArrayBuilderTextFunction} [deleteDescription]
 * @property {ArrayBuilderTextFunction} [deleteNeedAtLeastOneDescription]
 * @property {ArrayBuilderTextFunction} [deleteNo]
 * @property {ArrayBuilderTextFunction} [deleteTitle]
 * @property {ArrayBuilderTextFunction} [deleteYes]
 * @property {ArrayBuilderTextFunction} [reviewAddButtonText]
 * @property {ArrayBuilderTextFunction} [summaryTitle]
 * @property {ArrayBuilderTextFunction} [yesNoBlankReviewQuestion]
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
 * @property {function(item): boolean} [isItemIncomplete] Will display error on the cards if item is incomplete. You should include all of your required fields here. e.g. `item => !item?.name`
 * @property {number} [maxItems] The maximum number of items allowed in the array. Omit to allow unlimited items.
 * @property {boolean} required This determines the flow type of the array builder. Required starts with an intro page, optional starts with the yes/no question (summary page).
 * @property {string} [reviewPath] Defaults to `'review-and-submit'` if not provided.
 * @property {ArrayBuilderText} [text] Override any default text used in the array builder pattern
 */
