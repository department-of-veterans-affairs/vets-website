import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { EMPTY_FIELD } from '../../util/constants';
import { dateFormat, fromToNumbs } from '../../util/helpers';
import LastFilledInfo from '../shared/LastFilledInfo';

const MAX_PAGE_LIST_LENGTH = 2;
const MAX_GROUPED_LIST_LENGTH = 26;

const GroupedMedications = props => {
  const { groupedMedicationsList } = props;

  const truncatedGroupedMedicationsList = groupedMedicationsList?.slice(
    0,
    MAX_GROUPED_LIST_LENGTH,
  );
  const totalListCount = truncatedGroupedMedicationsList?.length;
  const [currentGroupedList, setCurrentGroupedList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(
    () => {
      const indexOfLastItem = currentPage * MAX_PAGE_LIST_LENGTH;
      const indexOfFirstItem = indexOfLastItem - MAX_PAGE_LIST_LENGTH;
      const currentItems = truncatedGroupedMedicationsList?.slice(
        indexOfFirstItem,
        indexOfLastItem,
      );
      setCurrentGroupedList(currentItems);
    },
    [currentPage, groupedMedicationsList],
  );

  const onPageChange = page => {
    setCurrentPage(page);
    waitForRenderThenFocus('#list-showing-info', document);
  };

  const displayNums = fromToNumbs(
    currentPage,
    totalListCount,
    currentGroupedList?.length,
    MAX_PAGE_LIST_LENGTH,
  );

  const fromNumtoNumsContent = () => {
    switch (true) {
      case totalListCount === 1:
        return `Showing ${totalListCount} prescription`;
      case totalListCount <= MAX_PAGE_LIST_LENGTH:
        return `Showing ${totalListCount} prescriptions, from newest to oldest`;
      default:
        return `Showing ${displayNums[0]} to ${
          displayNums[1]
        } of ${totalListCount} prescriptions, from newest to oldest`;
    }
  };

  return (
    <div className="vads-u-border-top--1px vads-u-border-color--gray-lighter vads-u-margin-bottom--3 vads-u-margin-top--3">
      <section className="vads-u-margin-y--3" data-testid="previous-rx">
        <h3>Previous prescriptions</h3>
        <p
          className="vads-u-font-family--sans"
          id="list-showing-info"
          data-testid="grouping-showing-info"
        >
          {fromNumtoNumsContent()}
        </p>
      </section>
      <section>
        {currentGroupedList &&
          currentGroupedList.map(rx => {
            return (
              <dl
                className="vads-u-border-top--1px vads-u-border-color--gray-lighter vads-u-margin-top--3"
                key={rx.prescriptionId}
              >
                <dt className="vads-u-margin-top--3">
                  <h4>Prescription number: {rx.prescriptionNumber}</h4>
                </dt>
                <dd className="last-filled-info-grouped-rx">
                  <LastFilledInfo {...rx} />
                </dd>
                <dd>Quantity: {rx.quantity}</dd>
                <dd>
                  Prescribed on: {dateFormat(rx.orderedDate, 'MMMM D, YYYY')}
                </dd>
                <dd>
                  Prescribed by:{' '}
                  {(rx.providerFirstName && rx.providerLastName) || EMPTY_FIELD}
                </dd>
              </dl>
            );
          })}
        {totalListCount > MAX_PAGE_LIST_LENGTH && (
          <VaPagination
            onPageSelect={e => onPageChange(e.detail.page)}
            max-page-list-length={3}
            className="vads-u-justify-content--center no-print vads-u-margin-top--3"
            page={currentPage}
            pages={Math.ceil(totalListCount / MAX_PAGE_LIST_LENGTH)}
            uswds
          />
        )}
      </section>
    </div>
  );
};

GroupedMedications.propTypes = {
  groupedMedicationsList: PropTypes.array,
};

export default GroupedMedications;
