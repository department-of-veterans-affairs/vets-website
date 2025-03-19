import React from 'react';
import PropTypes from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const SortRecordList = ({
  selectedSort,
  setSelectedSort,
  showDateEntered = false,
}) => {
  return (
    <>
      {' '}
      <div className="vads-l-row vads-u-align-items--center vads-u-margin-bottom--3">
        <span className="vads-u-margin-top--1 vads-u-margin-right--1">
          Sort
        </span>
        <VaSelect
          value={selectedSort}
          onVaSelect={e => {
            setSelectedSort(e.target.value);
            focusElement(document.querySelector('#showingRecords'));
          }}
        >
          <option value="alphabetically">Alphabetically</option>
          <option value="ascDate">
            {`Newest to oldest${showDateEntered ? ` (date entered)` : ''}`}
          </option>
          <option value="dscDate">
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
