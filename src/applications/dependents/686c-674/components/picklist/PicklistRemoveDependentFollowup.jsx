import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { scrollToTop } from 'platform/utilities/scroll';
import { focusElement, waitForRenderThenFocus } from 'platform/utilities/ui';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import set from 'platform/utilities/data/set';
import { getArrayUrlSearchParams } from 'platform/forms-system/src/js/patterns/array-builder/helpers';
import { VA_FORM_IDS } from 'platform/forms/constants';

import {
  PICKLIST_DATA,
  PICKLIST_PATHS,
  PICKLIST_EDIT_REVIEW_FLAG,
} from '../../config/constants';
import { routing, getPicklistRoutes } from './routes';
import { showExitLink } from './utils';

import { getFullName } from '../../../shared/utils';
import ExitForm from '../../../shared/components/ExitFormLink';

/**
 * Picklist Remove Dependent Followup Component
 * @typedef {object} PicklistRemoveDependentFollowupProps
 *
 * @property {object} data - form data
 * @property {function} goBack - function to go to previous page
 * @property {function} goForward - function to go to next page
 * @property {function} goToPath - function to go to specific path
 * @property {function} setFormData - function to set form data
 * @property {node} contentBeforeButtons - content to render before buttons
 * @property {node} contentAfterButtons - content to render after buttons
 * @property {string} urlTestingOnly - url for testing purposes only
 *
 * @param {PicklistRemoveDependentFollowupProps} props - Component props
 * @returns {React.Component} - Picklist remove dependent followup page
 */
