import React from 'react';
import { useSelector } from 'react-redux';
import { isLoggedIn, selectProfile } from 'platform/user/selectors';
import ConfirmationScreenView from '../components/ConfirmationPage/ConfirmationScreenView';
import ConfirmationPrintView from '../components/ConfirmationPage/ConfirmationPrintView';
import ConfirmationFAQ from '../components/ConfirmationPage/ConfirmationFAQ';
import { normalizeFullName } from '../utils/helpers';

const ConfirmationPage = () => {
  const { timestamp, veteranName } = useSelector(state => {
    const { userFullName } = selectProfile(state);
    const { veteranFullName } = state.form.data['view:veteranInformation'];
    const nameToDisplay = isLoggedIn(state) ? userFullName : veteranFullName;
    return {
      timestamp: state.form.submission?.response?.timestamp,
      veteranName: normalizeFullName(nameToDisplay, true),
    };
  });

  return (
    <div className="hca-confirmation-page vads-u-margin-bottom--2p5">
      <section className="hca-confirmation--screen no-print">
        <ConfirmationScreenView name={veteranName} timestamp={timestamp} />
      </section>

      <section className="hca-confirmation--print">
        <ConfirmationPrintView name={veteranName} timestamp={timestamp} />
      </section>

      <ConfirmationFAQ />

      <div className="vads-u-margin-y--4 no-print">
        <a href="https://www.va.gov" className="vads-c-action-link--green">
          Go back to VA.gov
        </a>
      </div>
    </div>
  );
};

export default ConfirmationPage;
