import React from 'react';
import PropTypes from 'prop-types';

import {
  getDefaultFormState,
  getDefaultRegistry,
} from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';

import recordEvent from 'platform/monitoring/record-event';
import {
  errorSchemaIsValid,
  validateCurrentOrPastDate,
} from 'platform/forms-system/src/js/validation';

import set from 'platform/utilities/data/set';
import get from 'platform/utilities/data/get';
import omit from 'platform/utilities/data/omit';
import { isReactComponent } from 'platform/utilities/ui';
import { validatePhone } from '../utils/validation';

/**
 * Displays a review card if the information inside is valid.
 *
 * For use on a schema of type 'object' or 'array'.
 * Intended to wrap objects or arrays to avoid duplicate functionality here.
 */
export default class ReviewBoxField extends React.Component {
  static defaultProps = {
    uiSchema: {},
    errorSchema: {},
    idSchema: {},
    registry: getDefaultRegistry(),
    required: false,
    disabled: false,
    readonly: false,
  };

  constructor(props) {
    super(props);

    // Throw an error if there’s no viewComponent (should be React component)
    if (
      !isReactComponent(get('ui:options.viewComponent', this.props.uiSchema))
    ) {
      throw new Error(
        `No viewComponent found in uiSchema for ReviewBoxField ${
          this.props.idSchema.$id
        }.`,
      );
    }

    const acceptedTypes = ['object', 'array', 'string'];
    if (!acceptedTypes.includes(this.props.schema.type)) {
      throw new Error(
        `Unknown schema type in ReviewCardField. Expected one of [${acceptedTypes.join(
          ', ',
        )}], but got ${this.props.schema.type}.`,
      );
    }

    const invalidInitialData = !errorSchemaIsValid(props.errorSchema);
    const startInEditConfigOption = get(
      'ui:options.startInEdit',
      this.props.uiSchema,
      false,
    );

    // There are times when the data isn't invalid, but we want to start in edit mode anyhow
    let shouldStartInEdit = startInEditConfigOption;
    if (typeof startInEditConfigOption === 'function') {
      shouldStartInEdit = startInEditConfigOption(this.props.formData);
    }
    const editing = invalidInitialData || shouldStartInEdit;

    this.state = {
      // Set initial state based on whether all the data is valid
      editing,
      canCancel: !editing, // If we start in the edit state, we can't cancel
      oldData: props.formData,
    };
  }

  onPropertyChange(name) {
    return value => {
      const formData = Object.keys(this.props.formData || {}).length
        ? this.props.formData
        : getDefaultFormState(
            this.props.schema,
            undefined,
            this.props.registry.definitions,
          );
      this.props.onChange(set(name, value, formData));
    };
  }

  getTitle = () => {
    const { uiSchema, formData } = this.props;
    return typeof uiSchema['ui:title'] === 'function'
      ? uiSchema['ui:title'](formData)
      : uiSchema['ui:title'];
  };

  getMainTitle = () => {
    const isDateWidget = this.props.uiSchema['ui:widget'] === 'date';
    const title = this.getTitle();

    if (!isDateWidget) {
      return title;
    }

    return `Your ${title.toLowerCase()}`;
  };

  getSubtitle = () => {
    const { uiSchema, formData } = this.props;
    return typeof uiSchema['ui:subtitle'] === 'function'
      ? uiSchema['ui:subtitle'](formData)
      : uiSchema['ui:subtitle'];
  };

  getDescription = () => {
    const {
      uiSchema: { 'ui:description': description },
      formData,
    } = this.props;
    if (!description) {
      return null;
    }

    return typeof description === 'function' ? (
      description(formData)
    ) : (
      <p>{description}</p>
    );
  };

