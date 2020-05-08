import {
  getDefaultFormState,
  getDefaultRegistry,
} from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';
import * as Sentry from '@sentry/browser';
import { setData } from 'platform/forms-system/src/js/actions';
import { errorSchemaIsValid } from 'platform/forms-system/src/js/validation';
import recordEvent from 'platform/monitoring/record-event';
import get from 'platform/utilities/data/get';
import omit from 'platform/utilities/data/omit';
import set from 'platform/utilities/data/set';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { BLUE_BACKGROUND, WHITE_BACKGROUND } from '../constants';

/**
 * Displays a review card if the information inside is valid.
 *
 * For use on a schema of type 'object' or 'array'.
 * Intended to wrap objects or arrays to avoid duplicate functionality here.
 *
 * ui:options available:
 *   viewComponent - ReactNode that should be shown instead of edit fields
 *                   It's passed the same formData the field is
 *   startInEdit   - Either a function or a value that will be evaluated as truthy or not
 *                   If a function is used, it's passed the formData and expects a boolean return value
 *   volatileData  - If this is truthy, the component pattern changes slightly so only completely new
 *                   data can be entered, but not edited.
 *                   This is useful for bank account information.
 *   reviewTitle   - The title shown on the review card. Defaults to ui:title
 *   editTitle     - The title shown on the edit card. Defaults to ui:title
 *   itemName      - The name of the set of data in the card. This shows up on the "New X" button if
 *                   volatileData is set to true.
 */
class ReviewCardField extends React.Component {
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
      typeof get('ui:options.viewComponent', this.props.uiSchema) !== 'function'
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

