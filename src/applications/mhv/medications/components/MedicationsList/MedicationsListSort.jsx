import {
  VaButton,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { rxListSortingOptions } from '../../util/constants';
import { selectRefillContentFlag } from '../../util/selectors';

const MedicationsListSort = props => {
  const { value, sortRxList } = props;
  const history = useHistory();
  const showRefillContent = useSelector(selectRefillContentFlag);
  const [sortListOption, setSortListOption] = useState(value);

  const rxSortingOptions = Object.keys(rxListSortingOptions);
  return (
    <div className="medications-list-sort">
      <div className="vads-u-margin-bottom--0p5">
        <VaSelect
          id="sort-order-dropdown"
          data-testid="sort-dropdown"
          label="Show medications in this order"
          name="sort-order"
          value={sortListOption}
          onVaSelect={e => {
            setSortListOption(e.detail.value);
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
      </div>
      <div className="sort-button">
        {showRefillContent ? (
          <VaButton
            uswds
            className="va-button"
            secondary
            data-testid="sort-button"
            text="Sort"
            onClick={() => {
              if (sortListOption) {
                sortRxList(sortListOption);
                history.push(`/?page=1`);
                waitForRenderThenFocus(
                  "[data-testid='page-total-info']",
                  document,
                  500,
                );
              }
            }}
          />
        ) : (
          <VaButton
            uswds
            className="va-button"
            data-testid="sort-button"
            text="Sort"
            onClick={() => {
              if (sortListOption) {
                sortRxList(sortListOption);
                history.push(`/?page=1`);
                waitForRenderThenFocus(
                  "[data-testid='page-total-info']",
                  document,
                  500,
                );
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

MedicationsListSort.propTypes = {
  sortRxList: PropTypes.func,
  value: PropTypes.string,
};

export default MedicationsListSort;
