import React from 'react';

import { connect } from 'react-redux';

import PersonalInformationFields from '../../components/veteran-information/PersonalInformationFields';

import { veteranUpdateField } from '../../actions/index';

class PersonalInformationPage extends React.Component {
  render() {
    const { section, data, onStateChange } = this.props;

    return (
      <div className="form-panel">
        <PersonalInformationFields data={data} section={section} onStateChange={onStateChange}/>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    data: state.veteran,
    section: state.uiState.sections[ownProps.location.pathname],
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
