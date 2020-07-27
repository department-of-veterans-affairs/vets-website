import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FormButtons from '../components/express-care/FormButtons';

import {
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../actions/expressCare';

const pageKey = 'info';

class ExpressCareInfo extends React.Component {
  goBack = () => {
    this.props.routeToPreviousAppointmentPage(this.props.router, pageKey);
  };

  goForward = () => {
    this.props.routeToNextAppointmentPage(this.props.router, pageKey);
  };

  render() {
    return (
      <div>
        <h1>How Express Care Works</h1>
        <FormButtons
          backButtonText="Cancel"
          nextButtonText="Continue with Express Care request"
          onBack={this.goBack}
        />
      </div>
    );
  }
}
const mapDispatchToProps = {
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
};

export default connect(
  null,
  mapDispatchToProps,
)(ExpressCareInfo);
