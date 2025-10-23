import React from 'react';
import PropTypes from 'prop-types';

import ProgressButton from '../../components/ProgressButton';

export default function Back(props) {
  const { onButtonClick, useWebComponents } = props;

  return (
    <>
      <ProgressButton
        onButtonClick={onButtonClick}
        buttonText="Back"
        buttonClass="usa-button-secondary"
        beforeText="«"
        useWebComponents={useWebComponents}
      />
    </>
  );
}

Back.propTypes = {
  onButtonClick: PropTypes.func.isRequired,
  useWebComponents: PropTypes.bool,
};
