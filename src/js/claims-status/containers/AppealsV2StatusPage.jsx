import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getAppealsV2 } from '../actions/index.jsx';
import { getStatusContents, getNextEvents } from '../utils/appeals-v2-helpers';

import LoadingIndicator from '../../common/components/LoadingIndicator';
import Timeline from '../components/appeals-v2/Timeline';
import Alerts from '../components/appeals-v2/Alerts';
import WhatsNext from '../components/appeals-v2/WhatsNext';
import Docket from '../components/appeals-v2/Docket';

/**
 * AppealsV2StatusPage is in charge of the layout of the status page and is the source of truth
 * for the redux state. All child components shouldn't need to be connected to the store.
 */
class AppealsV2StatusPage extends React.Component {
  componentDidMount() {
    // Make sure we grab the appeals if we don't have them already
    // Useful if the user goes directly to the appeal status without going to the list first
    if (this.props.appeal === AppealsV2StatusPage.defaultProps.appeal) {
      this.props.getAppealsV2();
    }
  }

  render() {
    if (this.props.appealsLoading) {
      return <LoadingIndicator message="Please wait while we load your appeal..."/>;
    }
    const { events, alerts, status } = this.props.appeal.attributes;
    const { type, details } = status;
    const currentStatus = getStatusContents(type, details);
    const nextEvents = getNextEvents(type);
    return (
      <div>
        <Timeline events={events} currentStatus={currentStatus}/>
        <Alerts alerts={alerts}/>
        <WhatsNext nextEvents={nextEvents}/>
        <Docket/>
      </div>
    );
  }
}

AppealsV2StatusPage.defaultProps = {
  appeal: {
    id: '',
    type: '',
    attributes: {
      events: [],
      alerts: [],
      status: {
        type: '',
        details: {},
      }
    }
  }
};

AppealsV2StatusPage.propTypes = {
  params: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
  appeal: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    attributes: PropTypes.object.isRequired, // Can flesh this out later
  })
};


function mapStateToProps(state) {
  return {
    appealsLoading: state.disability.status.appeals.appealsLoading,
  };
}

const mapDispatchToProps = {
  getAppealsV2
};

export default connect(mapStateToProps, mapDispatchToProps)(AppealsV2StatusPage);

