import React from 'react';
import PropTypes from 'prop-types';

import { LOAD_STATUSES } from './save-load-actions';
import LoadingIndicator from '../components/LoadingIndicator';

class LoadingPage extends React.Component {
  render() {
    const { loadedStatus } = this.props;
    let content;

    switch (loadedStatus) {
      case LOAD_STATUSES.failure:
        content = 'there has been a catastrophic failure'; break;
      case LOAD_STATUSES.notFound:
        content = 'well we really screwed this one up!'; break;
      case LOAD_STATUSES.success:
        content = 'oh goody! does this mean I win? no, because we should have redirected by now :('; break;
      default: // pending
        content = <LoadingIndicator message="Wait a moment while we retrieve your saved form."/>; break;
    }

    return (
      <div>{content}</div>
    );
  }
}

LoadingPage.propTypes = {
  loadedStatus: PropTypes.string.isRequired
};

export default LoadingPage;
