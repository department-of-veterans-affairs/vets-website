import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';

import { verifyIntentToFile as setPrestartStatus, resetPrestartStatus, resetPrestartDisplay, prestartPendingStatuses, prestartFailureStatuses, PRESTART_STATUSES } from '../actions';

import { PrestartAlert } from '../helpers';

const formEntryPointPaths = new Set(['introduction', 'confirmation', 'form-saved', 'error', 'resume']);

class PrestartWrapper extends React.Component {

  componentWillReceiveProps(newProps) {
    console.log('firing');
    const { location: { pathname }, displayPrestartMessage, formConfig: { formId }, savedForms } = this.props;
    const currentPath = pathname.slice(1);
    const { location: { pathname: newPathname } } = newProps;
    const newPath = newPathname.slice(1);
    const enteringForm = !formEntryPointPaths.has(newPath) && formEntryPointPaths.has(currentPath);
    const exitingForm = formEntryPointPaths.has(newPath) && !formEntryPointPaths.has(currentPath);
    const leavingFormPage = !formEntryPointPaths.has(currentPath) && currentPath !== newPath;
    const hasSavedForm = savedForms.find(({ form }) => form === formId);

    if (leavingFormPage && displayPrestartMessage) {
      this.props.resetPrestartDisplay();
    }
    if (enteringForm) {
      this.props.setPrestartStatus(hasSavedForm);
    }
    if (exitingForm) {
      this.props.resetPrestartStatus();
    }
  }

  render() {
    const { prestartStatus, prestartData, profileLoading } = this.props;
    let content = (
      <div>
        {this.props.children}
      </div>
    );

    if (prestartPendingStatuses.has(prestartStatus)) {
      content = (<LoadingIndicator message="Please wait while we verify your Intent to File request."/>);
    }
    if (prestartFailureStatuses.has(prestartStatus)) {
      content = (
        <div className="usa-grid-full prestart-alert-error">
          <PrestartAlert status={prestartStatus} data={prestartData}/>
        </div>
      );
    }
    if (profileLoading) {
      content = <LoadingIndicator message="Retrieving your profile information..."/>;
    }
    return content;
  }
}

PrestartWrapper.propTypes = {
  formConfig: PropTypes.object.isRequired,
  displayPrestartMessage: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  prestartData: PropTypes.object.isRequired,
  prestartStatus: PropTypes.string.isRequired,
  router: PropTypes.object.isRequired,
  routes: PropTypes.array.isRequired,
  setPrestartStatus: PropTypes.func.isRequired,
  resetPrestartDisplay: PropTypes.func.isRequired,
  resetPrestartStatus: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    prestartStatus: state.prestart.status,
    prestartData: state.prestart.data,
    displayPrestartMessage: state.prestart.display,
    savedForms: state.user.profile.savedForms
  };
}

const mapDispatchToProps = {
  setPrestartStatus,
  resetPrestartStatus,
  resetPrestartDisplay
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PrestartWrapper));

export { PrestartWrapper };
