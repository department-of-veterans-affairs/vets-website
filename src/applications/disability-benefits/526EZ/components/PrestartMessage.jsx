import React from 'react';
import { connect } from 'react-redux';

import { PrestartAlert } from '../helpers';

const messageWrapper = ({ formContext, prestartStatus, prestartData, displayPrestartMessage, savedForms }) => {
  const hasSavedForms = savedForms.length > 0;
  if (!displayPrestartMessage || (formContext && formContext.reviewMode)) {
    return null;
  }
  return (
    <PrestartAlert status={prestartStatus} data={prestartData} hasSavedForms={hasSavedForms}/>
  );
};

const mapStateToProps = state => {
  return {
    prestartStatus: state.prestart.status,
    prestartData: state.prestart.data,
    displayPrestartMessage: state.prestart.display,
    savedForms: state.user.profile.savedForms
  };
};

const PrefillMessage = connect(
  mapStateToProps
)(messageWrapper);

export default PrefillMessage;