  /**
   * Much of this is taken from ArrayField & ObjectField.
   *
   * Renders a SchemaField for each property it wraps.
   */
  getEditView = () => {
    const {
      disabled,
      errorSchema,
      formData = '',
      idSchema,
      onBlur,
      onChange,
      readonly,
      registry,
      required,
      schema,
      formContext,
    } = this.props;
    const { SchemaField } = registry.fields;
    // We've already used the ui:field and ui:title
    const uiSchema = omit(
      ['ui:field', 'ui:title', 'ui:description'],
      this.props.uiSchema,
    );

    const { volatileData } = this.props.uiSchema['ui:options'];
    const subtitle = this.getSubtitle();

    const updateButtonClasses = [
      'update-button',
      'usa-button-primary',
      'vads-u-margin-top--1',
      'vads-u-margin-right--1p5',
      'vads-u-width--auto',
    ].join(' ');

    const cancelButtonClasses = [
      'cancel-button',
      // keeping secondary style, but it has a shadow box outline; removed by
      // inline styling. And we can't use `va-button-link` because when hovered,
      // it removes all padding & add a background color (using !important)
      'usa-button-secondary',
      'vads-u-margin-top--1',
      'vads-u-margin-right--1p5',
      'vads-u-width--auto',
    ].join(' ');

    const Field = (
      <SchemaField
        name={idSchema.$id}
        required={required}
        schema={schema}
        uiSchema={uiSchema}
        errorSchema={errorSchema}
        idSchema={idSchema}
        formData={formData}
        onChange={onChange}
        onBlur={onBlur}
        registry={registry}
        disabled={disabled}
        readonly={readonly}
      />
    );

    // ObjectField is set to be wrapped in a div instead of a dl, so we move
    // that dl wrap to here; this change fixes an accessibility issue
    const needsDlWrapper =
      // Wrap in DL only if on review page & in review mode
      formContext.onReviewPage &&
      formContext.reviewMode &&
      // volatileData is for arrays, which displays separate blocks
      uiSchema['ui:options']?.volatileData;

    const ReviewBoxTitle = formContext.onReviewPage ? 'h4' : 'h5';

    const hasErrors = this.formHasErrors();
    // const isDateWidget = this.props.uiSchema['ui:widget'] === 'date';
    // if (isDateWidget) {
    //   this.updateDateErrors(hasErrors);
    // }
    if (hasErrors) {
      this.props.formContext.onError();
    }

    return (
      <div className="review-box">
        <div className="review-box_body input-section va-growable-background">
          <ReviewBoxTitle className="review-box_title">
            {this.getMainTitle()}
          </ReviewBoxTitle>

          {subtitle}
          {needsDlWrapper ? <dl className="review">{Field}</dl> : Field}

          <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-margin-top--2p5">
            {!formContext.reviewMode && (
              <>
                {((volatileData && this.state.canCancel) || !volatileData) && (
                  <button
                    className={cancelButtonClasses}
                    onClick={this.cancelUpdate}
                  >
                    Cancel
                  </button>
                )}
                <button className={updateButtonClasses} onClick={this.update}>
                  Update
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  getReviewView = () => {
    if (this.props.formContext.onReviewPage) {
      // Check the data type and use the appropriate review field
      const dataType = this.props.schema.type;
      if (dataType === 'object') {
        const { ObjectField } = this.props.registry.fields;
        return <ObjectField {...this.props} />;
      } else if (dataType === 'array') {
        const { ArrayField } = this.props.registry.fields;
        return <ArrayField {...this.props} />;
      }
    }

    const {
      viewComponent: ViewComponent,
      volatileData,
      reviewTitle,
      itemName,
      itemNameAction,
    } = this.props.uiSchema['ui:options'];
    const title = reviewTitle || this.getTitle();

    return (
      <div className="review-box review-box--view">
        <dl className="review-box_group">
          <dt className="review-box_label">{this.getMainTitle()}</dt>
          <dd className="review-box_value">
            <ViewComponent formData={this.props.formData} />
          </dd>
        </dl>

        {!volatileData && (
          <button
            className={`review-box_button usa-button-secondary edit-button`}
            style={{ minWidth: '8rem' }}
            onClick={this.startEditing}
            aria-label={`Edit ${title}`}
          >
            Edit
          </button>
        )}
        {volatileData && (
          <button
            className={`usa-button-primary edit-button`}
            style={{ minWidth: '8rem' }}
            onClick={this.startEditing}
            aria-label={`${itemNameAction || 'New'} ${itemName || title}`}
          >
            {itemNameAction || 'New'} {itemName || title}
          </button>
        )}
      </div>
    );
  };

  startEditing = () => {
    const newState = { editing: true };

    // If the data is volatile, cache the original data before clearing it out so we
    //  have the option to cancel later
    if (this.props.uiSchema['ui:options']?.volatileData) {
      newState.oldData = this.props.formData;
      this.resetFormData();
    }

    this.setState(newState);
  };

  cancelUpdate = event => {
    // Don't act like the continue button
    if (event) {
      // Apparently the unit tests don't send this event to the onClick handler
      event.preventDefault();
    }
    this.props.onChange(this.state.oldData);
    this.setState({ editing: false });
  };

  /**
   * Resets the form data to either the oldData passed in or the default data
   * @param {Any} oldData - Optional. The data to replace the current formData with
   */
  resetFormData = oldData => {
    const formData =
      oldData !== undefined
        ? oldData
        : getDefaultFormState(
            this.props.schema,
            undefined,
            this.props.registry.definitions,
          );
    this.props.onChange(formData);
  };

  isRequired = name => {
    const { schema } = this.props;
    const schemaRequired =
      Array.isArray(schema.required) && schema.required.indexOf(name) !== -1;

    if (schemaRequired) {
      return schemaRequired;
    }

    return false;
  };

  update = event => {
    // Don't act like the continue button
    if (event) {
      // Apparently the unit tests don't send this event to the onClick handler
      event.preventDefault();
    }

    // manually call the validation functions
    const hasErrors = this.formHasErrors();

    if (this.props.uiSchema['ui:widget'] === 'date') {
      this.updateDateErrors(hasErrors);
    }

    if (
      this.props.uiSchema.phone &&
      this.props.uiSchema.phone['ui:widget'].name === 'PhoneNumberWidget'
    ) {
      this.updatePhoneErrors(hasErrors);
    }

    if (hasErrors || !errorSchemaIsValid(this.props.errorSchema)) {
      // if (!errorSchemaIsValid(this.props.errorSchema)) {
      // Show validation errors
      this.props.formContext.onError();
    } else {
      this.setState({
        editing: false,
        canCancel: true,
        oldData: this.props.formData,
      });
      if (this.props.uiSchema.saveClickTrackEvent) {
        recordEvent(this.props.uiSchema.saveClickTrackEvent);
      }
    }
  };

  formHasErrors() {
    const startInEditFunction =
      typeof this.props.uiSchema['ui:options']?.startInEdit === 'function';

    if (!startInEditFunction) {
      return this.props.uiSchema['ui:options']?.startInEdit;
    } else {
      return this.props.uiSchema['ui:options']?.startInEdit(
        this.props.formData,
      );
    }
  }

  updateDateErrors = dateErrors => {
    if (!dateErrors) {
      this.errorSpan = null;
      this.errorClass = '';
      return;
    }

    const errors = {
      __errors: [],
      addError(error) {
        this.__errors.push(error);
      },
    };
    let errorMessages;
    validateCurrentOrPastDate(
      errors,
      this.props.formData,
      null,
      null,
      errorMessages,
    );

    this.errorClass = 'usa-input-error';
    // const errorSpanId = `${this.props.idSchema.$id}-error-message`;
    // this.errorSpan = ();
  };

  updatePhoneErrors = hasErrors => {
    if (!hasErrors) {
      this.errorSpan = null;
      this.errorClass = '';
      return;
    }
    const errors = {
      __errors: [],
      addError(error) {
        this.__errors.push(error);
      },
    };

    validatePhone(errors, this.props.formData);

    this.errorClass = 'usa-input-error';
  };

  render() {
    const description = this.getDescription();
    const viewOrEditCard = this.state.editing
      ? this.getEditView()
      : this.getReviewView();

    return (
      <>
        {description}
        {viewOrEditCard}
      </>
    );
  }
}

ReviewBoxField.propTypes = {
  uiSchema: PropTypes.shape({
    'ui:options': PropTypes.shape({
      /**
       * ReactNode that should be shown instead of edit fields It's passed the
       * same formData the field is
       */
      viewComponent: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.elementType,
      ]).isRequired,

      /**
       * Either a function or a value that will be evaluated as truthy or not. If
       * a function is used, it's passed the formData and expects a boolean
       * return value
       */
      startInEdit: PropTypes.oneOfType([PropTypes.func, PropTypes.any]),

      /**
       * If this is truthy, the component pattern changes slightly so only
       * completely new data can be entered, but not edited. This is useful for
       * displaying partial bank account information while requiring any new
       * data to be filled in completely.
       */
      volatileData: PropTypes.bool,

      /**
       * The title shown on the review card. Defaults to ui:title.
       */
      reviewTitle: PropTypes.string,

      /**
       * The title shown on the edit card. Defaults to ui:title.
       */
      editTitle: PropTypes.string,

      /**
       * The name of the set of data in the card. This shows up on the "New X"
       * button if volatileData is set to true.
       */
      itemName: PropTypes.string,

      /**
       * Replaces the "New" in "New X" when volatileData is true. For example,
       * if set to "Update", the button for entering new bank account
       * information would say something like "Update Bank Account" instead of
       * "New Bank Account"
       */
      itemNameAction: PropTypes.string,
    }).isRequired,
    'ui:description': PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func,
      PropTypes.elementType,
      PropTypes.string,
    ]),
    'ui:subtitle': PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    saveClickTrackEvent: PropTypes.object,
  }).isRequired,
  schema: PropTypes.object.isRequired,
  errorSchema: PropTypes.object.isRequired,
  idSchema: PropTypes.object.isRequired,
  registry: PropTypes.shape({
    fields: PropTypes.shape({
      SchemaField: PropTypes.elementType.isRequired,
    }),
    definitions: PropTypes.object.isRequired,
  }).isRequired,
  formData: PropTypes.object.isRequired,
  onBlur: PropTypes.func.isRequired,
  formContext: PropTypes.shape({
    onError: PropTypes.func.isRequired,
  }).isRequired,
};
