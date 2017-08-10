import React from 'react';
import moment from 'moment';
import Scroll from 'react-scroll';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import FormNav from './FormNav';
import FormTitle from './FormTitle';
import AskVAQuestions from './AskVAQuestions';
import { LOAD_STATUSES, PREFILL_STATUSES, SAVE_STATUSES, setFetchFormStatus } from './save-load-actions';
import LoadingIndicator from '../components/LoadingIndicator';

import { isInProgress } from '../utils/helpers';

const Element = Scroll.Element;
const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', window.VetsGov.scroll || {
    duration: 500,
    delay: 0,
    smooth: true
  });
};

moment.updateLocale('en', {
  meridiem: (hour) => {
    if (hour < 12) {
      return 'a.m.';
    }
    return 'p.m.';
  }
});

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
    } else if (newProps.prefillStatus !== this.props.prefillStatus
      && newProps.prefillStatus === PREFILL_STATUSES.unfilled) {
      newProps.router.push(newProps.routes[newProps.routes.length - 1].pageList[1].path);
    } else if (status !== LOAD_STATUSES.notAttempted
      && status !== LOAD_STATUSES.pending
      && status !== this.props.loadedStatus
      && !window.location.pathname.endsWith('/error')
    ) {
      newProps.router.push(`${newProps.formConfig.urlPrefix || ''}error`);
    } else if (newProps.savedStatus !== this.props.savedStatus &&
      newProps.savedStatus === SAVE_STATUSES.success) {
      newProps.router.push(`${newProps.formConfig.urlPrefix || ''}form-saved`);
    }
  }

  // should scroll up to top while user is waiting for form to load or save
  componentDidUpdate(oldProps) {
    if ((oldProps.loadedStatus !== this.props.loadedStatus &&
      this.props.loadedStatus === LOAD_STATUSES.pending)
      || ((oldProps.savedStatus !== this.props.savedStatus &&
      this.props.savedStatus === SAVE_STATUSES.pending))) {
      scrollToTop();
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
    const { currentLocation, formConfig, children, formData } = this.props;
    const trimmedPathname = currentLocation.pathname.replace(/\/$/, '');
    const isIntroductionPage = trimmedPathname.endsWith('introduction');
    const isConfirmationPage = trimmedPathname.endsWith('confirmation');
    const GetFormHelp = formConfig.getHelp;
    let content;

    if (!formConfig.disableSave && this.props.loadedStatus === LOAD_STATUSES.pending) {
      content = <LoadingIndicator message="Wait a moment while we retrieve your saved form."/>;
    } else if (!formConfig.disableSave && this.props.savedStatus === SAVE_STATUSES.pending) {
      content = <LoadingIndicator message="Wait a moment while we save your form."/>;
    } else if (!isInProgress(trimmedPathname)) {
      content = children;
    } else {
      content = (
        <div>
          <FormNav formData={formData} formConfig={formConfig} currentPath={trimmedPathname}/>
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
  savedStatus: state.form.savedStatus,
  prefillStatus: state.form.prefillStatus,
  returnUrl: state.form.loadedData.metadata.returnUrl,
  formData: state.form.data
});

const mapDispatchToProps = {
  setFetchFormStatus,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FormApp));

export { FormApp };
