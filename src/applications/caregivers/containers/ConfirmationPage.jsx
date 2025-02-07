/* eslint-disable import/no-cycle */
import React from 'react';
import { useSelector } from 'react-redux';
import ConfirmationScreenView from '../components/ConfirmationPage/ConfirmationScreenView';
import ConfirmationPrintView from '../components/ConfirmationPage/ConfirmationPrintView';
import ConfirmationFAQ from '../components/ConfirmationPage/ConfirmationFAQ';

const ConfirmationPage = () => {
  const { submission, data } = useSelector(state => state.form);
  const { response, timestamp } = submission;
  const name = data.veteranFullName;

  return (
    <div className="caregiver-confirmation vads-u-margin-bottom--2p5">
      <section className="caregiver-confirmation--screen no-print">
        <ConfirmationScreenView
          name={name}
          timestamp={response ? timestamp : null}
        />
      </section>

      <section className="caregiver-confirmation--print">
        <ConfirmationPrintView
          name={name}
          timestamp={response ? timestamp : null}
        />
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

export default ConfirmationPage;
