import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  VaCheckboxGroup,
  VaCheckbox,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { SchemaForm } from 'platform/forms-system/exportsFile';
import { scrollToTop } from 'platform/utilities/scroll';
import { focusElement } from 'platform/utilities/ui';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
// import { checkboxGroupUI } from 'platform/forms-system/src/js/web-component-patterns';
import { slugifyText } from 'platform/forms-system/src/js/patterns/array-builder';

import { getFullName, calculateAge } from '../../shared/utils';

const RemoveDependentsPicklist = ({
  name,
  title,
  data = {},
  goBack,
  goForward,
  goToPath,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
  uiSchema,
  updatePage,
  onReviewPage,
}) => {
  useEffect(() => {
    scrollToTop();
  }, []);

  // Get current spouse from dependents list from API (added via prefill)
  const dependents =
    (data?.dependents?.hasDependents && data.dependents?.awarded) || [];
  const picklistChoices = data['view:removeDependentPickList'] || {};

  const [showCheckboxError, setShowCheckboxError] = useState(false);

  const handlers = {
    onChange: (event, a, b, c, d) => {
      console.log({ event, a, b, c, d });
      const isChecked = event.detail.checked;
      const key = event.target.getAttribute('data-key');

      console.log({ isChecked, key, event });

      // setFormData(newData);
    },
    onSubmit: () => {
      if (dependents.length > 0) {
        // ???
      } else {
        goForward(data);
      }
    },
  };

  return (
    <>
      <VaCheckboxGroup
        class="vads-u-margin-bottom--2"
        error={showCheckboxError ? 'Select at least one option' : null}
        label="Which dependents would you like to remove?"
        label-header-level="3"
        onVaChange={handlers.onChange}
      >
        {dependents.map(dependent => {
          const dependentFullName = getFullName(dependent.fullName);
          const key = slugifyText(
            `${dependent.fullName.first}-${dependent.ssn.slice(-4)}`,
          );
          const age = calculateAge(dependent.dateOfBirth, {
            dateInFormat: 'yyyy-MM-dd',
          }).labeledAge;
          const description = `${dependent.relationshipToVeteran} | ${age}`;
          const parentNote =
            dependent.relationshipToVeteran === 'Parent' ? (
              <div slot="internal-description">
                <p className="vads-u-margin-bottom--0">
                  <strong>Note:</strong> A parent dependent can only be removed
                  if they have died
                </p>
              </div>
            ) : null;

          return (
            <VaCheckbox
              key={key}
              data-key={key}
              name="view:removeDependentPickList"
              label={dependentFullName}
              checkbox-description={description}
              option-label="Remove"
              value={picklistChoices[key] || false}
              tile
            >
              {parentNote}
            </VaCheckbox>
          );
        })}
      </VaCheckboxGroup>

      <va-additional-info
        class="vads-u-margin-bottom--4"
        trigger="Why can I only remove a parent dependent"
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
    </>
  );

  /* schema

import {
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

checkboxGroupSchema(['test'])



  const { schemaOptions, labels } = dependents.reduce(
    (acc, dependent) => {
      const dependentFullName = getFullName(dependent.fullName);
      if (dependentFullName) {
        const key = slugifyText(
          `${dependent.fullName.first}-${dependent.ssn.slice(-4)}`,
        );
        acc.schemaOptions[key] = { type: 'boolean' };
        acc.labels[key] = {
          title: dependentFullName,
          hint: `${dependent.relationshipToVeteran} | ${dependent.age}`,
        };
      }
      return acc;
    },
    { schemaOptions: {}, labels: {} },
  );

  const schema = {
    type: 'object',
    required: ['view:removeDependentPickList'],
    properties: {
      'view:removeDependentPickList': {
        type: 'object',
        properties: schemaOptions,
      },
    },
  };

  const updatedUiSchema = {
    'view:removeDependentPickList': checkboxGroupUI({
      title: 'Which dependents would you like to remove?',
      enableAnalytics: true,
      required: () => true,
      labelHeaderLevel: '3',
      labels,
      tile: true,
      updateUiSchema: () => ({
        'ui:options': {
          labelHeaderLevel: onReviewPage ? 4 : 3,
        },
      }),
    }),
  };

  console.log({
    uiSchema,
    updatedUiSchema,
    labels,

    schema,
    schemaOptions,
  });

  return (
    <>
      <SchemaForm
        name={name}
        title={title}
        data={data}
        appStateData={data}
        schema={schema}
        uiSchema={updatedUiSchema}
        pagePerItemIndex={0}
        onChange={handlers.onChange}
        onSubmit={handlers.onSubmit}
      >
        {onReviewPage ? (
          <va-button
            onClick={updatePage}
            text="Update page"
            label="Update your spouse's personal information"
            full-width="true"
          />
        ) : (
          <>
            {contentBeforeButtons}
            <FormNavButtons goBack={goBack} submitToContinue />
            {contentAfterButtons}
          </>
        )}
      </SchemaForm>
    </>
  );
  */
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
