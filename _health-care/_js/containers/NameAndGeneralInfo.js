import { connect } from 'react-redux';

import NameAndGeneralInfoSection from '../components/personal-information/NameAndGeneralInfoSection';
import { updateField } from '../actions';

function mapStateToProps(state) {
  console.log(state);
  return {
    data: state.nameAndGeneralInformation,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(updateField(field, update));
    }
  };
}

const NameAndGeneralInfo = connect(mapStateToProps, mapDispatchToProps)(NameAndGeneralInfoSection);

export default NameAndGeneralInfo;
