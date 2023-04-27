/**
 * @typedef {{
 *  'ui:title': string,
 *  'ui:description': string | JSX.Element,
 *  'ui:required': (formData: any) => boolean,
 *  'ui:autocomplete': string,
 *  'ui:options': {
 *    hint: string,
 *    hideIf: (formData: any) => boolean,
 *    hideOnReview: boolean,
 *    expandUnder: string,
 *    expandUnderCondition: boolean,
 *    keepInPageOnReview: boolean,
 *    updateSchema: (formData: any) => any,
 *    replaceSchema: (formData: any) => any,
 *    viewComponent: (props: any) => JSX.Element,
 *    className: string,
 *  },
 *  'ui:errorMessages': {
 *     pattern: string,
 *     required: string,
 *  }
 *  'ui:disabled': boolean,
 *  'ui:reviewField': (props: any) => JSX.Element,
 *  'ui:inputmode': string,
 *  'ui:widget': string,
 *  'ui:hidden': boolean,
 *  'ui:validations': ((errors, value) => void)[]
 *  'ui:webComponentField': (props: any) => JSX.Element
 * }} UISchemaOptions
 */

/**
 * @typedef {{
 *  type: string,
 *  pattern : string,
 *  properties: Record<string, any>,
 *  required: string[]
 *  minLength: number,
 *  maxLength: number,
 * }} SchemaOptions
 */
