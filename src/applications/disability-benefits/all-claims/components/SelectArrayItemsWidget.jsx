import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';
import { setData } from 'platform/forms-system/src/js/actions';
import { autoSaveForm } from 'platform/forms/save-in-progress/actions';

// TODO: Safety checks for `selected` callback and `label` element

class SelectArrayItemsWidget extends React.Component {
  state = {
    hasUpdatedRatedDisabilities: this.props.loadedData?.metadata
      ?.ratedDisabilitiesUpdated,
  };

  onChange = (index, checked) => {
    const items = set(
      `[${index}].${this.props.options.selectedPropName ||
        this.defaultSelectedPropName}`,
      checked,
      this.props.value,
    );
    this.props.onChange(items);
  };

  defaultSelectedPropName = 'view:selected';

  processRatedDisabilityUpdates = () => {
    const {
      formId,
      value,
      setFormData,
      formData,
      saveForm,
      loadedData,
    } = this.props;

    const keyValue = 'ratedDisabilities';
    const keyConstants = ['ratingDecisionId', 'diagnosticCode'];
    const newValues = loadedData?.formData?.[keyValue];

    // Whenever the rated disabilities are updated, the
    // ratedDisabilitiesUpdated is set in the metadata. This bit of code
    // ensures that exactly matching previously selected entries are still
    // selected
    const updatedItems = newValues.map(newValue => {
      const isExistingIssue = (value || []).find(oldValue =>
        keyConstants.every(key => oldValue?.[key] === newValue?.[key]),
      );
      return isExistingIssue?.[this.defaultSelectedPropName]
        ? { ...newValue, [this.defaultSelectedPropName]: true }
        : newValue;
    });

    const hasUnchangedRatedDisabilities = (value || []).every(
      (issue, index) =>
        [keyValue][index]?.[keyConstants[0]] === issue?.[keyConstants[0]],
    );

    if (!hasUnchangedRatedDisabilities) {
      const data = {
        ...formData,
        // Add ratedDisabilities (from API) values to the form; it's added
        // here instead of the intro page because at that point the prefill
        // or save-in-progress data would overwrite it
        [keyValue]: updatedItems,
      };
      setFormData(data);
      const { version, returnUrl, submission } = loadedData.metadata;
      saveForm(formId, data, version, returnUrl, submission);
    }
  };

  render() {
    const {
      value: items,
      id,
      options,
      required,
      formContext,
      loadedData,
    } = this.props;

    // rated disabilities updated on the backend
    if (loadedData?.metadata?.ratedDisabilitiesUpdated) {
      this.processRatedDisabilityUpdates();
      return null;
    }

    // Need customTitle to set error message above title.
    const { label: Label, selectedPropName, disabled, customTitle } = options;

    // inReviewMode = true (review page view, not in edit mode)
    // inReviewMode = false (in edit mode)
    const onReviewPage = formContext.onReviewPage;
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
    const updateMessage = !this.state.hasUpdatedRatedDisabilities ? (
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
      ratingPercentage: PropTypes.number.isRequired,
      decisionCode: PropTypes.string.isRequired,
      decisionText: PropTypes.string.isRequired,
    }),
  ).isRequired,
  id: PropTypes.string.isRequired,
  options: PropTypes.shape({
    title: PropTypes.string,
    customTitle: PropTypes.string,
    field: PropTypes.string,
    label: PropTypes.function,
    showFieldLabel: PropTypes.string,
    validations: PropTypes.array,
  }).isRequired,
  required: PropTypes.bool,
  formContext: PropTypes.object.isRequired,
};

const mapDispatchToProps = () => ({
  setFormData: setData,
  saveForm: autoSaveForm,
});

const mapStateToProps = state => ({
  loadedData: state.form.loadedData,
  formId: state.form.formId,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectArrayItemsWidget);

export { SelectArrayItemsWidget };
