/// <reference types="cypress" />

/**
 * Add custom command interfaces here to get intellisense and type checking
 */
declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Checks the passed selector and children for axe violations.
     * @param {string} [context=main] - CSS/HTML selector for the container element to check with aXe.
     * @param {Object} [tempOptions={}] - Rules object to enable _13647 exception or modify aXe config.
     */
    axeCheck(): Chainable<Subject>;

    fill(selector: string, value: any): Chainable<Subject>;
    fillName(baseName: string, name: object): Chainable<Subject>;
    fillAddress(baseName: string, address: object): Chainable<Subject>;

    /**
     * Works with Date widget. And va-date and va-memorable-date web components;
     * expects dateString in YYYY-MM-DD format
     */
    fillDate(fieldName: string, dateString: string): Chainable<Subject>;

    /**
     * Fills an entire page automatically.
     * Use setting `useWebComponentFields` to also fill web component fields that are named 'root_field_subfield'.
     * ```
     * const testConfig = createTestConfig(
     *   {
     *     useWebComponentFields: true,
     *     ...
     *   });
     * ```
     */
    fillPage(): Chainable<Subject>;

    /**
     * Custom command to fill a va-text-input web component.
     * @param field - The "name" of a va-text-input, or the element itself.
     * @param value
     */
    fillVaTextInput(field: string | Element, value: string): Chainable<Subject>;

    /**
     * Custom command to fill a va-textarea web component.
     * @param field - The "name" of a va-textarea, or the element itself.
     * @param value
     */
    fillVaTextarea(field: string, value: string): Chainable<Subject>;

    selectRadio(field: string, value: string): Chainable<Subject>;

    /**
     * Custom command to select a va-radio-option web component.
     * @param field - The "name" of a va-radio-option
     * @param value
     */
    selectVaRadioOption(
      field: string,
      value: string | boolean,
    ): Chainable<Subject>;

    /**
     * Custom command to select a va-select web component.
     * @param field - The "name" of a va-select, or the element itself.
     * @param value
     */
    selectVaSelect(field: string | Element, value: string): Chainable<Subject>;

    /**
     * Custom command to select a va-checkbox web component.
     * @param field - The "name" of a va-checkbox, or the element itself.
     * @param value
     */
    selectVaCheckbox(
      field: string | Element,
      value: string,
    ): Chainable<Subject>;

    selectYesNo(fieldName: string, condition: boolean): Chainable<Subject>;

    /**
     * Custom command to fill a yes/no web component.
     * @param field - The "name" of a va-radio-option, or the element itself.
     * @param value
     */
    selectYesNoVaRadioOption(field: string, value: boolean): Chainable<Subject>;

    /**
     * Custom command to fill va-date web component.
     * @param field - The "name" of a va-date, or the element itself.
     * @param dateString - A string dateString of format XXXX-XX-XX
     * @param monthYearOnly - is only month/year or not
     */
    fillVaDate(
      field: string | Element,
      dateString: string,
      monthYearOnly?: boolean,
    ): Chainable<Subject>;

    /**
     * Custom command to fill va-memorable-date web component.
     * @param field - The "name" of a va-memorable-date, or the element itself.
     * @param dateString - A string dateString of format XXXX-XX-XX
     * @param useMonthSelect - Defaults to true. Whether to use the month select dropdown or a text field
     */
    fillVaMemorableDate(
      field: string | Element,
      dateString: string,
      useMonthSelect?: boolean,
    ): Chainable<Subject>;

    injectAxeThenAxeCheck(): Chainable<Subject>;
  }
}
