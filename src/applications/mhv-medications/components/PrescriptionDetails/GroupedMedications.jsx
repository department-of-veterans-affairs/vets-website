import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';
import environment from 'platform/utilities/environment';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { datadogRum } from '@datadog/browser-rum';
import { EMPTY_FIELD } from '../../util/constants';
import { dateFormat, fromToNumbs } from '../../util/helpers';
import LastFilledInfo from '../shared/LastFilledInfo';
import { dataDogActionNames } from '../../util/dataDogConstants';

const MAX_PAGE_LIST_LENGTH = environment.isStaging() ? 2 : 10;
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
    datadogRum.addAction(dataDogActionNames.detailsPage.GROUPING_PAGINATION);
    setCurrentPage(page);
    waitForRenderThenFocus('#list-showing-info', document);
  };

  const displayNums = fromToNumbs(
    currentPage,
    totalListCount,
    currentGroupedList?.length,
    MAX_PAGE_LIST_LENGTH,
  );

  return (
    <div className="vads-u-border-top--1px vads-u-border-color--gray-lighter vads-u-margin-bottom--3 vads-u-margin-top--3">
      <section className="vads-u-margin-y--3" data-testid="previous-rx">
        <h3>Previous prescriptions</h3>
        <p
          className="vads-u-font-family--sans"
          id="list-showing-info"
          data-testid="grouping-showing-info"
        >
          {totalListCount === 1
            ? `Showing ${totalListCount} prescription`
            : `Showing ${displayNums[0]} to ${
                displayNums[1]
              } of ${totalListCount} prescriptions, from newest to oldest`}
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
                <dt className="vads-u-margin-top--3" data-dd-privacy="mask">
                  <h4>Prescription number: {rx.prescriptionNumber}</h4>
                </dt>
                <dd className="last-filled-info-grouped-rx">
                  <LastFilledInfo {...rx} />
                </dd>
                <dd>Quantity: {rx.quantity}</dd>
                <dd>
                  Prescribed on {dateFormat(rx.orderedDate, 'MMMM D, YYYY')}
                </dd>
                <dd>
                  Prescribed by{' '}
                  {(rx.providerFirstName && rx.providerLastName) || EMPTY_FIELD}
                </dd>
              </dl>
            );
          })}
        {totalListCount > MAX_PAGE_LIST_LENGTH && (
          <VaPagination
            onPageSelect={e => onPageChange(e.detail.page)}
            max-page-list-length={MAX_PAGE_LIST_LENGTH}
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
