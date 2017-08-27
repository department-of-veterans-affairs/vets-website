import PropTypes from 'prop-types';
import React from 'react';

import FormItem from './FormItem';

class FormList extends React.Component {
  render() {
    const handleClick = this.props.handleClick;
    const forms = this.props.savedForms;
    return (
      <div>
        <h4 className="section-header">Saved applications</h4>
        {forms.map((form, index) =>  <FormItem key={index} savedFormData={form} handleClick={handleClick}/>)}
      </div>
    );
  }
}

FormList.propTypes = {
  savedForms: PropTypes.array,
  handleClick: PropTypes.func.isRequired
};

export default FormList;
