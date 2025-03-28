import React from 'react';
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
        ariaLabel={`Update ${title}`}
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

export default SaveCancelButtons;
