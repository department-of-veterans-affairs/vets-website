import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { SchemaForm } from 'platform/forms-system/exportsFile';
import { scrollToTop } from 'platform/utilities/scroll';
import { focusElement } from 'platform/utilities/ui';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { dataDogLogger } from 'platform/monitoring/Datadog/utilities';

import { modalContent } from '../config/chapters/report-add-a-spouse/spouse-information/spouseInformation';
import { showDupeModalIfEnabled } from '../config/utilities';

const CurrentSpouseInformation = ({
  name,
  title,
  data = {},
  goBack,
  goForward,
  goToPath,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
  schema,
  uiSchema,
  updatePage,
  onReviewPage,
}) => {
  const [showSpouseModal, setShowSpouseModal] = useState(false);

  useEffect(() => {
    scrollToTop();
  }, []);

  // Get current spouse from dependents list from API (added via prefill)
  const dependents =
    (data?.dependents?.hasDependents && data.dependents?.awarded) || [];
  const currentSpouse =
    dependents.find(
      dependent => dependent.relationshipToVeteran === 'Spouse',
    ) || {};

  const handlers = {
    onModalClose: () => {
      setShowSpouseModal(false);
      dataDogLogger({
        message: 'Duplicate modal',
        attributes: { state: 'hidden', buttonUsed: 'close' },
      });
      setTimeout(() => {
        focusElement('.usa-button-primary');
      }, 100);
    },
    onModalCancel: () => {
      setShowSpouseModal(false);
      dataDogLogger({
        message: 'Duplicate modal',
        attributes: { state: 'hidden', buttonUsed: 'cancel' },
      });
      // Canceling redirects back to the add dependents options page
      goToPath('/options-selection/add-dependents');
    },
    onModalAdd: () => {
      setShowSpouseModal(false);
      dataDogLogger({
        message: 'Duplicate modal',
        attributes: { state: 'hidden', buttonUsed: 'accept' },
      });
      goForward(data);
    },

    onChange: newData => {
      setFormData(newData);
    },
    onSubmit: () => {
      if (
        showDupeModalIfEnabled(data) &&
        currentSpouse.dateOfBirth === data.spouseInformation.birthDate
      ) {
        setShowSpouseModal(true);
        dataDogLogger({
          message: 'Duplicate modal',
          attributes: { state: 'shown', buttonUsed: null },
        });
      } else {
        goForward(data);
      }
    },
  };

  return (
    <>
      {showSpouseModal && (
        <VaModal
          status="warning"
          modalTitle={modalContent.title}
          primaryButtonText={modalContent.primaryButtonText}
          secondaryButtonText={modalContent.secondaryButtonText}
          onCloseEvent={handlers.onModalClose}
          onPrimaryButtonClick={handlers.onModalCancel}
          onSecondaryButtonClick={handlers.onModalAdd}
          visible={showSpouseModal}
        >
          {modalContent.content(currentSpouse)}
        </VaModal>
      )}
      <SchemaForm
        name={name}
        title={title}
        data={data}
        appStateData={data}
        schema={schema}
        uiSchema={uiSchema}
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
};

CurrentSpouseInformation.propTypes = {
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

export default CurrentSpouseInformation;
