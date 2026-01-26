import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom-v5-compat';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { dataDogActionNames } from '../../util/dataDogConstants';
import { medicationsUrls } from '../../util/constants';

/**
 * A button that navigates to the refill page with a prescription preselected.
 * Note: dispStatus checks are handled by the parent component (ExtraDetails).
 */
const RefillNavButton = ({ rx }) => {
  const navigate = useNavigate();
  const { prescriptionId, isRefillable } = rx;

  if (!isRefillable) {
    return null;
  }

  const handleClick = () => {
    navigate(
      `${medicationsUrls.subdirectories.REFILL}?refillId=${prescriptionId}`,
    );
  };

  return (
    <VaButton
      secondary
      uswds
      className="vads-u-margin-top--2"
      id={`refill-nav-button-${prescriptionId}`}
      aria-describedby={`card-header-${prescriptionId}`}
      data-dd-action-name={
        dataDogActionNames.medicationsListPage.REQUEST_REFILL_CARD_LINK
      }
      data-testid="refill-nav-button"
      onClick={handleClick}
      text="Request a refill"
    />
  );
};

RefillNavButton.propTypes = {
  rx: PropTypes.shape({
    prescriptionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    isRefillable: PropTypes.bool,
  }).isRequired,
};

export default RefillNavButton;
