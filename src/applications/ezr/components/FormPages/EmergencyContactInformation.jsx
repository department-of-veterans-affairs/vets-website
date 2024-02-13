import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import {
  EMERGENCY_CONTACT_VIEW_FIELDS,
  EMERGENCY_CONTACT_SUBPAGES,
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
import { getDependentPageList } from '../../utils/helpers/household';
import useAfterRenderEffect from '../../hooks/useAfterRenderEffect';
import EmergencyContactListLoopForm from '../FormFields/EmergencyContactListLoopForm';
import content from '../../locales/en/content.json';

// declare shared data & route attrs from the form
const { emergencyContacts: EMERGENCY_CONTACT_PATHS } = SHARED_PATHS;

// declare default component
const EmergencyContactInformation = props => {
  const { data, goToPath, setFormData } = props;

  const { veteranContacts = [] } = data;
  const search = new URLSearchParams(window.location.search);
  const searchIndex = getSearchIndex(search, veteranContacts);
  const searchAction = getSearchAction(search, EMERGENCY_CONTACT_PATHS.summary);
  const defaultState = getDefaultState({
    defaultData: { data: {}, page: EMERGENCY_CONTACT_SUBPAGES[0] },
    dataToSearch: veteranContacts,
    name: SESSION_ITEMS.emergencyContact,
    searchAction,
    searchIndex,
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const listRef = useMemo(() => veteranContacts, []);

  /**
   * declare default state/ref variables
   *  - activePages - the array of form `pages` based on data conditions
   *  - currentPage - the current set of form fields to display
   *  - localData - the object that will hold the emergency contact form data
   *  - modal - the settings to trigger cancel confirmation show/hide
   */
  const [activePages, setActivePages] = useState(
    EMERGENCY_CONTACT_SUBPAGES.filter(item => !('depends' in item)),
  );
  const [currentPage, setCurrentPage] = useState(defaultState.page);
  const [localData, setLocalData] = useState(defaultState.data);
  const [modal, showModal] = useState(false);

  /**
   * declare event handlers
   *  - onCancel - fired on modal close and secondary button click - no action taken
   *  - onChange - fired when data from local form components is updated
   *  - onConfirm - fired on modal primary button click - returns to emergency contacts summary page in form
   *  - onGoBack - fired on click of back progress button - render previous form fieldset or go back to summary page
   *  - onSubmit - fired on click of continue progress button - render next form fieldset or populate data into array
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
      const index = activePages.findIndex(item => item.id === currentPage.id);
      if (index > 0) {
        setCurrentPage(activePages[index - 1]);
      } else {
        handlers.showConfirm();
      }
    },
    onSubmit: () => {
      const index = activePages.findIndex(item => item.id === currentPage.id);
      if (index === activePages.length - 1) {
        const dataToSet = getDataToSet({
          slices: {
            beforeIndex: veteranContacts.slice(0, searchIndex),
            afterIndex: veteranContacts.slice(searchIndex + 1),
          },
          viewFields: EMERGENCY_CONTACT_VIEW_FIELDS,
          dataKey: 'veteranContacts',
          localData,
          listRef,
        });

        setFormData({ ...data, ...dataToSet });
        goToPath(searchAction.pathToGo);
      } else {
        setCurrentPage(activePages[index + 1]);
      }
    },
    showConfirm: () => {
      showModal(true);
    },
  };

  // set active pages array based on form data conditionals
  useEffect(
    () => {
      if (localData) {
        const pagesToSet = getDependentPageList(
          EMERGENCY_CONTACT_SUBPAGES,
          localData,
        );
        setActivePages(pagesToSet);
      }
    },
    [localData],
  );

  // apply focus to the `page` title on change -- runs only after first render
  useAfterRenderEffect(
    () => {
      window.scrollTo(0, 0);
      focusElement('#root__title');
    },
    [currentPage],
  );

  /**
   * build list of forms, with display conditional, based on current page id
   *
   * NOTE: This is a bit of a hack, as we cannot reset the submitted state of the
   * SchemaForm component
   */
  const FormList = EMERGENCY_CONTACT_SUBPAGES.map(({ id, title }) => {
    return currentPage.id === id ? (
      <EmergencyContactListLoopForm
        data={localData}
        page={{ id, title }}
        onChange={handlers.onChange}
        onSubmit={handlers.onSubmit}
      >
        {/** Cancel confirmation modal trigger */}
        <div className="vads-u-margin-y--2">
          <va-button
            text={replaceStrValues(
              content['emergency-contact-cancel-button-text'],
              searchAction.label,
            )}
            onClick={handlers.showConfirm}
            secondary
            id="ezr-modal-cancel"
          />
        </div>

        {/** Form progress buttons */}
        <FormNavButtons goBack={handlers.onGoBack} submitToContinue />
      </EmergencyContactListLoopForm>
    ) : null;
  });

  return (
    <>
      {FormList}

      <VaModal
        modalTitle={replaceStrValues(
          content['emergency-contact-modal-cancel-title'],
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
            content['emergency-contact-modal-cancel-description'],
            searchAction.label,
          )}
        </p>
      </VaModal>
    </>
  );
};

EmergencyContactInformation.propTypes = {
  data: PropTypes.object,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

export default EmergencyContactInformation;
