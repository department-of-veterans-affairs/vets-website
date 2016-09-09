import React from 'react';

import { connect } from 'react-redux';

import ContactInformationFields from '../../components/veteran-information/ContactInformationFields';

import { veteranUpdateField } from '../../actions/index';

class ContactInformationPage extends React.Component {
  render() {
    const { data, onStateChange } = this.props;

    return (
      <div className="form-panel">
        <ContactInformationFields data={data} onStateChange={onStateChange}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.veteran
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange(field, update) {
      dispatch(veteranUpdateField(field, update));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactInformationPage);
export { ContactInformationPage };
