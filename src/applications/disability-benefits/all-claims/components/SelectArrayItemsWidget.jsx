import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';
import { setData } from 'platform/forms-system/src/js/actions';
import { autoSaveForm } from 'platform/forms/save-in-progress/actions';
import environment from 'platform/utilities/environment';

import { disabilityActionTypes } from '../constants';

// TODO: Safety checks for `selected` callback and `label` element

class SelectArrayItemsWidget extends React.Component {
  // flag used to render a message to inform Veterans that their rated
  // disabilities list has changed
  hasUpdatedDisabilities = false;

  defaultSelectedPropName = 'view:selected';

  keyValue = 'ratedDisabilities';

  updatedKeyValue = 'updatedRatedDisabilities';

  keyConstants = ['ratingDecisionId', 'diagnosticCode'];

  onChange = (index, checked) => {
    const items = set(
      `[${index}].${this.props.options.selectedPropName ||
        this.defaultSelectedPropName}`,
      checked,
      this.props.value,
    );
    this.props.onChange(items);
  };

  processRatedDisabilityUpdates = updatedDisabilities => {
    const { formId, value, formData, metadata } = this.props;

    // Whenever the rated disabilities are updated, `updatedRatedDisabilities`
    // is added to the data. This bit of code ensures that exactly matching
    // previously selected entries are still selected
    const updatedItems = updatedDisabilities.map(newValue => {
      const hasItem = (value || []).find(oldValue =>
        this.keyConstants.every(key => oldValue?.[key] === newValue?.[key]),
      );
      const isSelected = hasItem?.[this.defaultSelectedPropName] || false;
      return {
        ...newValue,
        disabilityActionType:
          hasItem?.disabilityActionType ||
          disabilityActionTypes[isSelected ? 'INCREASE' : 'NONE'],
        [this.defaultSelectedPropName]: isSelected,
      };
    });

    const newData = {
      ...formData,
      // Adding updatedRatedDisabilities (from API) values to the form replacing
      // ratedDisabilities; it's added here instead of the intro page because
      // the separate save-in-progress endpoint will change the returnUrl to the
      // ratedDisabilities page
      [this.keyValue]: updatedItems,
    };
    // remove updatedRatedDisabilities
    delete newData[this.updatedKeyValue];
    this.props.setData(newData);

    // Update save-in-progress data
    const { version, returnUrl, submission } = metadata;
    this.props.autoSaveForm(formId, newData, version, returnUrl, submission);

    this.hasUpdatedDisabilities = true;
  };

