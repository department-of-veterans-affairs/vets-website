import React from 'react';
import PropTypes from 'prop-types';
import { dataDogActionNames, pageType } from '../../util/dataDogConstants';

const NeedHelp = page => {
  return (
    <div data-testid="rx-need-help-container">
      <h3 className="vads-u-border-bottom--2px vads-u-border-color--primary vads-u-line-height--5">
        Need help?
      </h3>
      <p>
        Can’t find your self-entered medications? You can still download a copy
        of any self-entered health information.
      </p>
      <va-link
        href="/my-health/medical-records/download?sei=true"
        text="Go to download your self-entered health information"
        data-testid="go-to-self-entered-health-information-link"
        data-dd-action-name={
          page === pageType.LIST
            ? dataDogActionNames.medicationsListPage
                .GO_TO_SELF_ENTERED_HEALTH_INFORMATION_LINK
            : dataDogActionNames.refillPage
                .GO_TO_SELF_ENTERED_HEALTH_INFORMATION_LINK
        }
      />
      <p>Have questions about managing your medications online?</p>
      <va-link
        href="/health-care/refill-track-prescriptions"
        text="Learn more about managing medications online"
        data-testid="go-to-use-medications-link"
        data-dd-action-name={
          page === pageType.LIST
            ? dataDogActionNames.medicationsListPage.GO_TO_USE_MEDICATIONS_LINK
            : dataDogActionNames.refillPage.GO_TO_USE_MEDICATIONS_LINK
        }
      />
      <p>
        Have questions about your medications and supplies? Send a secure
        message to your care team.
      </p>
      <a
        href="/my-health/secure-messages/new-message/"
        rel="noreferrer"
        data-testid="start-a-new-message-link"
        data-dd-action-name={
          page === pageType.LIST
            ? dataDogActionNames.medicationsListPage.COMPOSE_A_MESSAGE_LINK
            : dataDogActionNames.refillPage.COMPOSE_A_MESSAGE_LINK
        }
      >
        Start a new message
      </a>
    </div>
  );
};

NeedHelp.propTypes = {
  page: PropTypes.string.isRequired,
};

export default NeedHelp;
