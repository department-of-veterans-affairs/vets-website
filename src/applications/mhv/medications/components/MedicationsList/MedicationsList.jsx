import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { chunk } from 'lodash';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import MedicationsListCard from './MedicationsListCard';

const MAX_PAGE_LIST_LENGTH = 5;
const perPage = 20;
const MedicationsList = props => {
  const { rxList } = props;

  const [currentRx, setCurrentRx] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const paginatedRx = useRef([]);

  const paginateData = data => {
    return chunk(data, perPage);
  };

  const onPageChange = page => {
    setCurrentRx(paginatedRx.current[page - 1]);
    setCurrentPage(page);
  };

  const fromToNumbs = (page, total) => {
    const from = (page - 1) * perPage + 1;
    const to = Math.min(page * perPage, total);
    return [from, to];
  };

  useEffect(
    () => {
      if (rxList?.length) {
        paginatedRx.current = paginateData(rxList);
        setCurrentRx(paginatedRx.current[currentPage - 1]);
      }
    },
    [currentPage, rxList],
  );

  const displayNums = fromToNumbs(currentPage, rxList?.length);

  return (
    <>
      <h2 className="rx-page-total-info no-print vads-u-font-family--sans">
        Showing {displayNums[0]} - {displayNums[1]} of {rxList.length}{' '}
        medications
      </h2>
      <div className="rx-page-total-info vads-u-border-bottom--2px vads-u-border-color--gray-lighter no-print" />
      <div className="vads-l-row vads-u-flex-direction--column no-print">
        {rxList?.length > 0 &&
          currentRx.map((rx, idx) => <MedicationsListCard key={idx} rx={rx} />)}
      </div>
      <div className="print-only">
        {rxList.length > 0 &&
          rxList.map((rx, idx) => <MedicationsListCard key={idx} rx={rx} />)}
      </div>
      <VaPagination
        id="pagination"
        className="pagination no-print"
        onPageSelect={e => onPageChange(e.detail.page)}
        page={currentPage}
        pages={paginatedRx.current.length}
        maxPageListLength={MAX_PAGE_LIST_LENGTH}
        showLastPage
      />
    </>
  );
};

export default MedicationsList;

MedicationsList.propTypes = {
  rxList: PropTypes.array,
};
