import React from 'react';
import PropTypes from 'prop-types';

import AutoComplete from './AutoComplete';

const AutoCompleteWrapper = props => (
  <AutoComplete
    availableResults={props.uiSchema['ui:options'].disabilityLabels}
    debounceTime={props.uiSchema['ui:options'].debounceTime}
    label={props.uiSchema['ui:title']}
    formData={props.formData}
    onChange={props.onChange}
  />
);

AutoCompleteWrapper.propTypes = {
  formData: PropTypes.string,
  idSchema: PropTypes.object,
  uiSchema: PropTypes.object,
  onChange: PropTypes.func,
};

export default AutoCompleteWrapper;