  onChange = (field, data) => {
    const newData = set(field, data, this.props.data);
    return this.props.setData(newData);
  };

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
    } = this.props;
    const { SchemaField } = registry.fields;
    // We've already used the ui:field and ui:title
    const uiSchema = omit(
      ['ui:field', 'ui:title', 'ui:description'],
      this.props.uiSchema,
    );

    const { volatileData, editTitle } = this.props.uiSchema['ui:options'];
    const title = editTitle || this.getTitle();
    const subtitle = this.getSubtitle();
    const titleClasses = [
      'review-card--title',
      'vads-u-margin-top--1',
      'vads-u-margin-bottom--2p5',
      'vads-u-margin-x--0',
    ].join(' ');

    const buttonClasses = ['vads-u-margin-top--1', 'vads-u-width--auto'].join(
      ' ',
    );

    return (
      <div className="review-card">
        <div className="review-card--body input-section va-growable-background">
          <h4 className={titleClasses}>Edit {title.toLowerCase()}</h4>
          {subtitle && <div className="review-card--subtitle">{subtitle}</div>}
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
          <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-margin-top--2p5">
            <button
              className={`update-button usa-button-primary ${buttonClasses} vads-u-margin-right--2p5`}
              style={{ minWidth: '12rem' }}
              onClick={this.update}
            >
              {volatileData ? 'Save' : `Save ${title.toLowerCase()}`}
            </button>
            {((volatileData && this.state.canCancel) || !volatileData) && (
              <button
                className={`cancel-button usa-button-secondary ${buttonClasses}`}
                style={{ minWidth: '12rem' }}
                onClick={this.cancelUpdate}
              >
                Cancel
              </button>
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
        return (
          this.props.name === this.props.currentAddress && (
            <ObjectField {...this.props} />
          )
        );
      } else if (dataType === 'array') {
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
      'vads-u-padding-top--0',
      'vads-u-padding-x--1',
      'vads-u-display--flex',
      'vads-u-justify-content--space-between',
      'vads-u-align-items--center',
      'vads-u-padding--2',
    ].join(' ');
    const titleClasses = [
      'review-card--title',
      'vads-u-display--inline',
      'vads-u-margin--0',
    ].join(' ');
    const bodyClasses = [
      'review-card--body',
      'vads-u-border-color--gray-lightest',
      'vads-u-background-color--gray-lightest',
      'vads-u-border--2px',
      /* Remove the top border because it looks like it just extends the header */
      'vads-u-border-top--0',
      'vads-u-padding-x--2',
      'vads-u-padding-bottom--2',
      'vads-u-padding-top--0',
      'vads-u-margin-bottom--1',
    ].join(' ');
    const editLink = [
      'vads-c-link',
      'vads-u-margin-top--1',
      'vads-u-width--auto',
    ].join(' ');
    const editButton = [
      'edit-button',
      'vads-u-margin-top--1',
      'vads-u-width--auto',
    ].join(' ');
    const { data } = this.props;
    const { street, city, country } = this.props.formData;
    /* eslint-disable no-unused-vars */
    // using destructuring to remove view:livesOnMilitaryBaseInfo prop
    const {
      'view:livesOnMilitaryBaseInfo': removed,
      ...temporaryAddress
    } = data.temporaryAddress;
    /* eslint-enable no-unused-vars */
    const isTempAddressMissing = Object.values(temporaryAddress).every(
      prop => !prop,
    );
    return (
      <div className="review-card">
        <div className={headerClasses} style={{ minHeight: '5rem' }}>
          <h4 className={titleClasses}>{title}</h4>
        </div>
        <div className={bodyClasses}>
          <ViewComponent formData={this.props.formData} />
          {!volatileData &&
            street &&
            city &&
            country && (
              <a
                className={`${editLink}`}
                style={{ minWidth: '8rem' }}
                onClick={this.startEditing}
                aria-label={`Edit ${title.toLowerCase()}`}
              >
                Edit {title.toLowerCase()}
              </a>
            )}
          {!volatileData &&
            !street &&
            !city &&
            !country && (
              <a
                className={`${editLink}`}
                style={{ minWidth: '8rem' }}
                onClick={this.startEditing}
                aria-label={`Add a ${title.toLowerCase()}`}
              >
                Add a {title.toLowerCase()}
              </a>
            )}
          {isTempAddressMissing &&
            street &&
            city &&
            country && (
              <div className="vads-u-width-267px">
                <button
                  id={this.props.name}
                  className="vads-u-font-weight--bold"
                  onChange={() =>
                    this.onChange('currentAddress', this.props.name)
                  }
                  type="button"
                >
                  Send my order to this address
                </button>
              </div>
            )}
          {!isTempAddressMissing &&
            street &&
            city &&
            country && (
              <div
                className={
                  this.props.name === this.props.currentAddress
                    ? BLUE_BACKGROUND
                    : WHITE_BACKGROUND
                }
              >
                <input
                  id={this.props.name}
                  type="radio"
                  checked={this.props.currentAddress === this.props.name}
                  onChange={() =>
                    this.onChange('currentAddress', this.props.name)
                  }
                />
                <label
                  className="vads-u-font-weight--bold"
                  htmlFor={this.props.name}
                >
                  Send my order to this address
                </label>
              </div>
            )}
        </div>
        {volatileData && (
          <button
            className={`usa-button-primary ${editButton}`}
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
    if (this.props.uiSchema['ui:options'].volatileData) {
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
    }
  };

  render() {
    const pageDescription = (
      <>
        <p className="vads-u-margin-top--2">
          We'll ship your order to the address below. Orders typically arrive
          within 7 to 10 business days.
        </p>
      </>
    );
    const description = this.getDescription();
    const viewOrEditCard = this.state.editing
      ? this.getEditView()
      : this.getReviewView();

    return (
      <>
        {this.props.name === 'permanentAddress' ? <>{pageDescription}</> : null}
        {description}
        {viewOrEditCard}
      </>
    );
  }
}

ReviewCardField.propTypes = {
  uiSchema: PropTypes.shape({
    'ui:options': PropTypes.shape({
      viewComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
        .isRequired,
    }).isRequired,
    'ui:description': PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    'ui:subtitle': PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    saveClickTrackEvent: PropTypes.object,
  }).isRequired,
  schema: PropTypes.object.isRequired,
  errorSchema: PropTypes.object.isRequired,
  idSchema: PropTypes.object.isRequired,
  registry: PropTypes.shape({
    fields: PropTypes.shape({
      SchemaField: PropTypes.func.isRequired,
    }),
    definitions: PropTypes.object.isRequired,
  }).isRequired,
  formData: PropTypes.object.isRequired,
  onBlur: PropTypes.func.isRequired,
  formContext: PropTypes.shape({
    onError: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({
  data: state.form?.data,
  currentAddress: state.form?.data?.currentAddress,
});

const mapDispatchToProps = {
  setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewCardField);
