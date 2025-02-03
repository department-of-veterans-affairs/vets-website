import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Autosuggest from '../../components/Autosuggest';

export default function AutosuggestTestComponent({ keepDataOnBlur = false }) {
  const [iv, setIv] = useState('beginning input');
  const handleInputChange = e => {
    setIv(e.inputValue);
  };

  return (
    <Autosuggest
      inputId="any"
      inputValue={iv}
      onInputValueChange={handleInputChange}
      handleOnSelect={() => {}}
      label={<div>any label</div>}
      options={[]}
      onClearClick={() => {}}
      keepDataOnBlur={keepDataOnBlur}
    />
  );
}

AutosuggestTestComponent.propTypes = {
  keepDataOnBlur: PropTypes.bool,
};
