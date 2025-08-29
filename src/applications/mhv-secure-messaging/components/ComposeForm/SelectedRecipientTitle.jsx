import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Paths } from '../../util/constants';

const SelectedRecipientTitle = props => {
  const { draftInProgress } = props;

  // Handle cases where draftInProgress is undefined or null
  const careSystemName = draftInProgress?.careSystemName || '';
  const recipientName = draftInProgress?.recipientName || '';

  return (
    <div className="vads-u-margin-top--3">
      <p className="vads-u-margin-bottom--0">To</p>
      <p
        className="vads-u-font-weight--bold vads-u-margin-y--0"
        data-testid="compose-recipient-title"
        data-dd-privacy="mask"
        data-dd-action-name="Care System - Team recipient title"
      >
        {careSystemName} - {recipientName}
      </p>
      <Link
        to={`${Paths.COMPOSE}${Paths.SELECT_CARE_TEAM}`}
        data-dd-action-name="Select a different care team link"
      >
        Select a different care team
      </Link>
    </div>
  );
};

SelectedRecipientTitle.propTypes = {
  draftInProgress: PropTypes.object,
};

export default SelectedRecipientTitle;
