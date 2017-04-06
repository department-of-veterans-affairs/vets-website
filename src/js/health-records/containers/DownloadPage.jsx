import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import moment from 'moment';

import AlertBox from '../../common/components/AlertBox';

import DownloadLink from '../components/DownloadLink';

export class DownloadPage extends React.Component {
  renderMessageBanner() {
    const { form, refresh } = this.props;
    const alertProps = {
      isVisible: true,
    };

    if (!form.ready) {
      alertProps.content = (
        <div>
          <h4>Couldn't generate your records</h4>
          <p>
            Unfortunately, we weren't able to generate your health records. Please try again later. You can also call the Vets.gov Help Desk at 1-855-574-7286, Monday - Friday, 8:00 a.m. - 8:00 p.m. (ET).
          </p>
        </div>
      );
      alertProps.status = 'error';
    } else if (refresh && refresh.statuses.incomplete && refresh.statuses.incomplete.length > 0) {
      alertProps.content = (
        <div>
          <h4>Your health records are not up to date</h4>
          <p>
            This older version of your health records may have outdated or missing information.
          </p>
        </div>
      );
      alertProps.status = 'warning';
    } else if (refresh && refresh.statuses.failed && refresh.statuses.failed.length > 0) {
      alertProps.content = (
        <div>
          <h4>Couldn't update your records</h4>
          <p>
            Unfortunately, we weren't able to generate your health records. Please try again later or download an older version of your records below. You can also call the Vets.gov Help Desk at 1-855-574-7286, Monday - Friday, 8:00 a.m. - 8:00 p.m. (ET).
          </p>
        </div>
      );
      alertProps.status = 'error';
    } else {
      alertProps.content = (
        <div>
          <h4>Your records are ready to download</h4>
          <p>
            For security, your health records will only be available for download for 30 minutes. After that, or if you close this page, you'll have to start a new request to get your records.
          </p>
        </div>
      );
      alertProps.status = 'success';
    }

    return <AlertBox {...alertProps}/>;
  }

  render() {
    return (
      <div>
        <h1>Download Your Health Records</h1>
        {this.renderMessageBanner()}
        <p>
          <strong>Request Date:</strong> {moment(this.props.form.requestDate).format('MMMM Do YYYY')}
        </p>
        <div>
          <DownloadLink name="PDF File" docType="pdf"/>
          <DownloadLink name="Text File" docType="txt"/>
        </div>
        <p>
          <Link to="/">Start a new request</Link>
        </p>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const hrState = state.health.hr;

  return {
    form: hrState.form,
    refresh: hrState.refresh,
  };
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadPage);
