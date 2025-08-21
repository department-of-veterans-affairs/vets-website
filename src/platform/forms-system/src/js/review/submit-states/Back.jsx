import React from 'react';
import ProgressButton from '../../components/ProgressButton';

export default function Back(props) {
  const { onButtonClick } = props;

  return (
    <>
      <ProgressButton
        onButtonClick={onButtonClick}
        buttonText="Back"
        buttonClass="usa-button-secondary"
        beforeText="«"
      />
    </>
  );
}
