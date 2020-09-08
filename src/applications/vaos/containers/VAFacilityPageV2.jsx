import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { scrollAndFocus } from '../utils/scrollAndFocus';

import {
  openFacilityPage,
  updateFacilityPageData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../new-appointment/redux/actions';
import { getFacilityPageInfo } from '../utils/selectors';

const initialSchema = {
  type: 'object',
  required: ['vaParent', 'vaFacility'],
  properties: {
    vaParent: {
      type: 'string',
      enum: [],
    },
    vaFacility: {
      type: 'string',
      enum: [],
    },
  },
};

const pageKey = 'vaFacility';
const pageTitle = 'Choose a VA location for your appointment';
const title = <h1 className="vads-u-font-size--h2">{pageTitle}</h1>;

export class VAFacilityPage extends React.Component {
  componentDidMount() {
    this.props.openFacilityPage(pageKey, initialSchema);
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
  }

  goBack = () => {
    this.props.routeToPreviousAppointmentPage(this.props.history, pageKey);
  };

  goForward = () => {
    this.props.routeToNextAppointmentPage(this.props.history, pageKey);
  };

  render() {
    return (
      <div>
        {title}
        Scaffold for VA Facility Page V2.
      </div>
    );
  }
}

VAFacilityPage.propTypes = {
  schema: PropTypes.object,
  data: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return getFacilityPageInfo(state, pageKey);
}

const mapDispatchToProps = {
  openFacilityPage,
  updateFacilityPageData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VAFacilityPage);
