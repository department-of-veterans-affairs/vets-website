import React from 'react';
import PropTypes from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { SortTypes } from '../../util/constants';

const SortRecordList = ({
  selectedSort,
  setSelectedSort,
  showDateEntered = false,
}) => {
  return (
    <>
      <div className="vads-l-row vads-u-align-items--center vads-u-margin-bottom--3 no-print">
        <span className="vads-u-margin-top--1 vads-u-margin-right--1">
          Sort
        </span>
        <VaSelect
          data-testid="mr-sort-selector"
          value={selectedSort}
          onVaSelect={e => {
            setSelectedSort(e.target.value);
            focusElement(document.querySelector('#showingRecords'));
          }}
        >
          <option value={SortTypes.ALPHABETICAL.value}>Alphabetically</option>
          <option value={SortTypes.ASC_DATE.value}>
            {`Newest to oldest${showDateEntered ? ` (date entered)` : ''}`}
          </option>
          <option value={SortTypes.DSC_DATE.value}>
            {`Oldest to newest${showDateEntered ? ` (date entered)` : ''}`}
          </option>
        </VaSelect>
      </div>
    </>
  );
};

export default SortRecordList;

SortRecordList.propTypes = {
  selectedSort: PropTypes.string,
  setSelectedSort: PropTypes.func,
  showDateEntered: PropTypes.bool,
};
