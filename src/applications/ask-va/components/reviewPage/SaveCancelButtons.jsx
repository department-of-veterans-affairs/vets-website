import React from 'react';
import PropTypes from 'prop-types';

import ProgressButton from '@department-of-veterans-affairs/platform-forms-system/ProgressButton';

const SaveCancelButtons = ({ closeSection, keys, title, scroll }) => {
  return (
    <div className="vads-u-display--flex vads-u-max-width--100 vads-u-padding-y--1p5 vads-u-padding-x--2p5">
      <ProgressButton
        submitButton
        onButtonClick={() => {
          closeSection(keys, title);
          scroll(`chapter${title}ScrollElement`);
        }}
        buttonText="Save"
        buttonClass="usa-button-primary vads-u-width--auto"
        ariaLabel={`Save ${title}`}
      />
      <button
        aria-label="Cancel"
        type="button"
        id="cancel"
        className="usa-button-secondary vads-u-width--auto"
        onClick={() => closeSection(keys, title)}
      >
        Cancel
      </button>
    </div>
  );
};

SaveCancelButtons.propTypes = {
  closeSection: PropTypes.func,
  keys: PropTypes.array,
  scroll: PropTypes.func,
  title: PropTypes.string,
};

export default SaveCancelButtons;
