import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const VeteranInfoBox = ({
  first,
  middle,
  last,
  dateOfBirth,
  ssnLastFour,
  fileNumber,
}) => {
  const veteranFullName = [first, middle, last]
    .filter(name => !!name)
    .join(' ')
    .toUpperCase();

  return (
    <div>
      <p>This is the personal information we have on file for you.</p>
      <div className="vads-u-border-left--7px vads-u-border-color--primary">
        <div className="vads-u-padding-left--1">
          <p className="vads-u-margin--1px">
            <strong>{veteranFullName}</strong>
          </p>
          <p className="vads-u-margin--1px">
            Last 4 of Social Security number: {ssnLastFour}
          </p>
          <p className="vads-u-margin--1px">VA File number: {fileNumber}</p>
          <p className="vads-u-margin--1px">
            Date of birth:
            <span className="vads-u-margin-left--0p5">
              {moment(dateOfBirth, 'YYYY-MM-DD').format('DD/MM/YYYY')}
            </span>
          </p>
        </div>
      </div>
      <p>
        <strong>Note: </strong>
        If you need to update your personal information, call our VA benefits
        hotline at <va-telephone contact={CONTACTS.VA_BENEFITS} uswds /> (
        <va-telephone contact={CONTACTS[711]} tty uswds />
        ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
    </div>
  );
};

VeteranInfoBox.propTypes = {
  dateOfBirth: PropTypes.string,
  fileNumber: PropTypes.string,
  first: PropTypes.string,
  last: PropTypes.string,
  middle: PropTypes.string,
  ssnLastFour: PropTypes.string,
};

const mapStateToProps = ({ form }) => ({
  first: form?.data?.personalData?.veteranFullName?.first,
  middle: form?.data?.personalData?.veteranFullName?.middle,
  last: form?.data?.personalData?.veteranFullName?.last,
  dateOfBirth: form?.data?.personalData?.dateOfBirth,
  ssnLastFour: form?.data?.personalIdentification?.ssn,
  fileNumber: form?.data?.personalIdentification?.fileNumber,
});

export default connect(
  mapStateToProps,
  null,
)(VeteranInfoBox);
