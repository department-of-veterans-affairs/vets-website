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
     * @param field - The "name" of a va-text-input, or the element itself.
     * @param value
     */
    fillPage(): Chainable<Subject>;

    /**
     * Custom command to fill a text input web component.
     * @param field - The "name" of a va-text-input, or the element itself.
     * @param value
     */
    fillTextWebComponent(
      field: string | Element,
      value: string,
    ): Chainable<Subject>;

    /**
     * Custom command to fill a textarea web component.
     * @param field - The "name" of a va-textarea, or the element itself.
     * @param value
     */
    fillTextAreaWebComponent(field: string, value: string): Chainable<Subject>;

    selectRadio(field: string, value: string): Chainable<Subject>;

    /**
     * Custom command to select a radio web component.
     * @param field - The "name" of a va-radio-option
     * @param value
     */
    selectRadioWebComponent(
      field: string,
      value: string | boolean,
    ): Chainable<Subject>;

    /**
     * Custom command to select a select web component.
     * @param field - The "name" of a va-select, or the element itself.
     * @param value
     */
    selectDropdownWebComponent(
      field: string | Element,
      value: string,
    ): Chainable<Subject>;

    /**
     * Custom command to select a checkbox web component.
     * @param field - The "name" of a va-checkbox, or the element itself.
     * @param value
     */
    selectCheckboxWebComponent(
      field: string | Element,
      value: string,
    ): Chainable<Subject>;

    selectYesNo(fieldName: string, condition: boolean): Chainable<Subject>;

    /**
     * Custom command to fill text in a web component.
     * @param field - The "name" of a va-radio-option, or the element itself.
     * @param value
     */
    selectYesNoWebComponent(field: string, value: boolean): Chainable<Subject>;

    /**
     * Custom command to fill text in a web component.
     * @param field - The "name" of a va-memorable-date
     * @param value - A string value of format XXXX-XX-XX
     */
    fillMemorableDateWebComponent(
      field: string,
      value: string,
    ): Chainable<Subject>;

    injectAxeThenAxeCheck(): Chainable<Subject>;
  }
}
