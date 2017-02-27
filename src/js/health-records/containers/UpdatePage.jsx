import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { checkRefreshStatus } from '../actions/refresh';
import { submitForm } from '../actions/form';

import ProgressBar from '../../common/components/ProgressBar';

export class UpdatePage extends React.Component {
  constructor(props) {
    super(props);

    this.pollRefresh = () => {
      setInterval(() => {
        props.checkRefreshStatus();
      }, 10000);
    };
  }
  componentDidMount() {
    this.pollRefresh();
  }

  componentWillReceiveProps(nextProps) {
    const erroredUpdates = nextProps.refresh.ERROR;
    if (erroredUpdates.length === 0) {
      this.props.submitForm(sessionStorage('hr-form'));
    }
    if (nextProps.form.ready) {
      this.context.router.push('/download');
    }
  }

  componentWillUnmount() {
    clearInterval(this.pollRefresh);
  }

  render() {
    const statuses = this.props.refresh.statuses;

    return (
      <div className="updatePage medium-6">
        <ProgressBar percent={statuses.OK.length / statuses.ERROR.length}/>
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
    form: hrState.form,
  };
};

const mapDispatchToProps = {
  checkRefreshStatus,
  submitForm,
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePage);
