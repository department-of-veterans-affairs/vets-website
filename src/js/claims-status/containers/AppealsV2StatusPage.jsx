import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getAppealsV2 } from '../actions/index.jsx';
import { getStatusContents } from '../utils/appeals-v2-helpers';

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
    const { events, status } = this.props.appeal.attributes;
    const { type, details } = status;
    const currentStatus = getStatusContents(type, details);
    return (
      <div>
        <Timeline events={events} currentStatus={currentStatus}/>
        <Alerts/>
        <WhatsNext/>
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
      status: {
        type: '',
        details: {}
      }
    }
  }
};

AppealsV2StatusPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  appeal: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    attributes: PropTypes.object.isRequired, // Can flesh this out later
  })
};

function isolateAppeal(state, id) {
  const claimsState = state.disability.status;
  const { appeals } = claimsState.claims;
  const appeal = appeals.find(a => a.id === id);

  // append starting event for post-remand and post-cavc remand appeals
  // NOTE: This is business logic pulled from v1 that we don't fully understand yet.
  //  Also, having this logic in mapStateToProps is less than ideal; we want to
  //  move it out when we know where it should live. Maybe just a helper.
  if (appeal && appeal.attributes.type !== 'original' && appeal.attributes.prior_decision_date) {
    appeal.attributes.events.unshift({
      type: appeal.attributes.type === 'post_cavc_remand' ? 'cavc_decision' : 'bva_remand',
      date: appeal.attributes.prior_decision_date,
    });
  }

  return appeal;
}

function mapStateToProps(state, ownProps) {
  return {
    appeal: isolateAppeal(state, ownProps.params.id),
    loading: state.loading
  };
}

const mapDispatchToProps = {
  getAppealsV2
};

export default connect(mapStateToProps, mapDispatchToProps)(AppealsV2StatusPage);

