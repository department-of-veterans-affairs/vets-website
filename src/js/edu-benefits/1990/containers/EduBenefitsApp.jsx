import React from 'react';
import _ from 'lodash';
import Scroll from 'react-scroll';

import { connect } from 'react-redux';

import { withRouter } from 'react-router';

import { chapters, pages } from '../routes';

import Nav from '../../../common/components/Nav';
import NavButtons from '../../../common/components/NavButtons';
import NavHeader from '../../../common/components/NavHeader';

import PerfPanel from '../components/debug/PerfPanel';
import RoutesDropdown from '../components/debug/RoutesDropdown';

import { isValidPage, isValidForm } from '../utils/validations';
import { ensurePageInitialized, updateCompletedStatus, submitForm, veteranUpdateField, setAttemptedSubmit } from '../actions/index';

import { getScrollOptions } from '../../../common/utils/helpers';

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
    let message;
    if (this.props.location.pathname !== '/1990/introduction') {
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
    const { pageState, currentLocation, data, submission, router, dirtyPage, setComplete, submitBenefitsForm, onStateChange, onAttemptedSubmit } = this.props;
    const navigateTo = path => router.push(path);
    const onSubmit = () => {
      submitBenefitsForm(this.props.data);
    };

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

    return (
      <div className="row">
        {devPanel}
        <Element name="topScrollElement"/>
        <div className="medium-4 columns show-for-medium-up">
          <Nav
              data={data}
              pages={pageState}
              chapters={chapters}
              currentUrl={currentLocation.pathname}/>
        </div>
        <div className="medium-8 columns">
          <div className="progress-box">
            <NavHeader path={currentLocation.pathname} chapters={chapters} className="show-for-small-only"/>
            {this.props.children}
            <NavButtons
                data={data}
                submission={submission}
                pages={pages}
                path={currentLocation.pathname}
                isValid={isValidPage(currentLocation.pathname, data)}
                canSubmit={isValidForm(data)}
                dirtyPage={dirtyPage}
                onNavigate={navigateTo}
                onComplete={setComplete}
                onSubmit={onSubmit}
                onStateChange={onStateChange}
                onAttemptedSubmit={onAttemptedSubmit}/>
          </div>
        </div>
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
