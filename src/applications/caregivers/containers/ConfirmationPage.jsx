import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import ConfirmationScreenView from '../components/ConfirmationPage/ConfirmationScreenView';
import ConfirmationPrintView from '../components/ConfirmationPage/ConfirmationPrintView';
import ConfirmationFAQ from '../components/ConfirmationPage/ConfirmationFAQ';

const ConfirmationPage = ({ route }) => {
  const { timestamp, veteranName } = useSelector(state => ({
    timestamp: state.form.submission?.response?.timestamp,
    veteranName: state.form.data.veteranFullName,
  }));

  return (
    <div className="caregiver-confirmation vads-u-margin-bottom--2p5">
      <section className="caregiver-confirmation--screen no-print">
        <ConfirmationScreenView
          name={veteranName}
          timestamp={timestamp}
          route={route}
        />
      </section>

      <section className="caregiver-confirmation--print">
        <ConfirmationPrintView name={veteranName} timestamp={timestamp} />
      </section>

      <ConfirmationFAQ />

      <a
        className="vads-c-action-link--green vads-u-margin-y--4 no-print"
        href="https://www.va.gov"
      >
        Go back to VA.gov
      </a>
    </div>
  );
};

ConfirmationPage.propTypes = {
  route: PropTypes.object,
};

export default ConfirmationPage;
