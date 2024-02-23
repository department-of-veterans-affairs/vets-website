import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { acceptPOARequest, declinePOARequest } from '../../actions/poaRequests';

const POARequestsContent = ({ poaRequests }) => {
  const [alert, setAlert] = useState({
    visible: false,
    message: '',
    status: '',
    headline: '',
  });

  const handleCloseAlert = () => {
    setAlert(prevState => ({ ...prevState, visible: false }));
  };

  const updateAlertBasedOnResult = (result, name, action) => {
    const demoResult = result;
    demoResult.status = 'success';

    if (demoResult.status === 'success') {
      setAlert({
        visible: true,
        message: `You have successfully ${
          action === 'accept' ? 'accepted' : 'declined'
        } ${name}'s POA request`,
        status: 'success',
        headline: 'Success',
      });
    } else {
      setAlert({
        visible: true,
        message: `There was an error in ${
          action === 'accept' ? 'accepting' : 'declining'
        } ${name}'s POA request. Please try again.`,
        status: 'error',
        headline: 'Error',
      });
    }
  };

  const handlePOARequest = async (veteranId, name, action) => {
    const result =
      action === 'accept'
        ? await acceptPOARequest(veteranId)
        : await declinePOARequest(veteranId);
    updateAlertBasedOnResult(result, name, action);
  };

  return (
    <>
      <va-table sort-column={1}>
        <va-table-row slot="headers">
          <span>Claimant</span>
          <span>Submitted</span>
          <span>Description</span>
          <span>Status</span>
          <span>Actions</span>
        </va-table-row>
        {poaRequests.map(poaRequest => (
          <va-table-row key={poaRequest.id}>
            <span>{poaRequest.name}</span>
            <span>{poaRequest.date}</span>
            <span>{poaRequest.description}</span>
            <span>{poaRequest.status}</span>
            <span>
              {poaRequest.status === 'Pending' && (
                <>
                  <va-button
                    secondary
                    text="Accept"
                    onClick={() =>
                      handlePOARequest(poaRequest.id, poaRequest.name, 'accept')
                    }
                  />
                  <va-button
                    secondary
                    text="Decline"
                    onClick={() =>
                      handlePOARequest(
                        poaRequest.id,
                        poaRequest.name,
                        'decline',
                      )
                    }
                  />
                </>
              )}
            </span>
          </va-table-row>
        ))}
      </va-table>
      {alert.visible && (
        <VaAlert
          class="toast-alert"
          closeBtnAriaLabel={`Close ${alert.status} alert`}
          closeable
          onCloseEvent={handleCloseAlert}
          status={alert.status}
          uswds
          visible
        >
          <h2 id="alert-headline" slot="headline">
            {alert.headline}
          </h2>
          <p className="vads-u-margin-y--0">{alert.message}</p>
        </VaAlert>
      )}
    </>
  );
};

POARequestsContent.propTypes = {
  poaRequests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      date: PropTypes.string,
      description: PropTypes.string,
      status: PropTypes.string,
    }),
  ).isRequired,
};

export default POARequestsContent;
