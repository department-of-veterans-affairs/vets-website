import React from 'react';
import PropTypes from 'prop-types';

import * as VAP_SERVICE from '@@vap-svc/constants';

import ProfileFormContainerVAFSC from './ProfileFormContainerVAFSC';
import HomePhone from './contact-information/phone-numbers/vafsc/HomePhone';

export const ProfileInformationEditViewVAFSC = props => {
  return (
    <>
      <ProfileFormContainerVAFSC {...props}>
        <HomePhone name="inputPhoneNumber" {...props} />
      </ProfileFormContainerVAFSC>
    </>
  );
};

ProfileInformationEditViewVAFSC.propTypes = {
  apiRoute: PropTypes.oneOf(Object.values(VAP_SERVICE.API_ROUTES)).isRequired,
  convertCleanDataToPayload: PropTypes.func.isRequired,
  fieldName: PropTypes.oneOf(Object.values(VAP_SERVICE.FIELD_NAMES)).isRequired,
  formSchema: PropTypes.object.isRequired,
  getInitialFormValues: PropTypes.func.isRequired,
  uiSchema: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  title: PropTypes.string,
};

export default ProfileInformationEditViewVAFSC;
