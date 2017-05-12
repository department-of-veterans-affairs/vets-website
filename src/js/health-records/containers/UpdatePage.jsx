import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router';
import { checkRefreshStatus } from '../actions/refresh';
import { submitForm } from '../actions/form';

import ProgressBar from '../../common/components/ProgressBar';

export class UpdatePage extends React.Component {
  constructor(props) {
    super(props);

    this.pollRefresh = () => {
      setInterval(() => {
        props.checkRefreshStatus();
      }, 30000);
    };
    this.handleSkipToDownload = this.handleSkipToDownload.bind(this);
  }

  componentDidMount() {
    this.props.checkRefreshStatus();
    this.pollRefresh();
  }

  componentWillReceiveProps(nextProps) {
    const erroredUpdates = nextProps.refresh.statuses.failed;
    if (erroredUpdates.length === 0) {
      this.props.submitForm(JSON.parse(sessionStorage.getItem('hr-form')));
      this.props.router.push('/download');
    }
  }

  componentWillUnmount() {
    clearInterval(this.pollRefresh);
  }

  handleSkipToDownload(e) {
    e.preventDefault();
    this.props.submitForm(JSON.parse(sessionStorage.getItem('hr-form')));
    this.props.router.push('/download');
  }

  render() {
    const statuses = this.props.refresh.statuses;
    const completionPercentage = statuses.succeeded.length / (statuses.succeeded.length + statuses.failed.length) * 100;

    return (
      <div className="updatePage usa-width-one-half medium-6">
        <ProgressBar percent={completionPercentage || 0}/>
        <h1>Updating your records</h1>
        <p>
          To get the most up-to-date information, please wait for your health records to finish updating. This may take a few minutes.
        </p>
        <p>
          <Link to="/download" onClick={this.handleSkipToDownload}>Get an older version of your records ></Link>
        </p>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const hrState = state.health.hr;

  return {
    refresh: hrState.refresh,
    form: hrState.form,
  };
};

const mapDispatchToProps = {
  checkRefreshStatus,
  submitForm,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UpdatePage));
