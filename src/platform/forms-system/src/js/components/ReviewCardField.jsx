import React from 'react';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/browser';

import {
  getDefaultFormState,
  getDefaultRegistry,
} from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';

import recordEvent from 'platform/monitoring/record-event';
import { errorSchemaIsValid } from 'platform/forms-system/src/js/validation';

import set from 'platform/utilities/data/set';
import get from 'platform/utilities/data/get';
import omit from 'platform/utilities/data/omit';
import { isReactComponent } from 'platform/utilities/ui';

/**
 * Displays a review card if the information inside is valid.
 *
 * For use on a schema of type 'object' or 'array'.
 * Intended to wrap objects or arrays to avoid duplicate functionality here.
 */
export default class ReviewCardField extends React.Component {
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
        `No viewComponent found in uiSchema for ReviewCardField ${
          this.props.idSchema.$id
        }.`,
      );
    }

    const acceptedTypes = ['object', 'array'];
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
      formData,
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

    const { editTitle, ariaLabel } = this.props.uiSchema['ui:options'];
    const title = editTitle || this.getTitle();
    const subtitle = this.getSubtitle();
    const titleClasses = [
      'review-card--title',
      'vads-u-margin-top--1',
      'vads-u-margin-bottom--2p5',
      'vads-u-margin-x--0',
    ].join(' ');

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
      'vads-u-text-decoration--underline',
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

    const Tag = formContext.onReviewPage ? 'h4' : 'h3';

    return (
      <div className="review-card">
        <div className="review-card--body input-section va-growable-background">
          <Tag tabIndex={0} className={titleClasses}>
            {title}
          </Tag>
          {subtitle && <div className="review-card--subtitle">{subtitle}</div>}
          {needsDlWrapper ? <dl className="review">{Field}</dl> : Field}
          <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-margin-top--2p5">
            {!formContext.reviewMode && (
              <>
                <button
                  className={updateButtonClasses}
                  onClick={this.update}
                  aria-label={`${ariaLabel || 'Save Changes'}`}
                >
                  Save
                </button>
                {this.state.canCancel && (
                  <button
                    className={cancelButtonClasses}
                    style={{ boxShadow: 'none' }}
                    onClick={this.cancelUpdate}
                    aria-label="Cancel Changes"
                  >
                    Cancel
                  </button>
                )}
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
      }
      if (dataType === 'array') {
        const { ArrayField } = this.props.registry.fields;
        return <ArrayField {...this.props} />;
      }

      // Not having the right type should have been caught in the constructor, but...
      Sentry.withScope(scope => {
        scope.setExtra('message', `Expected object or array, got ${dataType}`);
        Sentry.captureMessage('ReviewCardField-bad-type-on-review');
      });
      // Fall back to the ViewComponent
    }

    const {
      viewComponent: ViewComponent,
      volatileData,
      reviewTitle,
      itemName,
      itemNameAction,
    } = this.props.uiSchema['ui:options'];
    const title = reviewTitle || this.getTitle();

    const headerClasses = [
      'review-card--header',
      'vads-u-background-color--gray-lightest',
      'vads-u-padding-y--0',
      'vads-u-padding-x--2',
      'vads-u-display--flex',
      'vads-u-justify-content--space-between',
      'vads-u-align-items--center',
    ].join(' ');
    const titleClasses = [
      'review-card--title',
      'vads-u-display--inline',
      'vads-u-margin--0',
      'vads-u-font-size--h4',
    ].join(' ');
    const bodyClasses = [
      'review-card--body',
      'vads-u-border-color--gray-lightest',
      'vads-u-border--2px',
      /* Remove the top border because it looks like it just extends the header */
      'vads-u-border-top--0',
      'vads-u-padding--1p5',
      'vads-u-margin-bottom--1',
    ].join(' ');
    const editButton = [
      'edit-button',
      'vads-u-margin-top--1',
      'vads-u-width--auto',
    ].join(' ');

    const Tag = this.props.formContext.onReviewPage ? 'h4' : 'h3';

    return (
      <div className="review-card">
        <div className={headerClasses} style={{ minHeight: '3.125rem' }}>
          <Tag tabIndex={0} className={titleClasses}>
            {title}
          </Tag>
          {!volatileData && (
            <button
              className={`usa-button-secondary ${editButton}`}
              style={{ minWidth: '5rem' }}
              onClick={this.startEditing}
              aria-label={`Edit ${title}`}
            >
              Edit
            </button>
          )}
        </div>
        <div className={bodyClasses}>
          <ViewComponent formData={this.props.formData} />
        </div>
        {volatileData && (
          <button
            className={`usa-button-primary ${editButton}`}
            style={{ minWidth: '5rem' }}
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
      this.resetFormData(newState.oldData);
    }

    setTimeout(() => {
      this.setFocusToHeading();
    }, 1);
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

    this.setFocusToHeading();
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

    if (!errorSchemaIsValid(this.props.errorSchema)) {
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

      this.setFocusToHeading();
    }
  };

  // Sets focus on the heading if it exists
  setFocusToHeading = () => {
    const reviewCardHeading = document.querySelector('.review-card--title');

    if (reviewCardHeading) reviewCardHeading.focus();
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

ReviewCardField.propTypes = {
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
    'ui:title': PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
      PropTypes.func,
    ]),
    'ui:subtitle': PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
      PropTypes.func,
    ]),
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
