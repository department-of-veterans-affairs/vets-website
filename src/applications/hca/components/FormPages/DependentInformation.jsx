import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import DependentListLoopForm from '../FormFields/DependentListLoopForm';

import useAfterRenderEffect from '../../hooks/useAfterRenderEffect';
import {
  createLiteralMap,
  isOfCollegeAge,
  getDependentPageList,
} from '../../utils/helpers';
import {
  DEPENDENT_VIEW_FIELDS,
  SESSION_ITEM_NAME,
  SHARED_PATHS,
} from '../../utils/constants';

// declare shared data & route attrs from the form
const { dependents: DEPENDENT_PATHS } = SHARED_PATHS;

// declare subpage schemas & conditions for form rendering
const SUB_PAGES = [
  {
    id: 'basic',
    title: 'basic information',
  },
  {
    id: 'education',
    title: 'educational expenses',
    depends: { key: 'dateOfBirth', value: isOfCollegeAge },
  },
  {
    id: 'additional',
    title: 'additional information',
  },
  {
    id: 'support',
    title: 'additional information',
    depends: { key: 'cohabitedLastYear', value: false },
  },
  {
    id: 'income',
    title: 'annual income',
    depends: { key: 'view:dependentIncome', value: true },
  },
];

// declare default component
const DependentInformation = props => {
  const {
    data,
    goToPath,
    setFormData,
    contentBeforeButtons,
    contentAfterButtons,
  } = props;

  const { dependents = [] } = data;
  const search = new URLSearchParams(window.location.search);
  const mode = search.get('action') || 'add';
  const action = {
    label: `${mode === 'add' ? 'add' : 'edit'}ing`,
    pathToGo:
      mode === 'update' ? '/review-and-submit' : `/${DEPENDENT_PATHS.summary}`,
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const listRef = useMemo(() => dependents, []);

  // determine where this dependent data will live in the array
  const searchIndex = () => {
    let indexToReturn = parseInt(search.get('index'), 10);
    if (Number.isNaN(indexToReturn) || indexToReturn > dependents.length) {
      indexToReturn = dependents.length;
    }
    return indexToReturn;
  };

  // determine which `page` & dataset to start with based on the index
  const defaultStates = () => {
    const resultToReturn = { data: {}, page: SUB_PAGES[0] };

    // check if data exists at the array index and set return result accordingly
    if (typeof dependents[searchIndex()] !== 'undefined') {
      resultToReturn.data = dependents[searchIndex()];

      if (mode !== 'add') {
        window.sessionStorage.setItem(SESSION_ITEM_NAME, searchIndex());
      }
    }

    return resultToReturn;
  };

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
  const [currentPage, setCurrentPage] = useState(defaultStates().page);
  const [localData, setLocalData] = useState(defaultStates().data);
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
        setFormData({
          ...data,
          [DEPENDENT_VIEW_FIELDS.report]: null,
          [DEPENDENT_VIEW_FIELDS.skip]: true,
        });
        goToPath(action.pathToGo);
      } else {
        setCurrentPage(activePages[index + 1]);
      }
    },
    showConfirm: () => {
      showModal(true);
    },
  };

  // construct cancel description for modal based on page mode and form data
  const cancelDescription = useMemo(
    () => {
      const { fullName = {} } = localData || {};
      const normalizedFullName = `${fullName.first} ${
        fullName.last
      } ${fullName.suffix || ''}`.replace(/ +(?= )/g, '');

      const contentMap = createLiteralMap([
        [
          'This will stop adding the dependent. You’ll return to a list of any previously added dependents and this dependent will not be added.',
          ['add'],
        ],
        [
          `This will stop editing ${normalizedFullName}. You will return to a list of any previously added dependents and your edits will not be applied.`,
          ['edit', 'update'],
        ],
      ]);
      return contentMap[mode];
    },
    [localData, mode],
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
   * set form data on each change to the localData object state
   */
  useEffect(
    () => {
      const slices = {
        beforeIndex: dependents.slice(0, searchIndex()),
        afterIndex: dependents.slice(searchIndex() + 1),
      };
      const dataToSet =
        localData === null
          ? {
              dependents: listRef,
              [DEPENDENT_VIEW_FIELDS.report]: null,
              [DEPENDENT_VIEW_FIELDS.skip]: true,
            }
          : {
              dependents: [
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
  const FormList = SUB_PAGES.map(({ id, title }) => {
    return currentPage.id === id ? (
      <>
        <DependentListLoopForm
          data={localData}
          page={{ id, title }}
          onChange={handlers.onChange}
          onSubmit={handlers.onSubmit}
        >
          {/** Cancel confirmation modal trigger */}
          <div className="vads-u-margin-y--2">
            <va-button
              text={`Cancel ${action.label} this dependent`}
              onClick={handlers.showConfirm}
              secondary
              id="hca-modal-cancel"
            />
          </div>

          {/** Form progress buttons */}
          {contentBeforeButtons}
          <FormNavButtons goBack={handlers.onGoBack} submitToContinue />
          {contentAfterButtons}
        </DependentListLoopForm>
      </>
    ) : null;
  });

  return (
    <>
      {FormList}

      <VaModal
        modalTitle={`Cancel ${action.label} this dependent`}
        primaryButtonText={`Yes, cancel ${action.label}`}
        secondaryButtonText={`No, continue ${action.label}`}
        onPrimaryButtonClick={handlers.onConfirm}
        onSecondaryButtonClick={handlers.onCancel}
        onCloseEvent={handlers.onCancel}
        visible={modal}
        status="warning"
        clickToClose
      >
        <p className="vads-u-margin--0">{cancelDescription}</p>
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
