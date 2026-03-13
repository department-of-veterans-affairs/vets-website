import React from 'react';
import PropTypes from 'prop-types';

import ProgressButton from '@department-of-veterans-affairs/platform-forms-system/ProgressButton';

const UpdatePageButton = ({ closeSection, keys, scroll, title }) => {
  return (
    <ProgressButton
      ariaLabel={`Update ${title}`}
      buttonClass="vads-u-padding-top--3"
      buttonText="Update page"
      onButtonClick={() => {
        closeSection(keys, title);
        scroll();
      }}
      submitButton
      useWebComponents
    />
  );
};

UpdatePageButton.propTypes = {
  closeSection: PropTypes.func,
  keys: PropTypes.array,
  scroll: PropTypes.func,
  title: PropTypes.string,
};

export default UpdatePageButton;
