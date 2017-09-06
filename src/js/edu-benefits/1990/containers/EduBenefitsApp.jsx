import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import Scroll from 'react-scroll';

import { connect } from 'react-redux';

import { withRouter } from 'react-router';

import { chapters, pages } from '../routes';

import SegmentedProgressBar from '../../../common/components/SegmentedProgressBar';
import NavButtons from '../../../common/components/NavButtons';
import NavHeader from '../../../common/components/NavHeader';
import OMBInfo from '../../../common/components/OMBInfo';

import FormTitle from '../../../common/schemaform/FormTitle';
import AskVAQuestions from '../../../common/schemaform/AskVAQuestions';
import GetFormHelp from '../../components/GetFormHelp';

import PerfPanel from '../components/debug/PerfPanel';
import RoutesDropdown from '../components/debug/RoutesDropdown';

import { isValidPage, isValidForm } from '../utils/validations';
import { ensurePageInitialized, updateCompletedStatus, submitForm, veteranUpdateField, setAttemptedSubmit } from '../actions/index';

import { getScrollOptions, isInProgress } from '../../../common/utils/helpers';

const Element = Scroll.Element;
const scroller = Scroll.scroller;

const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', getScrollOptions());
};

class EduBenefitsApp extends React.Component {
  constructor(props) {
    super(props);
    this.removeOnbeforeunload = this.removeOnbeforeunload.bind(this);
    this.onbeforeunload = this.onbeforeunload.bind(this);
  }

  componentWillMount() {
    window.addEventListener('beforeunload', this.onbeforeunload); // eslint-disable-line scanjs-rules/call_addEventListener
  }

  componentWillReceiveProps(nextProps) {
    const a = nextProps.submission.status;
    const b = this.props.submission.status;
    if (a !== b && a === 'applicationSubmitted') {
      this.props.router.push('/1990/submit-message');
      this.removeOnbeforeunload();
      scrollToTop();
    }
  }

  componentWillUnmount() {
    this.removeOnbeforeunload();
  }

  onbeforeunload(e) {
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

  removeOnbeforeunload() {
    window.removeEventListener('beforeunload', this.onbeforeunload);
  }

  render() {
    const { currentLocation, data, submission, router, dirtyPage, setComplete, submitBenefitsForm, onStateChange, onAttemptedSubmit } = this.props;
    const navigateTo = path => router.push(path);
    const onSubmit = () => {
      submitBenefitsForm(this.props.data);
    };

    const trimmedPathname = currentLocation.pathname.replace(/\/$/, '');
    const isIntroductionPage = trimmedPathname.endsWith('introduction');
    const isConfirmationPage = trimmedPathname.endsWith('submit-message');

    // Until we come up with a common code base between this and the schemaform
    //  forms, the following is borrowed from NavHeader
    let step;
    chapters.forEach((chapter, index) => {
      if (chapter.pages.some(page => page.path === currentLocation.pathname)) {
        step = index + 1;
      }
    });

    let devPanel = undefined;
    if (__BUILDTYPE__ === 'development') {
      const queryParams = _.fromPairs(
        window.location.search.substring(1).split('&').map((v) => { return v.split('='); }));
      if (queryParams.devPanel === '1') {
        devPanel = (
          <div className="row">
            <RoutesDropdown/>
            <PerfPanel/>
          </div>
        );
      }
    }

    const contentClass = classNames(
      'progress-box',
      'progress-box-schemaform'
    );

    const ombInfo = isIntroductionPage ?
      // .row.edu-intro-spacing for the bottom spacing, columns for the padding
      (<div className="row edu-intro-spacing columns">
        <OMBInfo resBurden={15} ombNumber="2900-0154" expDate="12/31/2019"/>
      </div>)
      : null;

    return (
      <div className="row">
        {devPanel}
        <Element name="topScrollElement"/>
        <div className="usa-width-two-thirds medium-8 columns">
          {!isIntroductionPage && <FormTitle title="Apply for education benefits" subTitle="Form 22-1990"/>}
          <div>
            {!isIntroductionPage && <SegmentedProgressBar total={chapters.length} current={step}/>}
            <div className="schemaform-chapter-progress">
              <NavHeader path={currentLocation.pathname} chapters={chapters} className="nav-header-schemaform"/>
            </div>
          </div>
          <div className={contentClass}>
            {this.props.children}
            <NavButtons
              data={data}
              submission={submission}
              pages={pages}
              path={trimmedPathname}
              isValid={isValidPage(currentLocation.pathname, data)}
              canSubmit={isValidForm(data)}
              dirtyPage={dirtyPage}
              onNavigate={navigateTo}
              onComplete={setComplete}
              onSubmit={onSubmit}
              onStateChange={onStateChange}
              onAttemptedSubmit={onAttemptedSubmit}/>
            {ombInfo}
          </div>
        </div>
        {!isConfirmationPage && <AskVAQuestions>
          <GetFormHelp/>
        </AskVAQuestions>}
        <span className="js-test-location hidden" data-location={currentLocation.pathname} hidden></span>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    pageState: state.uiState.pages,
    currentLocation: ownProps.location,
    data: state.veteran,
    submission: state.uiState.submission,
    router: ownProps.router
  };
}

// Fill this in when we start using actions
function mapDispatchToProps(dispatch) {
  return {
    dirtyPage(page) {
      dispatch(ensurePageInitialized(page));
    },
    setComplete(page) {
      dispatch(updateCompletedStatus(page));
    },
    submitBenefitsForm(...args) {
      dispatch(submitForm(...args));
    },
    onStateChange(...args) {
      dispatch(veteranUpdateField(...args));
    },
    onAttemptedSubmit: (...args) => {
      dispatch(setAttemptedSubmit(...args));
    },
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EduBenefitsApp));
export { EduBenefitsApp };
