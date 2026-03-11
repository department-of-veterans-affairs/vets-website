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
     * Selects Yes/No for array builder summary page based on test data or manual override.
     * Auto-detects the yes/no element by class name.
     * @param overrideValue - Optional manual override (true=Yes, false=No). If not provided, auto-determines based on test data.
     */
    selectArrayBuilderSummaryYesNo(overrideValue?: boolean): Chainable<Subject>;

    /**
     * Clicks array builder summary page add button with conditional logic to determine whether to add another item
     * based on test data and existing cards on the page. Auto-detects the button by class name.
     * @param overrideValue - Optional override: true=click to add, false=don't click
     */
    clickArrayBuilderSummaryAddButton(
      overrideValue?: boolean,
    ): Chainable<Subject>;

    /**
     * Clicks array builder summary page add link with conditional logic to determine whether to add another item
     * based on test data and existing cards on the page. Auto-detects the link by class name.
     * @param overrideValue - Optional override: true=click to add, false=don't click
     */
    clickArrayBuilderSummaryAddLink(
      overrideValue?: boolean,
    ): Chainable<Subject>;

    /**
     * General-purpose array builder summary continue command that auto-detects the pattern type
     * (yes/no radio, button, or link) and applies the appropriate interaction with conditional logic.
     * @param overrideValue - Optional override: true=add another, false=continue without adding
     */
    arrayBuilderSummaryContinue(overrideValue?: boolean): Chainable<Subject>;

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

    /**
     * For `addressUI` pattern
     * @param fieldName - The base name of the address field.
     * @param addressObject - The address object containing the address details.
     */
    fillAddressWebComponentPattern(
      fieldName: string,
      addressObject: object,
    ): Chainable<Subject>;

    /**
     * @param fields - The fields to fill.
     * @param index - The index of the field.
     * @param fillFieldsInVaCard - The callback function to fill fields in the va-card.
     * @param numItems - The total number of items.
     */
    fillFieldsInVaCardIfNeeded(
      fields: any,
      index: number,
      fillFieldsInVaCard: (fields: any, index: number) => void,
      numItems: number,
    ): Chainable<Subject>;

    // ----- va-file-input helpers -----

    /**
     * Fill a va-file-input web component with a file.
     * @param field - The `name` of a va-file-input, or the element itself.
     * @param value - Any defined value triggers the fill (pass `{}` for default).
     * @param file - Optional File object. Defaults to a minimal PNG.
     */
    fillVaFileInput(
      field: string | Element,
      value: any,
      file?: File,
    ): Chainable<Subject>;

    /**
     * Fill a va-file-input-multiple web component with one or more files.
     * @param field - The `name` of a va-file-input-multiple, or the element itself.
     * @param value - Any defined value triggers the fill (pass `{}` for default).
     * @param files - Optional array of File objects. Defaults to a single minimal PNG.
     */
    fillVaFileInputMultiple(
      field: string | Element,
      value: any,
      files?: File[],
    ): Chainable<Subject>;

    /**
     * Delete the uploaded file from a va-file-input and confirm the modal.
     * @param field - Optional `name` attribute selector.
     */
    deleteVaFileInput(field?: string): Chainable<Subject>;

    /**
     * Assert that a va-file-input shows an error matching the given pattern.
     * Checks both the `error` attribute and shadow-DOM `.usa-error-message`.
     * @param errorPattern - A string (partial match) or RegExp.
     * @param field - Optional `name` attribute selector.
     */
    expectVaFileInputError(
      errorPattern: string | RegExp,
      field?: string,
    ): Chainable<Subject>;

    /**
     * Assert "File is required." on a va-file-input.
     * Caller must trigger validation first (e.g. click "Continue").
     * @param field - Optional `name` attribute selector.
     */
    expectVaFileInputRequired(field?: string): Chainable<Subject>;

    /** Assert the "too big" error on a va-file-input. */
    expectVaFileInputErrorTooBig(field?: string): Chainable<Subject>;

    /** Assert the "too small" error on a va-file-input. */
    expectVaFileInputErrorTooSmall(field?: string): Chainable<Subject>;

    /** Assert the "empty file" error on a va-file-input. */
    expectVaFileInputErrorEmpty(field?: string): Chainable<Subject>;

    /** Assert the MIME-type mismatch error on a va-file-input. */
    expectVaFileInputErrorMimeTypeMismatch(field?: string): Chainable<Subject>;

    /** Assert the invalid encoding error on a va-file-input. */
    expectVaFileInputErrorInvalidEncoding(field?: string): Chainable<Subject>;

    /** Assert the "not accepted" file type error on a va-file-input. */
    expectVaFileInputErrorFileNotAccepted(field?: string): Chainable<Subject>;

    /**
     * Assert a file card is showing the expected filename after upload.
     * @param fileName - Expected file name.
     * @param field - Optional `name` attribute selector.
     */
    expectVaFileInputUploadSuccess(
      fileName: string,
      field?: string,
    ): Chainable<Subject>;

    /**
     * Handle the encrypted-PDF unlock flow on a va-file-input.
     * @param password - Password to enter.
     * @param field - Optional `name` attribute selector.
     */
    unlockVaFileInputEncryptedPdf(
      password: string,
      field?: string,
    ): Chainable<Subject>;

    /**
     * Upload an encrypted PDF to a va-file-input, enter the password,
     * and confirm it is unlocked.
     * @param field - The `name` attribute selector (or element).
     * @param file - The encrypted PDF File object.
     * @param password - The password to unlock the PDF.
     */
    fillAndUnlockEncryptedPdfVaFileInput(
      field: string,
      file: File,
      password: string,
    ): Chainable<Subject>;

    /**
     * Set the additional-info va-select inside a va-file-input.
     * @param selectValue - The option value to select.
     * @param field - Optional `name` attribute selector.
     */
    selectVaFileInputAdditionalInfo(
      selectValue: string,
      field?: string,
    ): Chainable<Subject>;

    /**
     * Assert additional-info va-select error.
     * @param expectedError - Expected error text.
     * @param field - Optional `name` attribute selector.
     */
    expectVaFileInputAdditionalInfoError(
      expectedError: string,
      field?: string,
    ): Chainable<Subject>;

    /**
     * Wait for the additional-info va-select to render inside a
     * va-file-input.  Call before triggering form validation so RJSF
     * registers the va-select.
     * @param field - Optional `name` attribute selector.
     */
    waitForVaFileInputAdditionalInfo(field?: string): Chainable<Subject>;

    // ----- va-file-input-multiple helpers -----

    /**
     * Delete a file from a va-file-input-multiple and confirm the modal.
     * @param field - Optional `name` attribute of the parent.
     * @param index - Which child file-input to target (default 0).
     */
    deleteVaFileInputMultiple(
      field?: string,
      index?: number,
    ): Chainable<Subject>;

    /**
     * Assert that a child va-file-input inside va-file-input-multiple
     * shows an error matching the given pattern.
     * @param errorPattern - A string (partial match) or RegExp.
     * @param field - Optional `name` attribute of the parent.
     * @param index - Which child file-input to check (default 0).
     */
    expectVaFileInputMultipleError(
      errorPattern: string | RegExp,
      field?: string,
      index?: number,
    ): Chainable<Subject>;

    /**
     * Assert "File is required." on a va-file-input-multiple.
     * Caller must trigger validation first (e.g. click "Continue").
     * @param field - Optional `name` attribute of the parent.
     */
    expectVaFileInputMultipleRequired(field?: string): Chainable<Subject>;

    /** Assert the "too big" error on a va-file-input-multiple child. */
    expectVaFileInputMultipleErrorTooBig(
      field?: string,
      index?: number,
    ): Chainable<Subject>;

    /** Assert the "too small" error on a va-file-input-multiple child. */
    expectVaFileInputMultipleErrorTooSmall(
      field?: string,
      index?: number,
    ): Chainable<Subject>;

    /** Assert the "empty file" error on a va-file-input-multiple child. */
    expectVaFileInputMultipleErrorEmpty(
      field?: string,
      index?: number,
    ): Chainable<Subject>;

    /** Assert the MIME-type mismatch error on a va-file-input-multiple child. */
    expectVaFileInputMultipleErrorMimeTypeMismatch(
      field?: string,
      index?: number,
    ): Chainable<Subject>;

    /** Assert the invalid encoding error on a va-file-input-multiple child. */
    expectVaFileInputMultipleErrorInvalidEncoding(
      field?: string,
      index?: number,
    ): Chainable<Subject>;

    /** Assert the "not accepted" file type error on a va-file-input-multiple child. */
    expectVaFileInputMultipleErrorFileNotAccepted(
      field?: string,
      index?: number,
    ): Chainable<Subject>;

    /**
     * Handle the encrypted-PDF unlock flow inside a va-file-input-multiple.
     * @param password - Password to enter.
     * @param field - Optional `name` attribute of the parent.
     * @param index - Which child file-input to target (default 0).
     */
    unlockVaFileInputMultipleEncryptedPdf(
      password: string,
      field?: string,
      index?: number,
    ): Chainable<Subject>;

    /**
     * Upload an encrypted PDF to a va-file-input-multiple, enter the password,
     * and confirm it is unlocked.
     * @param field - The `name` attribute of the parent (or element).
     * @param file - The encrypted PDF File object.
     * @param password - The password to unlock the PDF.
     * @param index - Which child file-input to target (default 0).
     */
    fillAndUnlockEncryptedPdfVaFileInputMultiple(
      field: string,
      file: File,
      password: string,
      index?: number,
    ): Chainable<Subject>;

    /**
     * Set the additional-info va-select inside a child of va-file-input-multiple.
     * @param selectValue - The option value to select.
     * @param field - Optional `name` attribute of the parent.
     * @param index - Which child file-input to target (default 0).
     */
    selectVaFileInputMultipleAdditionalInfo(
      selectValue: string,
      field?: string,
      index?: number,
    ): Chainable<Subject>;

    /**
     * Assert additional-info va-select error on a child of va-file-input-multiple.
     * @param expectedError - Expected error text.
     * @param field - Optional `name` attribute of the parent.
     * @param index - Which child file-input to check (default 0).
     */
    expectVaFileInputMultipleAdditionalInfoError(
      expectedError: string,
      field?: string,
      index?: number,
    ): Chainable<Subject>;

    /**
     * Wait for the additional-info va-select to render inside a
     * va-file-input-multiple child.  Call before triggering form validation
     * so RJSF registers the va-select.
     * @param field - Optional `name` attribute of the parent.
     * @param index - Which child file-input to target (default 0).
     */
    waitForVaFileInputMultipleAdditionalInfo(
      field?: string,
      index?: number,
    ): Chainable<Subject>;
  }
}
