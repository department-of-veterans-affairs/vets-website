import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FormButtons from '../components/express-care/FormButtons';

import { routeToNextAppointmentPage } from '../actions/expressCare';

function ExpressCareInfo() {
  return (
    <div>
      <h1>How Express Care Works</h1>
      <FormButtons
        backButtonText="Cancel"
        nextButtonText="Continue with Express Care request"
      />
    </div>
  );
}
const mapDispatchToProps = {
  routeToNextAppointmentPage,
};

export default connect(
  null,
  mapDispatchToProps,
)(ExpressCareInfo);
