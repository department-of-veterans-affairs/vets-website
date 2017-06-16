import React from 'react';
import PropTypes from 'prop-types';

import { LOAD_STATUSES } from './save-load-actions';

class LoadingPage extends React.Component {
  componentWillReceiveProps(newProps) {
    if (newProps.loadedStatus === LOAD_STATUSES.success) {
      // Redirect here
      // Set loadedStatus in redux to not-attempted
    }
  }

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
        content = 'spinner here'; break;
    }

    return (
      <div>{content}</div>
    );
  }
}

LoadingPage.propTypes = {
  loadedStatus: PropTypes.string.isRequired,
  returnUrl: PropTypes.string
};

export default LoadingPage;
