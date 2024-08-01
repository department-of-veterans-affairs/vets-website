import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { getScrollOptions } from '@department-of-veterans-affairs/platform-utilities/ui';
import scrollTo from '@department-of-veterans-affairs/platform-utilities/scrollTo';
import { Toggler } from '~/platform/utilities/feature-toggles';

import AddFilesForm from './AddFilesForm';
import Notification from '../Notification';
import FilesOptional from './FilesOptional';
import FilesNeeded from './FilesNeeded';
import Standard5103Alert from './Standard5103Alert';

import { benefitsDocumentsUseLighthouse } from '../../selectors';
import { setFocus, setPageFocus } from '../../utils/page';
import {
  addFile,
  removeFile,
  submitFiles,
  // START lighthouse_migration
  submitFilesLighthouse,
  // END lighthouse_migration
  updateField,
  cancelUpload,
  getClaim as getClaimAction,
  setFieldsDirty,
  resetUploads,
  clearAdditionalEvidenceNotification,
} from '../../actions';
import {
  getFilesNeeded,
  getFilesOptional,
  isAutomated5103Notice,
  isClaimOpen,
} from '../../utils/helpers';
import withRouter from '../../utils/withRouter';

const scrollToError = () => {
  const options = getScrollOptions({ offset: -25 });

  setTimeout(() => {
    scrollTo('uploadError', options);
    setFocus('.usa-alert-error');
  });
};

const { Element } = Scroll;

const filesPath = `../files`;

class AdditionalEvidencePage extends React.Component {
  componentDidMount() {
    this.props.resetUploads();
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(props) {
    if (props.uploadComplete) {
      this.goToFilesPage();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.message && !prevProps.message) {
      scrollToError();
    }
    if (!this.props.loading && prevProps.loading) {
      setPageFocus();
    }
  }

  componentWillUnmount() {
    if (!this.props.uploadComplete) {
      this.props.clearAdditionalEvidenceNotification();
    }
  }

  goToFilesPage() {
    this.props.getClaim(this.props.claim.id);
    this.props.navigate(filesPath);
  }

  render() {
    const { claim, lastPage } = this.props;
    const { claimPhaseDates, evidenceWaiverSubmitted5103 } = claim.attributes;

    let content;

    const isOpen = isClaimOpen(
      claim.attributes.status,
      claim.attributes.closeDate,
    );

    if (this.props.loading) {
      content = (
        <va-loading-indicator
          set-focus
          message="Loading your claim information..."
        />
      );
    } else {
      const { message, filesNeeded } = this.props;

      const standard5103NoticeExists =
        claimPhaseDates.latestPhaseType === 'GATHERING_OF_EVIDENCE' &&
        evidenceWaiverSubmitted5103 === false;
      const automated5103NoticeExists = filesNeeded.some(i =>
        isAutomated5103Notice(i.displayName),
      );

      content = (
        <div className="additional-evidence-container">
          {message && (
            <>
              <Element name="uploadError" />
              <Notification
                title={message.title}
                body={message.body}
                type={message.type}
              />
            </>
          )}
          <h3 className="vads-u-margin-bottom--3">Additional evidence</h3>
          {isOpen ? (
            <>
              {filesNeeded.map(item => (
                <FilesNeeded
                  key={item.id}
                  id={claim.id}
                  item={item}
                  evidenceWaiverSubmitted5103={
                    claim.attributes.evidenceWaiverSubmitted5103
                  }
                  previousPage="files"
                />
              ))}
              <Toggler toggleName={Toggler.TOGGLE_NAMES.cst5103UpdateEnabled}>
                <Toggler.Enabled>
                  {standard5103NoticeExists &&
                    !automated5103NoticeExists && (
                      <Standard5103Alert previousPage="status" />
                    )}
                </Toggler.Enabled>
              </Toggler>
              {this.props.filesOptional.map(item => (
                <FilesOptional key={item.id} id={claim.id} item={item} />
              ))}
              <AddFilesForm
                field={this.props.uploadField}
                progress={this.props.progress}
                uploading={this.props.uploading}
                files={this.props.files}
                backUrl={lastPage ? `/${lastPage}` : filesPath}
                onSubmit={() => {
                  // START lighthouse_migration
                  if (this.props.documentsUseLighthouse) {
                    this.props.submitFilesLighthouse(
                      claim.id,
                      null,
                      this.props.files,
                    );
                  } else {
                    this.props.submitFiles(claim.id, null, this.props.files);
                  }
                  // END lighthouse_migration
                }}
                onAddFile={this.props.addFile}
                onRemoveFile={this.props.removeFile}
                onFieldChange={this.props.updateField}
                onCancel={this.props.cancelUpload}
                onDirtyFields={this.props.setFieldsDirty}
              />
            </>
          ) : (
            <p className="vads-u-margin-top--0 vads-u-margin-bottom--4">
              The claim is closed so you can no longer submit any additional
              evidence.
            </p>
          )}
        </div>
      );
    }

    return (
      <>
        <div name="topScrollElement" />
        {content}
      </>
    );
  }
}

function mapStateToProps(state) {
  const claimsState = state.disability.status;
  const claim = claimsState.claimDetail.detail;
  const { trackedItems } = claim.attributes;

  return {
    loading: claimsState.claimDetail.loading,
    claim,
    files: claimsState.uploads.files,
    uploading: claimsState.uploads.uploading,
    progress: claimsState.uploads.progress,
    uploadError: claimsState.uploads.uploadError,
    uploadComplete: claimsState.uploads.uploadComplete,
    uploadField: claimsState.uploads.uploadField,
    lastPage: claimsState.routing.lastPage,
    message: claimsState.notifications.additionalEvidenceMessage,
    filesNeeded: getFilesNeeded(trackedItems),
    filesOptional: getFilesOptional(trackedItems),
    // START lighthouse_migration
    documentsUseLighthouse: benefitsDocumentsUseLighthouse(state),
    // END lighthouse_migration
  };
}

const mapDispatchToProps = {
  addFile,
  removeFile,
  submitFiles,
  updateField,
  cancelUpload,
  getClaim: getClaimAction,
  submitFilesLighthouse,
  setFieldsDirty,
  resetUploads,
  clearAdditionalEvidenceNotification,
};

AdditionalEvidencePage.propTypes = {
  addFile: PropTypes.func,
  cancelUpload: PropTypes.func,
  claim: PropTypes.object,
  clearAdditionalEvidenceNotification: PropTypes.func,
  // START lighthouse_migration
  documentsUseLighthouse: PropTypes.bool,
  // END lighthouse_migration
  files: PropTypes.array,
  filesNeeded: PropTypes.array,
  filesOptional: PropTypes.array,
  getClaim: PropTypes.func,
  lastPage: PropTypes.string,
  loading: PropTypes.bool,
  message: PropTypes.object,
  navigate: PropTypes.func,
  params: PropTypes.object,
  progress: PropTypes.number,
  removeFile: PropTypes.func,
  resetUploads: PropTypes.func,
  setFieldsDirty: PropTypes.func,
  submitFiles: PropTypes.func,
  // START lighthouse_migration
  submitFilesLighthouse: PropTypes.func,
  // END lighthouse_migration
  updateField: PropTypes.func,
  uploadComplete: PropTypes.bool,
  uploadField: PropTypes.object,
  uploading: PropTypes.bool,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(AdditionalEvidencePage),
);

export { AdditionalEvidencePage };
