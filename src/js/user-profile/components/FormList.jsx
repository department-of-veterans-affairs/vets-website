import PropTypes from 'prop-types';
import React from 'react';

import FormItem from './FormItem';

class FormList extends React.Component {
  render() {
    const handleClick = this.props.handleClick;
    const forms = this.props.savedForms;
    return (
      <ul>{forms.map((form, index) =>  <FormItem key={index} savedFormData={form} handleClick={handleClick}/>)}</ul>
    );
  }
}

FormList.propTypes = {
  savedForms: PropTypes.array,
  handleClick: PropTypes.func.isRequired
};

export default FormList;
