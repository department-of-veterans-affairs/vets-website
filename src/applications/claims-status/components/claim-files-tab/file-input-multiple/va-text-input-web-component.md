
# This is the va-text-input code from the VA web component repo pasted here SIMPLY FOR REFERENCE
- This file's home is found here: https://github.com/department-of-veterans-affairs/component-library/blob/main/packages/web-components/src/components/va-text-input/va-text-input.tsx
- This file is purely to more easily reference that code
- This file's imports are not valid because this file's code was just pasted here for reference
``` tsx
import {
  Build,
  Component,
  Element,
  Prop,
  State,
  Host,
  h,
  Event,
  EventEmitter,
  forceUpdate,
  Fragment,
} from '@stencil/core';
import classnames from 'classnames';
import { i18next } from '../..';
import {
  consoleDevError,
  getCharacterMessage,
  getHeaderLevel,
  isMessageSet,
} from '../../utils/utils';

if (Build.isTesting) {
  // Make i18next.t() return the key instead of the value
  i18next.init({ lng: 'cimode' });
}

/**
 * @nativeHandler onInput
 * @nativeHandler onBlur
 * @componentName Text input
 * @maturityCategory use
 * @maturityLevel best_practice
 * @guidanceHref form/text-input
 * @translations English
 * @translations Spanish
 * @translations Tagalog
 */

@Component({
  tag: 'va-text-input',
  styleUrl: 'va-text-input.scss',
  shadow: true,
})
export class VaTextInput {
  @Element() el: HTMLElement;

  /**
   * Input types we will allow to be specified with the "type" prop.
   */
  /* eslint-disable-next-line i18next/no-literal-string */
  allowedInputTypes = ['email', 'number', 'search', 'tel', 'text', 'url'];

  /**
   * The label for the text input.
   */
  @Prop() label?: string;

  /**
   * The error message to render.
   */
  @Prop({ reflect: true, mutable: true }) error?: string;

  /**
   * Whether or not to add usa-input--error as class if error message is outside of component
   */
  @Prop() reflectInputError?: boolean = false;

  /**
   * When `false`, hides the error message from view, but not from the screen reader. Should only be used if error is being displayed elsewhere. Must use kebab-case on this attribute for it to work properly.
   */
  // Dev note: When camelCase is used instead of kebab-case it doesn't reflect in the DOM and one of the CSS selectors won't be applied. Maybe worth revisiting to see if this is still the case after a stencil upgrade.
  @Prop({ reflect: true }) showInputError?: boolean = true;

  /**
   * Whether or not `aria-invalid` will be set on the inner input. Useful when
   * composing the component into something larger, like a date component.
   */
  @Prop() invalid?: boolean = false;

  /**
   * Set the input to required and render the (Required) text.
   */
  @Prop() required?: boolean = false;

  /**
   * The inputmode attribute.
   */
  @Prop() inputmode?:
    | 'decimal'
    | 'email'
    | 'numeric'
    | 'search'
    | 'tel'
    | 'text'
    | 'url';

  /**
   * The step attribute is a number, or the string 'any', that specifies the granularity of the value. For example: `<va-text-input type="number" step=".1"/>` enables float/decimal values to be valid and increment by one-tenth. <br/>
   * Defaults to 1 for every field type except for time and datetime-local which default to 60 (seconds). View more documentation on [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/step)
   */
  @Prop() step?: string;

  /**
   * The type attribute.
   */
  @Prop() type?: 'email' | 'number' | 'search' | 'tel' | 'text' | 'url' =
    'text';

  /**
   * The maximum number of characters allowed in the input.
   * Negative and zero values will be ignored.
   */
  @Prop() maxlength?: number;

  /**
   * Allows the browser to automatically complete the input.
   */
  @Prop() autocomplete?: string;

  /**
   * Emit component-library-analytics events on the blur event.
   */
  @Prop() enableAnalytics?: boolean = false;

  /**
   * The name to pass to the input element.
   */
  @Prop() name?: string;

  /**
   * The regular expression that the input element's value is checked against on submission
   */
  @Prop() pattern?: string;

  /**
   * Optional hint text.
   */
  @Prop() hint?: string;

  /**
   * An optional message that will be read by screen readers when the input is focused.
   */
  @Prop() messageAriaDescribedby?: string;

  /**
   * The value for the input.
   */
  @Prop({ mutable: true, reflect: true }) value?: string;

  /**
   * Adds styling based on status value
   */
  @Prop() success?: boolean = false;

  /**
   * Displays the input at a specific width. Accepts 2xs (4ex), xs (7ex), sm or small (10ex), md or medium (20ex), lg (30ex), xl (40ex), and 2xl (50ex).
   */
  @Prop() width?: string;

  /**
   * Enabling this will add a heading and description for integrating into the forms pattern. Accepts `single` or `multiple` to indicate if the form is a single input or will have multiple inputs.
   */
  @Prop() useFormsPattern?: string;

  /**
   * The heading level for the heading if `useFormsPattern`is true.
   */
  @Prop() formHeadingLevel?: number = 3;

  /**
   * The content of the heading if `useFormsPattern` is true.
   */
  @Prop() formHeading?: string;

  /**
   * Whether the component should show a character count message.
   * Has no effect without maxlength being set.
   */
  @Prop() charcount?: boolean = false;

  /**
   * Whether this component will be used to accept a currency value.
   */
  @Prop() currency?: boolean = false;

  /**
   * Displays a fixed prefix string at the start of the input field.
   */
  @Prop() inputPrefix?: string;

  /**
   * This property displays a prefix that accepts a string which represents icon name.
   */
  @Prop() inputIconPrefix?: string;

  /**
   * Displays a fixed suffix string at the end of the input field.
   */
  @Prop() inputSuffix?: string;

  /**
   * A string that represents the name of an icon passed to va-icon, which will be applied as a suffix to the input.
   */
  @Prop() inputIconSuffix?: string;

  /**
   * The min attribute specifies the minimum value for an input element
   * if the inputmode is numeric.
   */
  @Prop() min?: number | string;

  /**
   * The max attribute specifies the maximum value for an input element
   * if the inputmode is numeric.
   */
  @Prop() max?: number | string;

  /**
   * Adds a Datadog privacy class to the error message for cases when sensitive
   * information is included, such as in va-statement-of-truth.
   */
  @Prop() errorHasPii?: boolean = false;

  @State() paddingLeftValue: string = '0';
  @State() paddingRightValue: string = '0';

  /**
   * The event used to track usage of the component. This is emitted when the
   * input is blurred and enableAnalytics is true.
   */
  @Event({
    eventName: 'component-library-analytics',
    composed: true,
    bubbles: true,
  })
  componentLibraryAnalytics: EventEmitter;

  componentWillLoad() {
    this.updatePaddingLeft();
    this.updatePaddingRight();
  }

  componentDidUpdate() {
    this.updatePaddingLeft();
    this.updatePaddingRight();
  }

  private updatePaddingLeft = () => {
    if (this.inputIconPrefix) {
      // eslint-disable-next-line i18next/no-literal-string
      this.paddingLeftValue = '2.5rem';
    } else if (this.inputPrefix) {
      const textLength = this.inputPrefix
        ? Math.min(this.inputPrefix.length, 25)
        : null;
      // eslint-disable-next-line i18next/no-literal-string
      this.paddingLeftValue = `${textLength * 0.5 + 1}rem`;
    }
  };

  private updatePaddingRight = () => {
    const textLength = this.inputSuffix
      ? Math.min(this.inputSuffix.length, 25)
      : null;
    // eslint-disable-next-line i18next/no-literal-string
    this.paddingRightValue = `${textLength * 0.5 + 1}rem`;
  };

  private getInputType() {
    if (!this.allowedInputTypes.includes(this.type)) {
      consoleDevError(
        `The input type "${this.type}" is invalid or unsupported!`,
      );
      /* eslint-disable-next-line i18next/no-literal-string */
      return 'text';
    }
    if (this.max || this.min) {
      return 'number';
    }
    return this.type;
  }

  /**
   * This ensures that the `maxlength` property will be positive
   * or it won't be used at all
   */
  private getMaxlength() {
    if (this.maxlength <= 0) {
      consoleDevError('The maxlength prop must be positive!');
      return undefined;
    }

    return this.maxlength;
  }

  private handleInput = (e: InputEvent) => {
    const target = e.target as HTMLInputElement;
    this.value = target.value;
  };

  private handleBlur = (e: Event) => {
    if (this.enableAnalytics) {
      this.componentLibraryAnalytics.emit({
        componentName: 'va-text-input',
        action: 'blur',
        details: {
          label: this.label,
          value: this.value,
        },
      });
    }

    if (
      this.inputmode === 'decimal' ||
      this.inputmode === 'numeric' ||
      this.currency
    ) {
      let defaultError = i18next.t('number-error');
      const target = e.target as HTMLInputElement;
      const valid = target.checkValidity();
      if (!this.error && !valid) {
        this.error = defaultError;
        this.el.setAttribute('error', defaultError);
      } else if (this.error && this.error === defaultError && valid) {
        this.error = null;
        this.el.setAttribute('error', '');
      }
    }
  };

  // get the pattern for the input. note: currency has its own pattern
  private getPattern(): string {
    // currency should have its own pattern
    if (this.currency) {
      return '^[0-9]+(.[0-9]{2})?$';
    }

    const isNumericWithNoPattern =
      this.pattern === undefined &&
      (this.inputmode === 'decimal' || this.inputmode === 'numeric');
    // if input will hold a number then set the pattern to a default
    return isNumericWithNoPattern ? '[0-9]+(.[0-9]{1,})?' : this.pattern;
  }

  // get the inputmode for the component. if currency is true always use 'numeric'
  private getInputmode(): string {
    if (this.currency) {
      return 'numeric';
    }
    return this.inputmode ? this.inputmode : undefined;
  }

  // get the step for the input, if inputMode is decimal default to .01
  private getStep(): string {
    if (!this.step && this.inputmode === 'decimal') {
      return '.01';
    }
    return this.step ? this.step : undefined;
  }

  connectedCallback() {
    i18next.on('languageChanged', () => {
      forceUpdate(this.el);
    });
  }

  disconnectedCallback() {
    i18next.off('languageChanged');
  }

  render() {
    const {
      label,
      error,
      reflectInputError,
      showInputError,
      invalid,
      required,
      value,
      name,
      autocomplete,
      hint,
      handleInput,
      handleBlur,
      success,
      messageAriaDescribedby,
      width,
      useFormsPattern,
      formHeadingLevel,
      formHeading,
      charcount,
      min,
      max,
      currency,
      inputPrefix,
      inputIconPrefix,
      inputSuffix,
      inputIconSuffix,
      errorHasPii = false,
    } = this;
    const type = this.getInputType();
    const maxlength = this.getMaxlength();
    const inputmode = this.getInputmode();
    const step = this.getStep();

    const ariaDescribedbyIds =
      `${messageAriaDescribedby ? 'input-message' : ''} ${
        error ? 'input-error-message' : ''
      } ${charcount && maxlength ? 'charcount-message' : ''}`.trim() || null; // Null so we don't add the attribute if we have an empty string

    const ariaLabeledByIds =
      `${useFormsPattern && formHeading ? 'form-question' : ''} ${
        useFormsPattern ? 'form-description' : ''
      } ${useFormsPattern && label ? 'input-label' : ''}`.trim() || null;

    const pattern = this.getPattern();

    const currencyWrapper = classnames({
      'currency-wrapper': currency,
      'usa-input-group':
        inputSuffix || inputPrefix || inputIconPrefix || inputIconSuffix,
    });

    const getInputStyle = () => {
      if (this.paddingLeftValue !== '0' && inputPrefix) {
        return { paddingLeft: this.paddingLeftValue };
      } else if (inputSuffix) {
        return { paddingRight: this.paddingRightValue };
      } else {
        return {};
      }
    };

    const style = getInputStyle();

    const charCountTooHigh = maxlength && value?.length > maxlength;
    const labelClass = classnames({
      'usa-label': true,
      'usa-label--error': error,
    });
    const inputClass = classnames({
      'usa-input': true,
      'usa-input--success': success,
      'usa-input--error': error || reflectInputError,
      [`usa-input--${width}`]: width,
    });
    const messageClass = classnames({
      'usa-hint': true,
      'usa-character-count__status': maxlength,
      'usa-character-count__status--invalid':
        maxlength && value?.length > maxlength,
    });

    const errorClass = classnames({
      'usa-sr-only': !showInputError,
    });

    const errorMessageClass = classnames({
      'usa-error-message': true,
      'dd-privacy-hidden': errorHasPii,
    });

    const isFormsPattern =
      useFormsPattern === 'single' || useFormsPattern === 'multiple'
        ? true
        : false;
    let formsHeading = null;
    if (isFormsPattern) {
      const HeaderLevel = getHeaderLevel(formHeadingLevel);
      formsHeading = (
        <Fragment>
          {formHeading && (
            <HeaderLevel id="form-question" part="form-header">
              {formHeading}
            </HeaderLevel>
          )}
          <div id="form-description">
            <slot name="form-description"></slot>
          </div>
        </Fragment>
      );
    }

    return (
      <Host>
        {formsHeading}
        <div class="input-wrap">
          {label && (
            <label
              htmlFor="inputField"
              id="input-label"
              class={labelClass}
              part="label"
            >
              {label}
              {required && (
                <span class="usa-label--required">
                  {' '}
                  {i18next.t('required')}
                </span>
              )}
              {hint && <span class="usa-hint">{hint}</span>}
            </label>
          )}
          <slot></slot>
          <span id="input-error-message" role="alert" class={errorClass}>
            {error && (
              <Fragment>
                <span class="usa-sr-only">{i18next.t('error')}</span>
                <span
                  class={errorMessageClass}
                  data-dd-action-name={errorHasPii ? 'input error' : undefined}
                >
                  {error}
                </span>
              </Fragment>
            )}
          </span>
          <div class={currencyWrapper}>
            {currency && <div id="symbol">$</div>}
            {inputPrefix && (
              <div class="usa-input-prefix" part="input-prefix">
                {inputPrefix.substring(0, 25)}
              </div>
            )}
            {inputIconPrefix && (
              <div class="usa-input-prefix" part="input-prefix">
                <va-icon icon={inputIconPrefix} size={3} part="icon"></va-icon>
              </div>
            )}

            <input
              class={inputClass}
              id="inputField"
              type={type}
              onInput={handleInput}
              onBlur={handleBlur}
              aria-describedby={ariaDescribedbyIds}
              style={style}
              aria-labelledby={ariaLabeledByIds}
              aria-invalid={
                invalid || error || charCountTooHigh ? 'true' : 'false'
              }
              inputmode={inputmode}
              step={step}
              maxlength={maxlength}
              pattern={pattern}
              name={name}
              autocomplete={autocomplete}
              required={required || null}
              part="input"
              min={min}
              max={max}
              value={value}
            />
            {inputSuffix && (
              <div class="usa-input-suffix" part="suffix" aria-hidden="true">
                {inputSuffix.substring(0, 25)}
              </div>
            )}
            {inputIconSuffix && (
              <div class="usa-input-suffix" part="input-suffix">
                <va-icon icon={inputIconSuffix} size={3} part="icon"></va-icon>
              </div>
            )}
          </div>
          {isMessageSet(messageAriaDescribedby) && (
            <span id="input-message" class="usa-sr-only dd-privacy-hidden">
              {messageAriaDescribedby}
            </span>
          )}
          {charcount && maxlength && (
            <span
              id="charcount-message"
              class={messageClass}
              aria-live="polite"
            >
              {getCharacterMessage(value, maxlength)}
            </span>
          )}
        </div>
      </Host>
    );
  }
}
```