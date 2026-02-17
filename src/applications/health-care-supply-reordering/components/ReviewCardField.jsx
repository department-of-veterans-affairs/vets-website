import {
  getDefaultFormState,
  getDefaultRegistry,
} from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';
import * as Sentry from '@sentry/browser';
import classnames from 'classnames';
import { setData } from 'platform/forms-system/src/js/actions';
import { errorSchemaIsValid } from 'platform/forms-system/src/js/validation';
import recordEvent from 'platform/monitoring/record-event';
import get from 'platform/utilities/data/get';
import omit from 'platform/utilities/data/omit';
import set from 'platform/utilities/data/set';
import { focusElement, isReactComponent } from 'platform/utilities/ui';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

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
      !isReactComponent(get('ui:options.viewComponent', this.props.uiSchema))
    ) {
      throw new Error(
        `No viewComponent found in uiSchema for ReviewCardField ${this.props.idSchema.$id}.`,
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
      permAddressShouldBeFocused: false,
      tempAddressShouldBeFocused: false,
    };
  }

  componentDidUpdate() {
    if (this.state.permAddressShouldBeFocused && !this.state.editing) {
      focusElement('#permanentAddress');
      this.resetAddressFocus();
    } else if (this.state.tempAddressShouldBeFocused && !this.state.editing) {
      focusElement('#temporaryAddress');
      this.resetAddressFocus();
    }
    if (
      this.state.permAddressShouldBeFocused &&
      this.state.editing &&
      this.props.name === 'permanentAddress'
    ) {
      focusElement('#permanentAddress.review-card--edit-title');
      this.resetAddressFocus();
    } else if (
      this.state.tempAddressShouldBeFocused &&
      this.state.editing &&
      this.props.name === 'temporaryAddress'
    ) {
      focusElement('#temporaryAddress.review-card--edit-title');
      this.resetAddressFocus();
    }
  }

  resetAddressFocus = () => {
    this.setState({
      permAddressShouldBeFocused: false,
      tempAddressShouldBeFocused: false,
    });
  };

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
      formContext,
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
      'review-card--edit-title',
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

    return (
      <div className="review-card">
        <div className="review-card--body input-section va-growable-background">
          <h4 className={titleClasses} id={this.props.name}>
            Edit {title.toLowerCase()}
          </h4>
          {subtitle && <div className="review-card--subtitle">{subtitle}</div>}
          {needsDlWrapper ? <dl className="review">{Field}</dl> : Field}
          <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-margin-top--2p5">
            {!formContext.reviewMode && (
              <>
                <button className={updateButtonClasses} onClick={this.update}>
                  Save {title.toLowerCase()}
                </button>
                {((volatileData && this.state.canCancel) || !volatileData) && (
                  <button
                    className={cancelButtonClasses}
                    onClick={this.cancelUpdate}
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
        return (
          this.props.name === this.props['view:currentAddress'] && (
            <ObjectField {...this.props} />
          )
        );
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
      'vads-u-display--flex',
      'vads-u-justify-content--space-between',
      'vads-u-align-items--center',
      'vads-u-padding-bottom--2',
    ].join(' ');
    const titleClasses = [
      'review-card--title',
      'vads-u-display--inline',
      'vads-u-margin--0',
    ].join(' ');
    const bodyClasses = [
      'review-card--body',
      'vads-u-border-color--gray-lightest',
      'vads-u-border--2px',
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
    const { street, city, country } = this.props.formData;
    let isTempAddressValid = true;
    if (this.props.name === 'temporaryAddress') {
      isTempAddressValid = Boolean(street && city && country);
    }
    const displayAddress = Boolean(street && city && country);
    const addressTypeWithSpace = this.props.name.replace('Address', ' address');

    return (
      <div
        className={classnames({
          'review-card vads-u-margin-bottom--2 vads-u-background-color--gray-lightest': true,
          'vads-u-border-color--primary vads-u-border--3px':
            this.props.name === this.props['view:currentAddress'],
        })}
      >
        <div
          className={classnames({
            [`${headerClasses}`]: true,
            'vads-u-padding-top--21 vads-u-padding-x--21':
              this.props.name === this.props['view:currentAddress'],
            'vads-u-padding-top--3 vads-u-padding-x--3':
              this.props.name !== this.props['view:currentAddress'],
          })}
          style={{ minHeight: '3.125rem' }}
        >
          <h4 className={titleClasses}>{title}</h4>
        </div>
        <div
          className={classnames({
            [`${bodyClasses}`]: true,
            'vads-u-padding-x--21 vads-u-padding-bottom--21':
              this.props.name === this.props['view:currentAddress'],
            'vads-u-padding-x--3 vads-u-padding-bottom--3':
              this.props.name !== this.props['view:currentAddress'],
          })}
        >
          {displayAddress ? (
            <ViewComponent formData={this.props.formData} />
          ) : (
            <p> </p>
          )}
          {!volatileData && isTempAddressValid && (
            <button
              className={`${editLink} va-button-link vads-u-display--block vads-u-margin-top--2`}
              aria-label={`Edit ${title.toLowerCase()}`}
              style={{ minWidth: '5rem' }}
              onClick={() => this.startEditing(this.props.name)}
              type="button"
            >
              Edit {title.toLowerCase()}
            </button>
          )}

          {!volatileData && !isTempAddressValid && (
            <button
              className={`${editLink} va-button-link`}
              aria-label={`Add a ${title.toLowerCase()}`}
              style={{ minWidth: '5rem' }}
              onClick={() => this.startEditing(this.props.name)}
              type="button"
            >
              Add a {title.toLowerCase()}
            </button>
          )}
          {street && city && country && (
            <div className="vads-u-margin-top--2">
              <input
                id={this.props.name}
                type="radio"
                className=" vads-u-width--auto"
                checked={this.props['view:currentAddress'] === this.props.name}
                onChange={() =>
                  this.onChange('view:currentAddress', this.props.name)
                }
              />
              <label
                className={classnames({
                  'usa-button vads-u-font-weight--bold vads-u-border--2px vads-u-border-color--primary vads-u-margin-bottom--0 vads-u-width--auto vads-u-text-align--left vads-u-padding-x--2': true,
                  'vads-u-color--white':
                    this.props.name === this.props['view:currentAddress'],
                  'vads-u-background-color--white vads-u-color--primary':
                    this.props.name !== this.props['view:currentAddress'],
                })}
                htmlFor={this.props.name}
              >
                Send to {addressTypeWithSpace}
              </label>
            </div>
          )}
        </div>
        {volatileData && (
          <button
            className={`usa-button-primary ${editButton}`}
            style={{ minWidth: '5rem' }}
            onClick={() => this.startEditing(this.props.name)}
          >
            {itemNameAction || 'New'} {itemName || title}
          </button>
        )}
      </div>
    );
  };

  startEditing = addressType => {
    const newState = { editing: true };
    if (addressType === 'permanentAddress') {
      newState.permAddressShouldBeFocused = true;
    } else if (addressType === 'temporaryAddress') {
      newState.tempAddressShouldBeFocused = true;
    }

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
    if (this.props.name === 'temporaryAddress') {
      const { street, city, country } = this.state.oldData;
      const isTempAddressValid = street && city && country;
      if (isTempAddressValid) {
        this.setState({
          tempAddressShouldBeFocused: true,
        });
      } else {
        this.setState({
          permAddressShouldBeFocused: true,
        });
      }
    } else if (this.props.name === 'permanentAddress') {
      this.setState({
        permAddressShouldBeFocused: true,
      });
    }
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
      if (this.props.name === 'permanentAddress') {
        this.onChange('view:currentAddress', 'permanentAddress');
        this.setState({
          editing: false,
          canCancel: true,
          oldData: this.props.formData,
          permAddressShouldBeFocused: true,
          tempAddressShouldBeFocused: false,
        });
      } else if (this.props.name === 'temporaryAddress') {
        const { street, city, country } = this.props.formData;
        const isTempAddressValid = Boolean(street && city && country);
        if (isTempAddressValid) {
          this.onChange('view:currentAddress', 'temporaryAddress');
          this.setState({
            editing: false,
            canCancel: true,
            oldData: this.props.formData,
            permAddressShouldBeFocused: false,
            tempAddressShouldBeFocused: true,
          });
        } else {
          this.onChange('view:currentAddress', 'permanentAddress');
          this.setState({
            editing: false,
            canCancel: true,
            oldData: this.props.formData,
            permAddressShouldBeFocused: true,
            tempAddressShouldBeFocused: false,
          });
        }
      }
      if (this.props.uiSchema.saveClickTrackEvent) {
        recordEvent(this.props.uiSchema.saveClickTrackEvent);
      }
    }
  };

  render() {
    const pageDescription = (
      <>
        <h3 className="vads-u-font-size--h4">Shipping address</h3>
        <div className="vads-u-margin-top--2">
          <p>
            We’ll ship your order to the address below. Orders typically arrive
            within 7 to 10 business days.
          </p>
          <p className="vads-u-font-weight--bold">
            Select the address where you’d like to send your order:{' '}
            <span className="vads-u-font-weight--normal schemaform-required-span">
              (*Required)
            </span>
          </p>
        </div>
      </>
    );
    const description = this.getDescription();
    const viewOrEditCard = this.state.editing
      ? this.getEditView()
      : this.getReviewView();

    return (
      <div className="address-page">
        {this.props.name === 'permanentAddress' ? <>{pageDescription}</> : null}
        {description}
        {viewOrEditCard}
      </div>
    );
  }
}

ReviewCardField.propTypes = {
  uiSchema: PropTypes.shape({
    'ui:options': PropTypes.shape({
      viewComponent: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.elementType,
      ]).isRequired,
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

const mapStateToProps = state => ({
  data: state.form?.data,
  'view:currentAddress': state.form?.data['view:currentAddress'],
});

const mapDispatchToProps = {
  setData,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewCardField);
