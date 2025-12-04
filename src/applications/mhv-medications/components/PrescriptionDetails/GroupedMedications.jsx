import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';
import environment from 'platform/utilities/environment';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { datadogRum } from '@datadog/browser-rum';
import {
  dateFormat,
  displayProviderName,
  fromToNumbs,
  validateIfAvailable,
} from '../../util/helpers';
import LastFilledInfo from '../shared/LastFilledInfo';
import { dataDogActionNames } from '../../util/dataDogConstants';
import { DATETIME_FORMATS } from '../../util/constants';

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
    datadogRum.addAction(dataDogActionNames.detailsPage.REFILLS_PAGINATION);
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
        <h2 className="vads-u-font-size--lg">Previous prescriptions</h2>
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
                  <h3
                    className="vads-u-font-size--md vads-u-font-family--sans"
                    data-dd-privacy="mask"
                  >
                    Prescription number:{' '}
                    <span data-dd-privacy="mask">{rx.prescriptionNumber}</span>
                  </h3>
                </dt>
                <dd className="last-filled-info-grouped-rx">
                  <LastFilledInfo {...rx} />
                </dd>
                <dd data-testid="rx-quantity">
                  {rx.quantity
                    ? `Quantity: ${rx.quantity}`
                    : validateIfAvailable('Quantity')}
                </dd>
                <dd data-testid="ordered-date">
                  Prescribed on{' '}
                  {dateFormat(
                    rx.orderedDate,
                    DATETIME_FORMATS.longMonthDate,
                    'date not available',
                  )}
                </dd>
                <dd data-testid="prescribed-by">
                  {`Prescribed by ${displayProviderName(
                    rx?.providerFirstName,
                    rx?.providerLastName,
                  )}`}
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