const PicklistRemoveDependentFollowup = ({
  data = {},
  goBack,
  goForward,
  goToPath,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
  urlTestingOnly, // for unit tests
}) => {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const scrollAndFocus = () => {
    setTimeout(() => {
      scrollToTop();
      const el = $('h3, va-radio[label-header-level]');
      if (el?.tagName === 'VA-RADIO') {
        // va-radio content doesn't immediately render
        waitForRenderThenFocus('h3', el.shadowRoot);
      } else {
        focusElement('h3');
      }
    });
  };

  const resetState = () => {
    setFormSubmitted(false);
    scrollAndFocus();
  };

  // Dynamically updated picklist paths to help with navigating backward
  const paths = data[PICKLIST_PATHS] || getPicklistRoutes(data);
  // Get last path is flow if navigating back from review & submit page
  const lastPath = paths.slice(-1)?.[0] || {};

  const queryParams = getArrayUrlSearchParams(urlTestingOnly);
  const indexParam = queryParams.get('index');
  // Index in PICKLIST_DATA
  const index = indexParam ? parseInt(indexParam, 10) || 0 : lastPath.index;
  // Followup page index
  const page = indexParam ? queryParams.get('page') || '' : lastPath.path || '';

  const currentDependent = data[PICKLIST_DATA]?.[index] || {};
  const dependentType = currentDependent.relationshipToVeteran;
  const dependentFullName =
    getFullName(currentDependent.fullName) ||
    `${currentDependent.relationshipToVeteran} dependent`;
  const dependentFirstName = currentDependent?.fullName?.first || 'dependent';
  const dependentGroup = routing?.[dependentType];
  const currentPage =
    page === '' ? 0 : dependentGroup?.findIndex(item => item.path === page);
  const pageToRender = dependentGroup?.[currentPage] || {};
  const reviewPageFlag =
    sessionStorage.getItem(PICKLIST_EDIT_REVIEW_FLAG) === currentDependent.key;
  const canShowExitButton = pageToRender.page?.hasExitLink;
  const isShowingExitLink = canShowExitButton && showExitLink({ data, index });

  // Page change state to force scroll & focus on page change
  useEffect(scrollAndFocus, [page, index]);

  const returnToMainPage = () => {
    goToPath('options-selection/remove-active-dependents');
  };

  if (!pageToRender?.page || !pageToRender.page.Component) {
    returnToMainPage();
    return null;
  }

  const navigation = {
    goForward: () => {
      resetState();
      const nextPage = pageToRender.page.handlers.goForward({
        itemData: currentDependent,
        index,
        fullData: data,
        goToPath,
      });
      if (nextPage === 'DONE') {
        if (!isShowingExitLink) {
          // Find next selected dependent
          const nextSelectedIndex = data[PICKLIST_DATA].findIndex(
            (dep, indx) => indx > index && dep.selected,
          );
          if (reviewPageFlag) {
            goToPath('/review-and-submit');
          } else if (nextSelectedIndex === -1) {
            // Done with removing dependents, go to review & submit page
            goForward(data);
          } else {
            // Go to the followup page for the next selected dependent
            goToPath(`remove-dependent?index=${nextSelectedIndex}`, {
              force: true,
            });
          }
        }
      } else {
        goToPath(`remove-dependent?index=${index}&page=${nextPage}`, {
          force: true,
        });
      }
    },

    goBack: () => {
      resetState();
      let selectedIndex = 0;
      // Page is empty when navigating back from first page of an index back to
      // the last page of the previous index
      if (page === '') {
        const pathsLength = paths.length;
        const prevPageIndex = index - 1;
        // Find the last page of the index, then include an extra 1 because the
        // selectedIndex is expecting the current page index in paths
        while (
          paths[selectedIndex].index <= prevPageIndex &&
          selectedIndex <= pathsLength
        ) {
          selectedIndex += 1;
        }
      } else {
        selectedIndex = paths.findIndex(
          path => path.index === index && path.path === page,
        );
      }

      if (selectedIndex - 1 >= 0) {
        const path = paths[selectedIndex - 1];
        // Go back to previous selected dependent
        goToPath(`remove-dependent?index=${path.index}&page=${path.path}`, {
          force: true,
        });
      } else {
        // Go to main picklist page
        goBack();
      }
    },
  };

  const handlers = {
    onChange: newItemData => {
      const updatedValue = set([PICKLIST_DATA, index], newItemData, data);
      setFormData(updatedValue);
    },
    onSubmit: event => {
      event.preventDefault();
      setFormSubmitted(true);
      setFormData({ ...data, [PICKLIST_PATHS]: getPicklistRoutes(data) });

      pageToRender?.page.handlers.onSubmit({
        event,
        itemData: currentDependent,
        formSubmitted: true,
        goForward: navigation.goForward,
        returnToMainPage,
      });
    },
  };

  return (
    <form onSubmit={handlers.onSubmit}>
      <div className="vads-u-margin-bottom--5">
        <pageToRender.page.Component
          firstName={dependentFirstName}
          formSubmitted={formSubmitted}
          fullName={dependentFullName}
          goBack={navigation.goBack}
          handlers={handlers}
          itemData={currentDependent}
          returnToMainPage={returnToMainPage}
          isEditing={reviewPageFlag}
          isShowingExitLink={isShowingExitLink}
        />
      </div>
      {!canShowExitButton && contentBeforeButtons}
      <div className="row form-progress-buttons schemaform-buttons vads-u-margin-y--3">
        <div className="small-6 medium-5 columns">
          <va-button back full-width onClick={navigation.goBack} />
        </div>
        <div className="small-6 medium-5 end columns">
          {isShowingExitLink ? (
            <ExitForm
              useButton
              formId={VA_FORM_IDS.FORM_21_686CV2}
              text="Exit to your VA dependents"
              href="/manage-dependents/view"
            />
          ) : (
            <va-button continue full-width submit="prevent" />
          )}
        </div>
      </div>
      {!canShowExitButton && contentAfterButtons}
    </form>
  );
};

PicklistRemoveDependentFollowup.propTypes = {
  data: PropTypes.object.isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  goToPath: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  setFormData: PropTypes.func.isRequired,
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
  urlTestingOnly: PropTypes.string,
};

export default PicklistRemoveDependentFollowup;
