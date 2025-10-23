import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React from 'react';
import PropTypes from 'prop-types';
import {
  focusElement,
  waitForRenderThenFocus,
} from '@department-of-veterans-affairs/platform-utilities/ui';
import { useNavigate } from 'react-router-dom-v5-compat';
import { datadogRum } from '@datadog/browser-rum';
import { useSelector } from 'react-redux';
import { rxListSortingOptions } from '../../util/constants';
import { dataDogActionNames, pageType } from '../../util/dataDogConstants';
import { selectSortOption } from '../../selectors/selectPreferences';

const MedicationsListSort = props => {
  const { shouldShowSelect, sortRxList } = props;
  const navigate = useNavigate();

  const selectedSortOption = useSelector(selectSortOption);

  const rxSortingOptions = Object.keys(rxListSortingOptions);

  return (
    <div className="medications-list-sort">
      <div className="vads-u-margin-bottom--0p5">
        {shouldShowSelect && (
          <VaSelect
            id="sort-order-dropdown"
            data-testid="sort-dropdown"
            label="Show medications in this order"
            name="sort-order"
            data-dd-action-name={
              dataDogActionNames.medicationsListPage
                .SHOW_MEDICATIONS_IN_ORDER_SELECT
            }
            value={selectedSortOption}
            onVaSelect={e => {
              const newSortOption = e.detail.value;

              /**
               * Workaround for changing page focus overriding the aria-live messaging
               * when sort element disappears. Just move the focus to an sr-only element
               * with the correct message.
               *
               * The VASelect element with focus on selection is not rendered while the page is loading,
               * so the change in focus results in aria-live messages being overwritten.
               */
              const sortActionSrText = document.querySelector(
                "[data-testid='sort-action-sr-text']",
              );
              sortActionSrText.textContent = `Sorting: ${
                rxListSortingOptions[newSortOption].LABEL
              }`;
              focusElement(sortActionSrText);

              sortRxList(null, newSortOption);
              navigate(`/?page=1`, {
                replace: true,
              });
              waitForRenderThenFocus(
                "[data-testid='page-total-info']",
                document,
                500,
              );
              const capitalizedOption = newSortOption
                .replace(/([a-z])([A-Z])/g, '$1 $2')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
              datadogRum.addAction(
                `${capitalizedOption} Option - ${pageType.LIST}`,
              );
            }}
            uswds
          >
            {rxSortingOptions.map(option => {
              return (
                <option key={option} value={option} data-testid="sort-option">
                  {rxListSortingOptions[option].LABEL}
                </option>
              );
            })}
          </VaSelect>
        )}
        <div
          className="sr-only"
          data-testid="sort-action-sr-text"
          role="status"
        />
      </div>
    </div>
  );
};

MedicationsListSort.propTypes = {
  shouldShowSelect: PropTypes.bool,
  sortRxList: PropTypes.func,
};

export default MedicationsListSort;
