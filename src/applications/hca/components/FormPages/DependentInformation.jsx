import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';

import useAfterRenderEffect from '../../hooks/useAfterRenderEffect';
import {
  DEPENDENT_VIEW_FIELDS,
  SESSION_ITEM_NAME,
  SHARED_PATHS,
} from '../../utils/constants';
import {
  dependentSchema as schema,
  dependentUISchema as uiSchema,
} from '../../definitions/dependent';

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
    goBack,
    goToPath,
    setFormData,
    contentBeforeButtons,
    contentAfterButtons,
  } = props;

  const { dependents = [] } = data || {};
  const search = new URLSearchParams(window.location.search);
  const action = search.get('action') || 'add';
  const oldDependents = useRef(dependents);

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

      if (action === 'edit') {
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
    },
    onChange: formData => {
      setLocalData({ ...localData, ...formData });
    },
    onConfirm: () => {
      setFormData({ ...data, dependents: oldDependents.current });
      goToPath(`/${DEPENDENT_PATHS.summary}`);
    },
    onGoBack: () => {
      const index = activePages.findIndex(item => item.id === currentPage.id);
      if (index > 0) {
        setCurrentPage(activePages[index - 1]);
      } else {
        setFormData({ ...data, dependents: oldDependents.current });
        goToPath(`/${DEPENDENT_PATHS.summary}`);
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
        goToPath(`/${DEPENDENT_PATHS.summary}`);
      } else {
        setCurrentPage(activePages[index + 1]);
      }
    },
    showConfirm: () => {
      showModal(true);
    },
  };

  // append a title attribute to the uiSchema based on the current `page` -- use dependents full name, if available
  const currentUISchema = useMemo(
    () => {
      const name =
        currentPage.id !== 'basic'
          ? `${localData.fullName.first} ${localData.fullName.last}`
          : 'Dependent';
      return {
        ...uiSchema[currentPage.id],
        'ui:title': `${name} - ${currentPage.title}`,
      };
    },
    [currentPage, localData],
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
   * NOTE: localData will be empty ONLY when cancelling an `add` action
   */
  useEffect(
    () => {
      const slices = {
        beforeIndex: dependents.slice(0, searchIndex()),
        afterIndex: dependents.slice(searchIndex() + 1),
      };
      const dataToSet = !localData
        ? {
            dependents: [...slices.beforeIndex, ...slices.afterIndex],
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
      const pagesToSet = SUB_PAGES.reduce((acc, page) => {
        if ('depends' in page) {
          const { key, value } = page.depends;
          if (localData[key] === value) {
            acc.push(page);
          }
        } else {
          acc.push(page);
        }
        return acc;
      }, []);
      setActivePages(pagesToSet);
    },
    [localData],
  );

  return (
    <>
      {currentPage ? (
        <SchemaForm
          name="Dependent"
          title="Dependent"
          data={localData}
          uiSchema={currentUISchema}
          schema={schema[currentPage.id]}
          onSubmit={handlers.onSubmit}
          onChange={handlers.onChange}
        >
          {/** Cancel confirmation modal trigger */}
          <div className="vads-u-margin-y--2">
            <va-button
              text={`Cancel ${action}ing this dependent`}
              onClick={handlers.showConfirm}
              secondary
            />
          </div>

          {/** Form progress buttons */}
          {contentBeforeButtons}
          <div className="row form-progress-buttons schemaform-buttons vads-u-margin-y--2">
            <div className="small-6 medium-5 columns">
              {goBack && (
                <ProgressButton
                  ariaDescribedBy="nav-form-header"
                  buttonClass="usa-button-secondary"
                  onButtonClick={handlers.onGoBack}
                  buttonText="Back"
                  beforeText="«"
                />
              )}
            </div>
            <div className="small-6 medium-5 end columns">
              <ProgressButton
                ariaDescribedBy="nav-form-header"
                buttonClass="usa-button-primary"
                buttonText="Continue"
                afterText="»"
                submitButton
              />
            </div>
          </div>
          {contentAfterButtons}
        </SchemaForm>
      ) : null}

      <VaModal
        modalTitle={`Are you sure you want to cancel ${action}ing this dependent?`}
        primaryButtonText={`Yes, cancel ${action}ing this dependent`}
        secondaryButtonText="No, continue"
        onPrimaryButtonClick={handlers.onConfirm}
        onSecondaryButtonClick={handlers.onCancel}
        onCloseEvent={handlers.onCancel}
        visible={modal}
        status="warning"
        clickToClose
      >
        <p className="vads-u-margin--0">
          This will stop {`${action}ing`}
          the dependent. You will return to a list of any previously added
          dependents and your changes will not be applied.
        </p>
      </VaModal>
    </>
  );
};

DependentInformation.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  data: PropTypes.object,
  goBack: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

export default DependentInformation;
