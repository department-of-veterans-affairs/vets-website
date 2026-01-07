import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ItemList from '../shared/ItemList';
import { sendDataDogAction } from '../../util/helpers';

const AllergyListItem = ({ record }) => (
  <va-card
    background
    class="record-list-item vads-u-padding-y--2p5 vads-u-margin-bottom--2p5 vads-u-padding-x--3 left-align-print margin-zero-print"
    data-testid="record-list-item"
  >
    {/* web view header */}
    <div className="vads-u-font-weight--bold vads-u-margin-bottom--0p5">
      <Link
        to={`/allergies/${record.id}`}
        data-dd-privacy="mask"
        data-dd-action-name="[allergy list - name Link]"
        data-testid={`allergy-link-${record.id}`}
        className="no-print"
        onClick={() => {
          sendDataDogAction('Allergies Detail Link');
        }}
      >
        {record.name}{' '}
        <span
          className="sr-only"
          data-dd-privacy="mask"
          data-dd-action-name="[allergy list - date]"
        >
          {`on ${record.date}`}
        </span>
      </Link>
    </div>

    {/* print view header */}
    <h2
      className="print-only vads-u-margin-bottom--1 vads-u-margin-top--0"
      aria-hidden="true"
      data-dd-privacy="mask"
      data-dd-action-name="[allergy list - name - Print]"
    >
      {record.name}
    </h2>

    {/* web view fields */}
    <div className="no-print">
      <span className="vads-u-display--inline-block">Date entered:</span>{' '}
      <span
        className="vads-u-display--inline-block"
        data-dd-privacy="mask"
        data-dd-action-name="[allergy list - date]"
      >
        {record.date}
      </span>
    </div>

    {/* print view fields */}
    <div className="print-only print-indent" data-dd-action-name>
      <span className="vads-u-display--inline-block vads-u-font-weight--bold">
        Date entered:
      </span>{' '}
      <span
        className="vads-u-display--inline-block"
        data-dd-privacy="mask"
        data-dd-action-name="[allergy list - date - Print]"
      >
        {record.date}
      </span>
    </div>
    <div className="print-only print-indent">
      <span className="vads-u-display--inline-block vads-u-font-weight--bold">
        Signs and symptoms:
      </span>{' '}
      <ItemList list={record.reaction} />
    </div>
    <div className="print-only print-indent">
      <span className="vads-u-display--inline-block vads-u-font-weight--bold">
        Type of allergy:
      </span>{' '}
      <span
        className="vads-u-display--inline-block"
        data-dd-privacy="mask"
        data-dd-action-name="[allergy list - type - Print]"
      >
        {record.type}
      </span>
    </div>
    {!record.isOracleHealthData && (
      <div className="print-only print-indent">
        <span className="vads-u-display--inline-block vads-u-font-weight--bold">
          Location:
        </span>{' '}
        <span
          className="vads-u-display--inline-block"
          data-dd-privacy="mask"
          data-dd-action-name="[allergy list - location - Print]"
        >
          {record.location}
        </span>
      </div>
    )}
    {!record.isOracleHealthData && (
      <div className="print-only print-indent">
        <span className="vads-u-display--inline-block vads-u-font-weight--bold">
          Observed or historical:
        </span>{' '}
        <span
          className="vads-u-display--inline-block"
          data-dd-privacy="mask"
          data-dd-action-name="[allergy list - observed - Print]"
        >
          {record.observedOrReported}
        </span>
      </div>
    )}
    {record.isOracleHealthData && (
      <div className="print-only print-indent">
        <span className="vads-u-display--inline-block vads-u-font-weight--bold">
          Recorded by:
        </span>{' '}
        <span
          className="vads-u-display--inline-block"
          data-dd-privacy="mask"
          style={{ whiteSpace: 'pre-line' }}
          data-dd-action-name="[allergy list - provider - Print]"
        >
          {record.provider}
        </span>
      </div>
    )}
    <div className="print-only print-indent">
      <span className="vads-u-display--inline-block vads-u-font-weight--bold">
        Provider notes:
      </span>{' '}
      <span
        className="vads-u-display--inline-block"
        data-dd-privacy="mask"
        style={{ whiteSpace: 'pre-line' }}
        data-dd-action-name="[allergy list - notes - Print]"
      >
        {record.notes}
      </span>
    </div>
  </va-card>
);

AllergyListItem.propTypes = {
  record: PropTypes.object,
};

export default AllergyListItem;
