import PropTypes from 'prop-types';
import React from 'react';

import FormItem from './FormItem';

class FormList extends React.Component {
  render() {
    const { toggleModal, savedForms: forms } = this.props;
    return (
      <div className="profile-section medium-12 columns">
        <h4 className="section-header">Saved applications</h4>
        {forms.map((form) => <FormItem key={form.form} savedFormData={form} toggleModal={toggleModal}/>)}
      </div>
    );
  }
}

FormList.propTypes = {
  savedForms: PropTypes.array,
  toggleModal: PropTypes.func.isRequired
};

export default FormList;
