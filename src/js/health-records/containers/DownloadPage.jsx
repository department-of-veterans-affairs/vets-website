import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import moment from 'moment';
import isMobile from 'ismobilejs';
import { isEmpty } from 'lodash';

import AlertBox from '@department-of-veterans-affairs/jean-pants/AlertBox';
import LoadingIndicator from '../../common/components/LoadingIndicator';

import DownloadLink from '../components/DownloadLink';
import { openModal, closeModal } from '../actions/modal';

export class DownloadPage extends React.Component {
  renderMessageBanner() {
    const { form, refresh } = this.props;
    const alertProps = {
      isVisible: true,
    };

    if (!form.ready) {
      alertProps.headline = (<h4>Couldn’t generate your records</h4>);
      alertProps.content = (<p>Unfortunately, we weren’t able to generate your health records. Please try again later. You can also call the Vets.gov Help Desk at <a href="tel:855-574-7286">1-855-574-7286</a>, TTY: <a href="tel:18008778339">1-800-877-8339</a>, Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET).</p>);
      alertProps.status = 'error';
    } else if (refresh && !isEmpty(refresh.statuses.incomplete)) {
      alertProps.headline = (<h4>Your health records are not up to date</h4>);
      alertProps.content = (<p>This older version of your health records may have outdated or missing information.</p>
      );
      alertProps.status = 'warning';
    } else if (refresh && !isEmpty(refresh.statuses.failed)) {
      alertProps.headline = (<h4>Couldn’t update your records</h4>);
      alertProps.content = (<p>Unfortunately, we weren’t able to generate your most recent health records. You can try again in 24 hours or download an older version of your records below.</p>);
      alertProps.status = 'warning';
    } else {
      alertProps.headline = (<h4>Your records are ready to download</h4>);
      alertProps.content = (<p>
            For security, your health records will only be available for download for 30 minutes. After that, or if you close this page, you’ll have to start a new request to get your records.</p>);
      alertProps.status = 'success';
    }

    return <AlertBox {...alertProps}/>;
  }

  renderConfirmModal() {
    const linkOnClick = (e) => {
      e.preventDefault();
      this.props.openModal('Are you sure you want to leave this page?', <div>
        <p>Generating a new health record will replace your most recent download request.</p>
        <div className="va-modal-actions">
          <Link className="usa-button" to="/" onClick={this.props.closeModal}>
            Yes, continue
          </Link>
          <button onClick={this.props.closeModal} className="usa-button-secondary">Cancel</button>
        </div>
      </div>);
    };

    return <a href="#" onClick={linkOnClick}>Start a new request</a>;
  }

  renderPDFDownloadButton() {
    let linkOnClick;

    if (isMobile.any) {
      linkOnClick = (e) => {
        const continueClick = () => {
          this.props.closeModal();
          this.pdfDownloadButton.downloadHealthRecord(e, false);
        };

        this.props.openModal('Do you wish to continue?', <div>
          <p>Health Records PDFs tend to be 1-2MB in size, but occasionally can be much larger. If this is downloaded over the cellular network, data charges may apply.</p>
          <div className="va-modal-actions">
            <button onClick={continueClick}>
              Yes, continue
            </button>
            <button onClick={this.props.closeModal} className="usa-button-secondary">Cancel</button>
          </div>
        </div>);
      };
    }
    return <DownloadLink ref={e => { this.pdfDownloadButton = e; }} onClick={linkOnClick} name="PDF File" docType="pdf"/>;
  }

  renderRequestDate() {
    const { form } = this.props;

    if (!form.requestDate) { return null; }

    return (
      <p>
        <strong>Request Date:</strong> {moment(form.requestDate).format('MMMM Do YYYY')}
      </p>
    );
  }

  renderDownloadButtons() {
    const { form } = this.props;

    if (!form.ready) { return null; }

    return (
      <div>
        {this.renderPDFDownloadButton()}
        <DownloadLink name="Text File" docType="txt"/>
      </div>
    );
  }

  render() {
    if (this.props.form.inProgress) {
      return <LoadingIndicator message="Generating your health record..."/>;
    }

    return (
      <div>
        <h1>Access Your Health Records</h1>
        {this.renderMessageBanner()}
        {this.renderRequestDate()}
        {this.renderDownloadButtons()}
        <p>
          {this.renderConfirmModal()}
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
const mapDispatchToProps = {
  openModal,
  closeModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadPage);
