import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';

import {
  INSURANCE_VIEW_FIELDS,
  SESSION_ITEMS,
  SHARED_PATHS,
} from '../../utils/constants';
import {
  getDataToSet,
  getSearchAction,
  getSearchIndex,
  getDefaultState,
} from '../../utils/helpers/listloop-pattern';
import { replaceStrValues } from '../../utils/helpers/general';
import policyInformation from '../../config/chapters/insuranceInformation/policyInformation';
import content from '../../locales/en/content.json';
import SaveInProgressWarning from '../FormAlerts/SaveInProgressWarning';

// declare shared route & schema attrs from the form
const { insurance: INSURANCE_PATHS } = SHARED_PATHS;
const { uiSchema, schema } = policyInformation;

// declare default component
const InsurancePolicyInformation = props => {
  const { data, goToPath, setFormData } = props;

  const { providers = [] } = data;
  const search = new URLSearchParams(window.location.search);
  const searchIndex = getSearchIndex(search, providers);
  const searchAction = getSearchAction(search, INSURANCE_PATHS.summary);
  const defaultState = getDefaultState({
    defaultData: { data: {} },
    dataToSearch: providers,
    name: SESSION_ITEMS.insurance,
    searchAction,
    searchIndex,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const listRef = useMemo(() => providers, []);

  /**
   * declare default state/ref variables
   *  - localData - the object that will hold the dependent form data
   *  - modal - the settings to trigger cancel confirmation show/hide
   */
  const [localData, setLocalData] = useState(defaultState.data);
  const [modal, showModal] = useState(false);

  /**
   * declare event handlers
   *  - onCancel - fired on modal close and secondary button click - no action taken
   *  - onChange - fired when data from local form components is updated
   *  - onConfirm - fired on modal primary button click - returns to summary page
   *  - onGoBack - fired on click of back progress button - returns to summary page
   *  - onSubmit - fired on click of continue progress button - sets form data & returns to summary page
   *  - showConfirm - fired on cancel button click - show modal for confirmation of cancel action
   */
  const handlers = {
    onCancel: () => {
      showModal(false);
      document
        .getElementById('ezr-modal-cancel')
        .shadowRoot?.children[0]?.focus();
    },
    onChange: formData => {
      setLocalData({ ...localData, ...formData });
    },
    onConfirm: () => {
      setLocalData(null);
      goToPath(searchAction.pathToGo);
    },
    onGoBack: () => {
      handlers.showConfirm();
    },
    onSubmit: () => {
      const dataToSet = getDataToSet({
        slices: {
          beforeIndex: providers.slice(0, searchIndex),
          afterIndex: providers.slice(searchIndex + 1),
        },
        viewFields: INSURANCE_VIEW_FIELDS,
        dataKey: 'providers',
        localData,
        listRef,
      });
      setFormData({ ...data, ...dataToSet });
      goToPath(searchAction.pathToGo);
    },
    showConfirm: () => {
      showModal(true);
    },
  };

  return (
    <>
      <SaveInProgressWarning type="policy" />
      <SchemaForm
        name="Insurance"
        title="Insurance"
        data={localData}
        uiSchema={uiSchema}
        schema={schema}
        onSubmit={handlers.onSubmit}
        onChange={handlers.onChange}
      >
        {/** Cancel confirmation modal trigger */}
        <div className="vads-u-margin-y--2">
          <va-button
            id="ezr-modal-cancel"
            text={replaceStrValues(
              content['insurance-cancel-button-text'],
              searchAction.label,
            )}
            onClick={handlers.showConfirm}
            secondary
            uswds
          />
        </div>

        {/** Form progress buttons */}
        <FormNavButtons goBack={handlers.onGoBack} submitToContinue />
      </SchemaForm>

      <VaModal
        modalTitle={replaceStrValues(
          content['insurance-modal-cancel-title'],
          searchAction.label,
        )}
        primaryButtonText={replaceStrValues(
          content['modal-cancel-button-primary-text'],
          searchAction.label,
        )}
        secondaryButtonText={replaceStrValues(
          content['modal-cancel-button-secondary-text'],
          searchAction.label,
        )}
        onPrimaryButtonClick={handlers.onConfirm}
        onSecondaryButtonClick={handlers.onCancel}
        onCloseEvent={handlers.onCancel}
        visible={modal}
        status="warning"
        clickToClose
        uswds
      >
        <p className="vads-u-margin--0">
          {replaceStrValues(
            content['insurance-modal-cancel-description'],
            searchAction.label,
          )}
        </p>
      </VaModal>
    </>
  );
};

InsurancePolicyInformation.propTypes = {
  data: PropTypes.object,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

export default InsurancePolicyInformation;
