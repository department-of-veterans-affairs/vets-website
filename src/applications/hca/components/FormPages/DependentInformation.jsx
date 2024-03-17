import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import DependentListLoopForm from '../FormFields/DependentListLoopForm';

import useAfterRenderEffect from '../../hooks/useAfterRenderEffect';
import {
  isOfCollegeAge,
  getDependentPageList,
  getDataToSet,
  getSearchAction,
  getSearchIndex,
  getDefaultState,
} from '../../utils/helpers';
import {
  DEPENDENT_VIEW_FIELDS,
  SESSION_ITEM_NAME,
  SHARED_PATHS,
} from '../../utils/constants';

const date = new Date();
const lastYear = date.getFullYear() - 1;

// declare shared data & route attrs from the form
const { dependents: DEPENDENT_PATHS } = SHARED_PATHS;

// declare subpage schemas & conditions for form rendering
const SUB_PAGES = [
  {
    id: 'basic',
    title: '%s\u2019s personal information',
  },
  {
    id: 'education',
    title: '%s\u2019s education expenses',
    depends: { key: 'dateOfBirth', value: isOfCollegeAge },
  },
  {
    id: 'additional',
    title: '%s\u2019s additional information',
  },
  {
    id: 'support',
    title: 'Financial support for %s',
    depends: { key: 'cohabitedLastYear', value: false },
  },
  {
    id: 'income',
    title: `%s\u2019s annual income from ${lastYear}`,
    depends: { key: 'view:dependentIncome', value: true },
  },
];

// declare default component
const DependentInformation = props => {
  const { data, goToPath, setFormData } = props;

  const { dependents = [] } = data;
  const search = new URLSearchParams(window.location.search);
  const searchIndex = getSearchIndex(search, dependents);
  const searchAction = getSearchAction(search, DEPENDENT_PATHS.summary);
  const defaultState = getDefaultState({
    defaultData: { data: {}, page: SUB_PAGES[0] },
    dataToSearch: dependents,
    name: SESSION_ITEM_NAME,
    searchAction,
    searchIndex,
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const listRef = useMemo(() => dependents, []);

  /**
   * declare default state/ref variables
   *  - activePages - the array of form `pages` based on data conditions
   *  - currentPage - the current set of form fields to display
   *  - localData - the object that will hold the dependent form data
   *  - modal - the settings to trigger cancel confirmation show/hide
   */
  const [activePages, setActivePages] = useState(
    SUB_PAGES.filter(item => !('depends' in item)),
  );
  const [currentPage, setCurrentPage] = useState(defaultState.page);
  const [localData, setLocalData] = useState(defaultState.data);
  const [modal, showModal] = useState(false);

  /**
   * declare event handlers
   *  - onCancel - fired on modal close and secondary button click - no action taken
   *  - onChange - fired when data from local form components is updated
   *  - onConfirm - fired on modal primary button click - returns to dependents summary page in form
   *  - onGoBack - fired on click of back progress button - render previous form fieldset or go back to summary page
   *  - onSubmit - fired on click of continue progress button - render next form fieldset or populate data into array
   *  - showConfirm - fired on cancel button click - show modal for confirmation of cancel action
   */
  const handlers = {
    onCancel: () => {
      showModal(false);
      document
        .getElementById('hca-modal-cancel')
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
            beforeIndex: dependents.slice(0, searchIndex),
            afterIndex: dependents.slice(searchIndex + 1),
          },
          viewFields: DEPENDENT_VIEW_FIELDS,
          dataKey: 'dependents',
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

  // apply focus to the `page` title on change -- runs only after first render
  useAfterRenderEffect(
    () => {
      window.scrollTo(0, 0);
      focusElement('#root__title');
    },
    [currentPage],
  );

  // set form data on each change to the localData object state
  /**
   * TODO: bring this back when we have proper validation for partial
   * dependent records
  useEffect(
    () => {
      const dataToSet = getDataToSet({
        slices: {
          beforeIndex: dependents.slice(0, searchIndex),
          afterIndex: dependents.slice(searchIndex + 1),
        },
        viewFields: DEPENDENT_VIEW_FIELDS,
        dataKey: 'dependents',
        localData,
        listRef,
      });
      setFormData({ ...data, ...dataToSet });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [localData],
  );
  */

  // set active pages array based on form data conditionals
  useEffect(
    () => {
      if (localData) {
        const pagesToSet = getDependentPageList(SUB_PAGES, localData);
        setActivePages(pagesToSet);
      }
    },
    [localData],
  );

  /**
   * build list of forms, with display conditional, based on current page id
   *
   * NOTE: This is a bit of a hack, as we cannot reset the submitted state of the
   * SchemaForm component
   */
  const FormList = SUB_PAGES.map(({ id, title }, index) => {
    return currentPage.id === id ? (
      <>
        <DependentListLoopForm
          key={index}
          data={localData}
          page={{ id, title }}
          onChange={handlers.onChange}
          onSubmit={handlers.onSubmit}
        >
          {/** Cancel confirmation modal trigger */}
          <div className="vads-u-margin-y--2">
            <va-button
              id="hca-modal-cancel"
              text={`Cancel ${searchAction.label} this dependent`}
              onClick={handlers.showConfirm}
              secondary
              uswds
            />
          </div>

          {/** Form progress buttons */}
          <FormNavButtons goBack={handlers.onGoBack} submitToContinue />
        </DependentListLoopForm>
      </>
    ) : null;
  });

  return (
    <>
      {FormList}

      <VaModal
        modalTitle={`Cancel ${searchAction.label} this dependent?`}
        primaryButtonText={`Yes, cancel ${searchAction.label}`}
        secondaryButtonText={`No, continue ${searchAction.label}`}
        onPrimaryButtonClick={handlers.onConfirm}
        onSecondaryButtonClick={handlers.onCancel}
        onCloseEvent={handlers.onCancel}
        visible={modal}
        status="warning"
        clickToClose
        uswds
      >
        <p className="vads-u-margin--0">
          If you cancel {searchAction.label} this dependent, we won’t save their
          information. You’ll return to a screen where you can add or remove
          dependents.
        </p>
      </VaModal>
    </>
  );
};

DependentInformation.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  data: PropTypes.object,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

export default DependentInformation;
