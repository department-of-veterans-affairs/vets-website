import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  VaCheckboxGroup,
  VaCheckbox,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { scrollToTop } from 'platform/utilities/scroll';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { scrollToFirstError } from '~/platform/utilities/ui';
import { slugifyText } from 'platform/forms-system/src/js/patterns/array-builder';

import { getFullName, calculateAge } from '../../shared/utils';

const RemoveDependentsPicklist = ({
  data = {},
  goBack,
  goForward,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showCheckboxError, setShowCheckboxError] = useState(false);
  useEffect(() => {
    scrollToTop();
  }, []);

  // Get current spouse from dependents list from API (added via prefill)
  const dependents =
    (data?.dependents?.hasDependents && data.dependents?.awarded) || [];
  const slugifyKey = dependent =>
    slugifyText(`${dependent.fullName.first}-${dependent.ssn.slice(-4)}`);
  const keys = dependents.map(slugifyKey);

  // picklistChoices is an array so we can use the followup page pattern (using
  // arrayPath, showPagePerItem & itemFilter)
  const picklistChoices = dependents.reduce((acc, dependent, index) => {
    const key = keys[index];
    // Set initial value to false if not set
    // This ensures the checkbox is unchecked on initial render
    acc[index] = {
      ...dependent,
      key,
      selected: acc[index]?.selected || false,
    };
    return acc;
  }, data['view:removeDependentPickList'] || []);
  const atLeastOneChecked = (list = picklistChoices) =>
    list.some(v => v.selected);

  const handlers = {
    onChange: event => {
      const isChecked = event.detail.checked;
      const key = event.target.getAttribute('data-key');
      const newList = picklistChoices.map(
        item => (item.key === key ? { ...item, selected: isChecked } : item),
      );

      setFormData({
        ...data,
        'view:removeDependentPickList': newList,
      });
      setShowCheckboxError(formSubmitted && !atLeastOneChecked(newList));
    },
    onSubmit: event => {
      event.preventDefault();
      setFormSubmitted(true);
      if (atLeastOneChecked()) {
        goForward(data);
      } else {
        setShowCheckboxError(true);
        setTimeout(scrollToFirstError);
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
        hint="Select all dependents you would like to remove"
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
              name="view:removeDependentPickList"
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
                    <strong>Note:</strong> A parent dependent can only be
                    removed if they have died
                  </p>
                </div>
              ) : null}
            </VaCheckbox>
          );
        })}
      </VaCheckboxGroup>

      <va-additional-info
        class="vads-u-margin-bottom--4"
        trigger="Why can I only remove a parent dependent if they have died?"
      >
        The only removal option for a parent allowed in this form is due to
        death. If your parent is still living and you need to make changes to
        your benefits, call us at <va-telephone contact="8008271000" /> (
        <va-telephone contact="711" tty />
        ).
      </va-additional-info>

      {contentBeforeButtons}
      <FormNavButtons goBack={goBack} submitToContinue />
      {contentAfterButtons}
    </form>
  );
};

RemoveDependentsPicklist.propTypes = {
  data: PropTypes.object.isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  goToPath: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  schema: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  uiSchema: PropTypes.object.isRequired,
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

export default RemoveDependentsPicklist;
