import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';

import { replaceStrValues } from '../../utils/helpers/general';
import content from '../../locales/en/content.json';
import {
  INSURANCE_VIEW_FIELDS,
  SESSION_ITEMS,
  SHARED_PATHS,
} from '../../utils/constants';
import policyInformation from '../../config/chapters/insuranceInformation/policyInformation';

// declare shared route & schema attrs from the form
const { insurance: INSURANCE_PATHS } = SHARED_PATHS;
const { uiSchema, schema } = policyInformation;

// declare default component
const InsurancePolicyInformation = props => {
  const {
    data,
    goToPath,
    setFormData,
    contentBeforeButtons,
    contentAfterButtons,
  } = props;

  const { providers = [] } = data;
  const search = new URLSearchParams(window.location.search);
  const mode = search.get('action') || 'add';
  const action = {
    label: `${mode === 'add' ? 'add' : 'edit'}ing`,
    pathToGo:
      mode === 'update' ? '/review-and-submit' : `/${INSURANCE_PATHS.summary}`,
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const listRef = useMemo(() => providers, []);

  // determine where this policy data will live in the array
  const searchIndex = () => {
    let indexToReturn = parseInt(search.get('index'), 10);
    if (Number.isNaN(indexToReturn) || indexToReturn > providers.length) {
      indexToReturn = providers.length;
    }
    return indexToReturn;
  };

  // determine which dataset to start with based on the index
  const defaultData = () => {
    let resultToReturn = {};

    // check if data exists at the array index and set return result accordingly
    if (typeof providers[searchIndex()] !== 'undefined') {
      resultToReturn = providers[searchIndex()];

      if (mode !== 'add') {
        window.sessionStorage.setItem(SESSION_ITEMS.insurance, searchIndex());
      }
    }

    return resultToReturn;
  };

  /**
   * declare default state/ref variables
   *  - localData - the object that will hold the dependent form data
   *  - modal - the settings to trigger cancel confirmation show/hide
   */
  const [localData, setLocalData] = useState(defaultData());
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
        .shadowRoot.children[0].focus();
    },
    onChange: formData => {
      setLocalData({ ...localData, ...formData });
    },
    onConfirm: () => {
      setLocalData(null);
      goToPath(action.pathToGo);
    },
    onGoBack: () => {
      handlers.showConfirm();
    },
    onSubmit: () => {
      setFormData({
        ...data,
        [INSURANCE_VIEW_FIELDS.add]: null,
        [INSURANCE_VIEW_FIELDS.skip]: true,
      });
      goToPath(action.pathToGo);
    },
    showConfirm: () => {
      showModal(true);
    },
  };

  // set form data on each change to the localData object state
  useEffect(
    () => {
      const slices = {
        beforeIndex: providers.slice(0, searchIndex()),
        afterIndex: providers.slice(searchIndex() + 1),
      };
      const dataToSet =
        localData === null
          ? {
              providers: listRef,
              [INSURANCE_VIEW_FIELDS.add]: null,
              [INSURANCE_VIEW_FIELDS.skip]: true,
            }
          : {
              providers: [
                ...slices.beforeIndex,
                localData,
                ...slices.afterIndex,
              ],
            };
      setFormData({ ...data, ...dataToSet });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [localData],
  );

  return (
    <>
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
            text={replaceStrValues(
              content['insurance-cancel-button-text'],
              action.label,
            )}
            onClick={handlers.showConfirm}
            secondary
            id="ezr-modal-cancel"
          />
        </div>

        {/** Form progress buttons */}
        {contentBeforeButtons}
        <FormNavButtons goBack={handlers.onGoBack} submitToContinue />
        {contentAfterButtons}
      </SchemaForm>

      <VaModal
        modalTitle={replaceStrValues(
          content['insurance-modal-cancel-title'],
          action.label,
        )}
        primaryButtonText={replaceStrValues(
          content['insurance-modal-cancel-button-primary-text'],
          action.label,
        )}
        secondaryButtonText={replaceStrValues(
          content['insurance-modal-cancel-button-secondary-text'],
          action.label,
        )}
        onPrimaryButtonClick={handlers.onConfirm}
        onSecondaryButtonClick={handlers.onCancel}
        onCloseEvent={handlers.onCancel}
        visible={modal}
        status="warning"
        clickToClose
      >
        <p className="vads-u-margin--0">
          {replaceStrValues(
            content['insurance-modal-cancel-description'],
            action.label,
          )}
        </p>
      </VaModal>
    </>
  );
};

InsurancePolicyInformation.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  data: PropTypes.object,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

export default InsurancePolicyInformation;
