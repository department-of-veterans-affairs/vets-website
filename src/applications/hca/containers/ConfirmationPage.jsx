import React from 'react';
import { useSelector } from 'react-redux';

import { isLoggedIn, selectProfile } from 'platform/user/selectors';
import ConfirmationScreenView from '../components/ConfirmationPage/ConfirmationScreenView';
import ConfirmationPrintView from '../components/ConfirmationPage/ConfirmationPrintView';
import ConfirmationFAQ from '../components/ConfirmationPage/ConfirmationFAQ';
import { normalizeFullName } from '../utils/helpers';

const ConfirmationPage = () => {
  const { submission, data } = useSelector(state => state.form);
  const { userFullName } = useSelector(selectProfile);
  const loggedIn = useSelector(isLoggedIn);
  const { response } = submission;

  // if authenticated, get veteran's name from profile, else, from form data
  const nameToDisplay = loggedIn
    ? userFullName
    : data['view:veteranInformation'].veteranFullName;
  const veteranName = normalizeFullName(nameToDisplay, true);

  return (
    <div className="hca-confirmation-page vads-u-margin-bottom--2p5">
      <section className="hca-confirmation--screen no-print">
        <ConfirmationScreenView
          name={veteranName}
          timestamp={response ? response.timestamp : null}
        />
      </section>

      <section className="hca-confirmation--print">
        <ConfirmationPrintView
          name={veteranName}
          timestamp={response ? response.timestamp : null}
        />
      </section>

      <ConfirmationFAQ />
    </div>
  );
};

export default ConfirmationPage;