  render() {
    const {
      value: items,
      id,
      options,
      required,
      formContext,
      formData,
      testUpdatedRatedDisabilities,
    } = this.props;

    const updatedDisabilities = formData[this.updatedKeyValue];
    // rated disabilities updated on the backend
    if (
      // allows for save-in-progress testing
      (environment.isProduction() || testUpdatedRatedDisabilities) &&
      Array.isArray(updatedDisabilities) &&
      updatedDisabilities.length
    ) {
      this.processRatedDisabilityUpdates(updatedDisabilities);
    }

    // Need customTitle to set error message above title.
    const { label: Label, selectedPropName, disabled, customTitle } = options;

    // inReviewMode = true (review page view, not in edit mode)
    // inReviewMode = false (in edit mode)
    const { onReviewPage } = formContext;
    const inReviewMode = onReviewPage && formContext.reviewMode;

    const hasSelections = items?.reduce(
      (result, item) =>
        result || !!get(selectedPropName || this.defaultSelectedPropName, item),
      false,
    );

    const itemsList =
      items?.length > 0 &&
      items.map((item, index) => {
        const itemIsSelected = !!get(
          selectedPropName || this.defaultSelectedPropName,
          item,
        );

        // Don't show un-selected ratings in review mode
        if (inReviewMode && !itemIsSelected) {
          return null;
        }

        const checkboxVisible =
          !onReviewPage || (onReviewPage && !inReviewMode);

        const itemIsDisabled =
          typeof disabled === 'function' ? disabled(item) : false;

        const labelWithData = (
          <Label
            {...item}
            name={item.name || item.condition}
            className={
              checkboxVisible
                ? 'vads-u-display--inline'
                : 'vads-u-margin-top--0p5'
            }
          />
        );
        // On the review & submit page, there may be more than one of these
        // components in edit mode with the same content, e.g. 526
        // ratedDisabilities & unemployabilityDisabilities causing duplicate
        // input ids/names... an `appendId` value is added to the ui:options
        const appendId = options.appendId ? `_${options.appendId}` : '';
        const elementId = `${id}_${index}${appendId}`;

        const widgetClasses = classNames(
          'form-checkbox',
          options.widgetClassNames,
          { selected: itemIsSelected },
        );

        const labelClass = [
          'schemaform-label',
          checkboxVisible ? '' : 'vads-u-margin-top--0',
        ].join(' ');

        // When a `customTitle` option is included, the ObjectField is set to
        // wrap its contents in a div instead of a dl, so we don't need a
        // include dt and dd elements in the markup; this change fixes an
        // accessibility issue
        return (
          <div key={index} className={widgetClasses}>
            {checkboxVisible && (
              <input
                type="checkbox"
                id={elementId}
                name={elementId}
                checked={
                  typeof itemIsSelected === 'undefined' ? false : itemIsSelected
                }
                required={required}
                disabled={itemIsDisabled}
                onChange={event => this.onChange(index, event.target.checked)}
              />
            )}
            <label className={labelClass} htmlFor={elementId}>
              {labelWithData}
            </label>
          </div>
        );
      });

    const hasCustomTitle = !!customTitle?.trim();
    const Tag = formContext.onReviewPage ? 'h4' : 'h3';

    const content =
      itemsList && (!inReviewMode || (inReviewMode && hasSelections)) ? (
        itemsList
      ) : (
        <p>
          <strong>
            {`No rated disabilities ${
              items?.length > 0 ? 'selected' : 'found'
            }`}
          </strong>
        </p>
      );

    // Let the user know we changed stuff
    const updateMessage = this.hasUpdatedDisabilities ? (
      <div className="usa-alert usa-alert-info background-color-only vads-u-margin-top--0">
        <div className="usa-alert-body">
          <strong>We’ve updated your list of rated disabilities</strong>
          <p />
          Please review the updated list because some disabilities may have been
          added or removed, or your selections may have changed.
        </div>
      </div>
    ) : (
      ''
    );

    return hasCustomTitle ? (
      <fieldset>
        <legend>
          <Tag className="vads-u-font-size--h5">{customTitle}</Tag>
        </legend>
        {updateMessage}
        {content}
      </fieldset>
    ) : (
      <>
        {updateMessage}
        {content}
      </>
    );
  }
}

SelectArrayItemsWidget.propTypes = {
  value: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      ratingPercentage: PropTypes.number,
      decisionCode: PropTypes.string.isRequired,
      decisionText: PropTypes.string.isRequired,
    }),
  ).isRequired,
  updatedRatedDisabilities: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      ratingPercentage: PropTypes.number,
      decisionCode: PropTypes.string.isRequired,
      decisionText: PropTypes.string.isRequired,
    }),
  ),
  id: PropTypes.string.isRequired,
  options: PropTypes.shape({
    title: PropTypes.string,
    customTitle: PropTypes.string,
    field: PropTypes.string,
    label: PropTypes.func,
    showFieldLabel: PropTypes.string,
    validations: PropTypes.array,
  }).isRequired,
  required: PropTypes.bool,
  formContext: PropTypes.object.isRequired,
  formId: PropTypes.string.isRequired,
  formData: PropTypes.shape({}),
  metadata: PropTypes.shape({
    version: PropTypes.number,
    returnUrl: PropTypes.string,
    submission: PropTypes.shape({}),
  }),
  setData: PropTypes.func,
  autoSaveForm: PropTypes.func,
  testUpdatedRatedDisabilities: PropTypes.bool,
};

SelectArrayItemsWidget.defaultProps = {
  value: [],
  formData: {},
  loadedData: {
    metadata: {},
  },
  setData: () => {},
  autoSaveForm: () => {},
};

const mapDispatchToProps = {
  setData,
  autoSaveForm,
};

const mapStateToProps = state => {
  const { form } = state;
  return {
    formId: form.formId,
    formData: form.data,
    metadata: form.loadedData?.metadata || {},
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectArrayItemsWidget);

export { SelectArrayItemsWidget };
