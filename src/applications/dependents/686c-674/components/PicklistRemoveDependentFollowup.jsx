import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { scrollToTop } from 'platform/utilities/scroll';
import { focusElement } from 'platform/utilities/ui';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import set from 'platform/utilities/data/set';
import { getArrayUrlSearchParams } from 'platform/forms-system/src/js/patterns/array-builder/helpers';

import { getFullName } from '../../shared/utils';

import { PICKLIST_DATA, PICKLIST_PATHS } from '../config/constants';
import { routing, getPicklistRoutes } from './picklist/routes';

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

  // Page change state to force scroll & focus on page change
  useEffect(() => {
    scrollToTop();
    focusElement('h3');
  }, []);

  const resetState = () => {
    setFormSubmitted(false);
    scrollToTop();
    focusElement('h3');
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
  const pageToRender = dependentGroup?.[currentPage];

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
        // Find next selected dependent
        const nextSelectedIndex = data[PICKLIST_DATA].findIndex(
          (dep, indx) => indx > index && dep.selected,
        );
        if (nextSelectedIndex === -1) {
          // Done with removing dependents, go to review & submit page
          goForward(data);
        } else {
          // Go to the followup page for the next selected dependent
          goToPath(`remove-dependent?index=${nextSelectedIndex}`, {
            force: true,
          });
        }
      } else {
        goToPath(`remove-dependent?index=${index}&page=${nextPage}`, {
          force: true,
        });
      }
    },

    goBack: () => {
      resetState();
      const selectedIndex = paths.findIndex(
        path => path.index === index && path.path === page,
      );

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
      <pageToRender.page.Component
        firstName={dependentFirstName}
        formSubmitted={formSubmitted}
        fullName={dependentFullName}
        goBack={navigation.goBack}
        handlers={handlers}
        itemData={currentDependent}
      />
      {contentBeforeButtons}
      <FormNavButtons goBack={navigation.goBack} submitToContinue />
      {contentAfterButtons}
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
