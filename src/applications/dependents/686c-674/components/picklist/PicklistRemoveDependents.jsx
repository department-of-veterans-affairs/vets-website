import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  VaCheckboxGroup,
  VaCheckbox,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { scrollToTop } from 'platform/utilities/scroll';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

import {
  PICKLIST_DATA,
  PICKLIST_PATHS,
  PICKLIST_EDIT_REVIEW_FLAG,
} from '../../config/constants';
import { getPicklistRoutes } from './routes';
import { RemoveParentAdditionalInfo, scrollToError } from './helpers';

import { getFullName, calculateAge } from '../../../shared/utils';

/**
 * Main remove dependents picklist component
 * @typedef {object} RemoveDependentsPicklistProps
 * @property {object} data - form data
 * @property {function} goBack - function to go to previous page
 * @property {function} goForward - function to go to next page
 * @property {function} goToPath - function to go to specific path
 * @property {function} setFormData - function to set form data
 * @property {node} contentBeforeButtons - content to render before buttons
 * @property {node} contentAfterButtons - content to render after buttons
 * @property {function} onSubmit - function to handle form submission
 *
 * @param {RemoveDependentsPicklistProps} props - Component props
 * @returns {React.Component} - Main remove dependents picklist page
 */
const RemoveDependentsPicklist = ({
  data = {},
  goBack,
  goToPath,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
  onSubmit,
}) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showCheckboxError, setShowCheckboxError] = useState(false);
  useEffect(() => {
    scrollToTop();
  }, []);

  sessionStorage.removeItem(PICKLIST_EDIT_REVIEW_FLAG);

  // Get current spouse from dependents list from API (added via prefill)
  const dependents =
    (data?.dependents?.hasDependents && data.dependents?.awarded) || [];

  // picklistChoices is an array so we can use the followup page pattern (using
  // arrayPath, showPagePerItem & itemFilter)
  const picklistChoices = dependents.reduce((acc, dependent, index) => {
    // Set initial value to false if not set
    // This ensures the checkbox is unchecked on initial render
    acc[index] = { ...dependent, ...acc[index] };
    return acc;
  }, data[PICKLIST_DATA] || []);
  const atLeastOneChecked = (list = picklistChoices) =>
    list.some(v => v.selected);
  const hasParentDependent = picklistChoices.some(
    item => item.relationshipToVeteran === 'Parent',
  );

  const handlers = {
    onChange: event => {
      const isChecked = event.detail.checked;
      const key = event.target.getAttribute('data-key');
      const newList = picklistChoices.map(
        item => (item.key === key ? { ...item, selected: isChecked } : item),
      );

      setFormData({ ...data, [PICKLIST_DATA]: newList });
      setShowCheckboxError(formSubmitted && !atLeastOneChecked(newList));
    },
    onSubmit: event => {
      event.preventDefault();
      setFormSubmitted(true);
      if (atLeastOneChecked()) {
        setFormData({ ...data, [PICKLIST_PATHS]: getPicklistRoutes(data) });
        const firstSelectedIndex = picklistChoices.findIndex(
          item => item.selected,
        );
        onSubmit(data);
        // Go to the followup page for the first selected dependent
        goToPath(`remove-dependent?index=${firstSelectedIndex}`, {
          force: true,
        });
      } else {
        setShowCheckboxError(true);
        scrollToError();
      }
    },
  };

  return (
    <form onSubmit={handlers.onSubmit}>
      <VaCheckboxGroup
        class="vads-u-margin-bottom--2"
        error={showCheckboxError ? 'Select at least one option' : null}
        label-header-level="3"
        label="Which dependents would you like to remove?"
        hint="Select all that apply."
        onVaChange={handlers.onChange}
        required
      >
        {picklistChoices.map(item => {
          const dependentFullName = getFullName(item.fullName);
          const age = calculateAge(item.dateOfBirth, {
            dateInFormat: 'yyyy-MM-dd',
          }).labeledAge;
          return (
            <VaCheckbox
              key={item.key}
              data-key={item.key}
              name={PICKLIST_DATA}
              class="dd-privacy-mask"
              data-dd-action-name="dependent name & age"
              label={dependentFullName}
              checked={item.selected || false}
              tile
            >
              <div slot="internal-description" className="vads-u-margin-y--1">
                {`${item.relationshipToVeteran}, ${age}`}
              </div>
              {item.relationshipToVeteran === 'Parent' ? (
                <div slot="internal-description">
                  <p className="vads-u-margin-bottom--0">
                    <strong>Note:</strong> You can only use this form to remove
                    a dependent parent if they died.
                  </p>
                </div>
              ) : null}
            </VaCheckbox>
          );
        })}
      </VaCheckboxGroup>

      {hasParentDependent && <RemoveParentAdditionalInfo />}

      {contentBeforeButtons}
      <FormNavButtons goBack={goBack} useWebComponents submitToContinue />
      {contentAfterButtons}
    </form>
  );
};

RemoveDependentsPicklist.propTypes = {
  data: PropTypes.object.isRequired,
  goBack: PropTypes.func.isRequired,
  goToPath: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  schema: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  uiSchema: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

export default RemoveDependentsPicklist;
