import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { checkRefreshStatus } from '../actions/refresh';

export class UpdatePage extends React.Component {
  render() {
    return (
      <div>
        <h1>Updating your records</h1>
        <p>
          To get the most up-to-date information, please wait for your health records to finish updating. This may take a few minutes.
        </p>
        <p>
          <Link to="/download">Get an older version of your records ></Link>
        </p>
      </div>
    );
  }
}

UpdatePage.contextTypes = {
  router: React.PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  const hrState = state.health.hr;

  return {
    refresh: hrState.refresh,
  };
};

const mapDispatchToProps = {
  checkRefreshStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePage);
