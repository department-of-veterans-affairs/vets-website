import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import moment from 'moment';
import isMobile from 'ismobilejs';

import AlertBox from '../../common/components/AlertBox';

import DownloadLink from '../components/DownloadLink';
import { openModal, closeModal } from '../actions/modal';

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

  renderConfirmModal() {
    const linkOnClick = (e) => {
      e.preventDefault();
      this.props.openModal('Are you sure you want to leave this page?', <div>
        <p>Generating a new health record will replace your most recent download request.</p>
        <div className="va-modal-actions">
          <Link className="usa-button" to="/" onClick={this.props.closeModal}>
            Yes, continue
          </Link>
          <button onClick={this.props.closeModal} className="usa-button-outline">Cancel</button>
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
            <button onClick={this.props.closeModal} className="usa-button-outline">Cancel</button>
          </div>
        </div>);
      };
    }
    return <DownloadLink ref={e => { this.pdfDownloadButton = e; }} onClick={linkOnClick} name="PDF File" docType="pdf"/>;
  }

  render() {
    return (
      <div>
        <h1>Access Your Health Records</h1>
        {this.renderMessageBanner()}
        <p>
          <strong>Request Date:</strong> {moment(this.props.form.requestDate).format('MMMM Do YYYY')}
        </p>
        <div>
          {this.renderPDFDownloadButton()}
          <DownloadLink name="Text File" docType="txt"/>
        </div>
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
