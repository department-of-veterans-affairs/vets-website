import { connect } from 'react-redux';

import NameAndGeneralInfoSection from '../components/personal-information/NameAndGeneralInfoSection';
import { updateField } from '../actions';

function mapStateToProps(state) {
  return {
    data: state.nameAndGeneralInformation,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(updateField(['nameAndGeneralInformation', field], update));
    }
  };
}

const NameAndGeneralInfo = connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(NameAndGeneralInfoSection);

export default NameAndGeneralInfo;
