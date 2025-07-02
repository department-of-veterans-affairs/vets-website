
# This is the va-select code from the VA web component repo pasted here SIMPLY FOR REFERENCE
- This file's home is found here: https://github.com/department-of-veterans-affairs/component-library/blob/main/packages/web-components/src/components/va-select/va-select.tsx
- This file is purely to more easily reference that code
- This file's imports are not valid because this file's code was just pasted here for reference
``` tsx
import {
  Component,
  Element,
  Event,
  EventEmitter,
  forceUpdate,
  Host,
  Prop,
  State,
  h,
  Watch,
  Fragment,
} from '@stencil/core';
import classnames from 'classnames';
import { i18next } from '../..';
import {
  getSlottedNodes,
  getHeaderLevel,
  isMessageSet,
} from '../../utils/utils';
/**
 * @nativeHandler onKeyDown
 * @componentName Select
 * @maturityCategory use
 * @maturityLevel best_practice
 * @guidanceHref form/select
 * @translations English
 * @translations Spanish
 */

@Component({
  tag: 'va-select',
  styleUrl: 'va-select.scss',
  shadow: true,
})
export class VaSelect {
  @Element() el: any;

  /**
   * Whether or not this is a required field.
   */
  @Prop() required?: boolean = false;

  /**
   * Text label for the field.
   */
  @Prop() label!: string;

  /**
   * Name attribute for the select field.
   */
  @Prop() name!: string;

  /**
   * Selected value (will get updated on select).
   */
  @Prop({ reflect: true, mutable: true }) value?: string;

  /**
   * Error message to display. When defined, this indicates an error.
   */
  @Prop() error?: string;

  /**
   * Whether or not to add usa-input--error as class if error message is outside of component
   */
  @Prop() reflectInputError?: boolean = false;

  /**
   * Whether or not `aria-invalid` will be set on the inner select. Useful when
   * composing the component into something larger, like a date component.
   */
  @Prop() invalid?: boolean = false;

  /**
   * Whether or not to fire the analytics events
   */
  @Prop() enableAnalytics?: boolean = false;

  /**
   * Optional hint text.
   */
  @Prop() hint?: string;

  /**
   * An optional message that will be read by screen readers when the select is focused.
   */
  @Prop() messageAriaDescribedby?: string;

  /**
   * The event attached to select's onkeydown
   */
  @Event() vaKeyDown: EventEmitter;

  /**
   * The event emitted when the selected value changes
   */
  @Event() vaSelect: EventEmitter;

  /**
   * The event emitted when the select element is blurred
   */
  @Event() vaSelectBlur: EventEmitter;

  /**
   * Displays the select at a specific width. Accepts 2xs (4ex), xs (7ex), sm or small (10ex), md or medium (20ex), lg (30ex), xl (40ex), and 2xl (50ex).
   * Defined in USWDS here: https://github.com/uswds/uswds/blob/develop/packages/uswds-core/src/styles/tokens/units/input-widths.scss
   */
  @Prop() width?: string;

  /**
   * If true, sets the select to take the full-width of its container
   */
  @Prop() fullWidth?: boolean = false;

  /**
   * Whether an error message should be shown - set to false when this component is used inside va-date or va-memorable-date
   * in which the error for the va-select will be rendered outside of va-select
   */
  @Prop() showError?: boolean = true;

  /**
   * Enabling this will add a heading and description for integrating into the forms pattern. Accepts `single` or `multiple` to indicate if the form is a single input or will have multiple inputs
   */
  @Prop() useFormsPattern?: string;

  /**
   * The heading level for the heading if `useFormsPattern` is true.
   */
  @Prop() formHeadingLevel?: number = 3;

  /**
   * The content of the heading if `useFormsPattern` is true.
   */
  @Prop() formHeading?: string;

  /**
   * The event used to track usage of the component. This is emitted when an
   * option is selected and enableAnalytics is true.
   */
  @Event({
    eventName: 'component-library-analytics',
    composed: true,
    bubbles: true,
  })
  componentLibraryAnalytics: EventEmitter;

  @State() options: Array<Node>;

  connectedCallback() {
    i18next.on('languageChanged', () => {
      forceUpdate(this.el);
    });
  }

  disconnectedCallback() {
    i18next.off('languageChanged');
  }

  private handleKeyDown() {
    this.vaKeyDown.emit();
  }

  private handleBlur(e: Event) {
    const target: HTMLSelectElement = e.target as HTMLSelectElement;
    this.value = target.value;

    this.vaSelectBlur.emit({ value: this.value });
  }

  private handleChange(e: Event) {
    const target: HTMLSelectElement = e.target as HTMLSelectElement;
    this.value = target.value;

    if (this.enableAnalytics) {
      const detail = {
        componentName: 'va-select',
        action: 'change',
        details: {
          label: this.label,
          selectLabel: this.value,
        },
      };
      this.componentLibraryAnalytics.emit(detail);
    }
    this.vaSelect.emit({ value: this.value });
  }

  /**
   * This function is for taking the slotted content and rendering
   * it inside the `<select>` element. Putting the `<slot>` directly
   * inside the `<select>` doesn't actually show the `<option>` elements,
   * but this solves that problem.
   */
  private populateOptions() {
    const { value } = this;
    // Get all slotted nodes
    const allNodes = getSlottedNodes(this.el, null, '#select-container slot');

    // Filter nodes to include only <option> and <optgroup>
    // supports scenario where <option> may be slotted within <optgroup> as well as <option> directly
    // preserving the order of the nodes as they are slotted
    const nodes = allNodes.filter((node: Node) => {
      const nodeName = node.nodeName.toLowerCase();
      return nodeName === 'option' || nodeName === 'optgroup';
    });

    this.options = nodes.map(
      (node: HTMLOptionElement | HTMLOptGroupElement) => {
        if (node.nodeName.toLowerCase() === 'optgroup') {
          return (
            <optgroup label={node.label}>
              {Array.from(node.children).map((child: HTMLOptionElement) => {
                return (
                  <option value={child.value} selected={value === child.value}>
                    {child.text}
                  </option>
                );
              })}
            </optgroup>
          );
        } else if (node.nodeName.toLowerCase() === 'option') {
          return (
            <option
              value={(node as HTMLOptionElement).value}
              selected={value === (node as HTMLOptionElement).value}
            >
              {node.textContent}
            </option>
          );
        }
      },
    );
  }

  @Watch('value')
  handleValueChange() {
    this.populateOptions();
  }

  render() {
    const {
      error,
      reflectInputError,
      invalid,
      label,
      required,
      name,
      hint,
      messageAriaDescribedby,
      width,
      fullWidth,
      showError,
      useFormsPattern,
      formHeadingLevel,
      formHeading,
    } = this;

    const errorID = 'input-error-message';
    const ariaDescribedbyIds =
      `${messageAriaDescribedby ? 'input-message' : ''} ${
        error ? errorID : ''
      } ${hint ? 'input-hint' : ''}`.trim() || null; // Null so we don't add the attribute if we have an empty string

    const labelClass = classnames({
      'usa-label': true,
      'usa-label--error': error,
    });
    const selectClass = classnames({
      'usa-select': true,
      'usa-input--error': error || reflectInputError,
      [`usa-input--${width}`]: width,
      'va-select--full-width': fullWidth,
    });

    const isFormsPattern = ['single', 'multiple'].includes(useFormsPattern);
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
        {label && (
          <label htmlFor="options" class={labelClass} part="label">
            {label}
            {required && (
              <span class="usa-label--required"> {i18next.t('required')}</span>
            )}
          </label>
        )}
        {hint && (
          <span class="usa-hint" id="input-hint">
            {hint}
          </span>
        )}
        <span id={errorID} role="alert">
          {showError && error && (
            <Fragment>
              <span class="usa-sr-only">{i18next.t('error')}</span>
              <span class="usa-error-message">{error}</span>
            </Fragment>
          )}
        </span>
        <div id="select-container">
          <slot onSlotchange={() => this.populateOptions()}></slot>
          <select
            class={selectClass}
            aria-describedby={ariaDescribedbyIds}
            aria-invalid={invalid || error ? 'true' : 'false'}
            id="options"
            name={name}
            required={required || null}
            onKeyDown={() => this.handleKeyDown()}
            onChange={e => this.handleChange(e)}
            onBlur={e => this.handleBlur(e)}
            part="select"
          >
            <option key="0" value="" selected>
              {i18next.t('select')}
            </option>
            {this.options}
          </select>
        </div>
        {isMessageSet(messageAriaDescribedby) && (
          <span id="input-message" class="usa-sr-only dd-privacy-hidden">
            {messageAriaDescribedby}
          </span>
        )}
      </Host>
    );
  }
}
```