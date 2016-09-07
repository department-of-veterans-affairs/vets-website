import React from 'react';

import { connect } from 'react-redux';

import PersonalInformationFields from '../../components/veteran-information/PersonalInformationFields';

import { veteranUpdateField } from '../../actions/index';

class PersonalInformationPage extends React.Component {
  render() {
    const { data, onStateChange } = this.props;

    return (
      <div className="form-panel">
        <PersonalInformationFields data={data} onStateChange={onStateChange}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(PersonalInformationPage);
export { PersonalInformationPage };
