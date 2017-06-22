import React from 'react';
import Scroll from 'react-scroll';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import FormNav from './FormNav';
import FormTitle from './FormTitle';
import AskVAQuestions from './AskVAQuestions';
import { LOAD_STATUSES, setFetchFormStatus } from './save-load-actions';
import LoadingIndicator from '../components/LoadingIndicator';

import { isInProgress } from '../utils/helpers';

const Element = Scroll.Element;

/*
 * Primary component for a schema generated form app.
 */
class FormApp extends React.Component {
  componentWillMount() {
    window.addEventListener('beforeunload', this.onbeforeunload);
    if (window.History) {
      window.History.scrollRestoration = 'manual';
    }
  }

  componentWillReceiveProps(newProps) {
    const status = newProps.loadedStatus;
    if (status === LOAD_STATUSES.success) {
      newProps.router.push(newProps.returnUrl);
      // Set loadedStatus in redux to not-attempted to not show the loading page
      newProps.setFetchFormStatus(LOAD_STATUSES.notAttempted);
    } else if (status !== LOAD_STATUSES.notAttempted
      && status !== LOAD_STATUSES.pending
      && !window.location.pathname.endsWith('/error')
    ) {
      newProps.router.push(`${newProps.formConfig.urlPrefix || ''}error`);
    }
  }

  // I'm not convinced this is ever executed
  componentWillUnmount() {
    this.removeOnbeforeunload();
  }

  onbeforeunload = e => {
    const { currentLocation } = this.props;
    const trimmedPathname = currentLocation.pathname.replace(/\/$/, '');

    let message;
    if (isInProgress(trimmedPathname)) {
      message = 'Are you sure you wish to leave this application? All progress will be lost.';
      // Chrome requires this to be set
      e.returnValue = message;     // eslint-disable-line no-param-reassign
    }
    return message;
  }

  removeOnbeforeunload = () => {
    window.removeEventListener('beforeunload', this.onbeforeunload);
  }

  render() {
    const { currentLocation, formConfig, children } = this.props;
    const trimmedPathname = currentLocation.pathname.replace(/\/$/, '');
    const isIntroductionPage = trimmedPathname.endsWith('introduction');
    const isConfirmationPage = trimmedPathname.endsWith('confirmation');
    const GetFormHelp = formConfig.getHelp;
    let content;

    if (!formConfig.disableSave && this.props.loadedStatus === LOAD_STATUSES.pending) {
      content = <LoadingIndicator message="Wait a moment while we retrieve your saved form."/>;
    } else if (!isInProgress(trimmedPathname)) {
      content = children;
    } else {
      content = (
        <div>
          <FormNav formConfig={formConfig} currentPath={trimmedPathname}/>
          <div className="progress-box progress-box-schemaform">
            {children}
          </div>
        </div>
      );
    }


    return (
      <div>
        <div className="row">
          <Element name="topScrollElement"/>
          <div className="usa-width-two-thirds medium-8 columns">
            {
              formConfig.title &&
              // If we're on the introduction page, show the title if we're actually on the loading screen
              (!isIntroductionPage || this.props.loadedStatus !== LOAD_STATUSES.notAttempted) &&
                <FormTitle title={formConfig.title} subTitle={formConfig.subTitle}/>
            }
            {content}
          </div>
        </div>
        {!isConfirmationPage && <AskVAQuestions>
          {!!GetFormHelp && <GetFormHelp/>}
        </AskVAQuestions>}
        <span className="js-test-location hidden" data-location={trimmedPathname} hidden></span>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loadedStatus: state.form.loadedStatus,
  returnUrl: state.form.loadedData.metadata.returnUrl,
});

const mapDispatchToProps = {
  setFetchFormStatus,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FormApp));

export { FormApp };
