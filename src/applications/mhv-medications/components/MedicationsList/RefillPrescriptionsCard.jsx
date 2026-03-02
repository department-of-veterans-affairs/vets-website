import React from 'react';
import { Link } from 'react-router-dom-v5-compat';
import { medicationsUrls } from '../../util/constants';
import { dataDogActionNames } from '../../util/dataDogConstants';

const RefillPrescriptionsCard = () => (
  <va-card background>
    <div className="vads-u-padding-x--1">
      <h2 className="vads-u-margin--0 vads-u-margin-bottom--2 vads-u-font-size--h3">
        Refill prescriptions
      </h2>
      <Link
        className="vads-c-action-link--green vads-u-margin--0"
        to={medicationsUrls.subdirectories.REFILL}
        data-testid="prescriptions-nav-link-to-refill"
        data-dd-action-name={
          dataDogActionNames.medicationsListPage.START_REFILL_REQUEST
        }
      >
        Start a refill request
      </Link>
    </div>
  </va-card>
);

export default RefillPrescriptionsCard;
