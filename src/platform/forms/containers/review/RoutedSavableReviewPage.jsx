// libs
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// platform - forms - actions
import {
  autoSaveForm,
  saveAndRedirectToReturnUrl,
} from 'platform/forms/save-in-progress/actions';

// platform - forms components
import ErrorMessage from 'platform/forms/components/review/ErrorMessage';

// platform - forms containers
import SaveFormLink from 'platform/forms/save-in-progress/SaveFormLink';
import SubmitController from 'platform/forms/containers/review/SubmitController';

// platform - forms-system components
import ReviewChapters from 'platform/forms-system/src/js/review/ReviewChapters';
// import SubmitController from 'platform/forms-system/src/js/review/SubmitController';

// utils
import debounce from 'platform/utilities/data/debounce';

import DowntimeNotification, {
  externalServiceStatus,
} from 'platform/monitoring/DowntimeNotification';
import get from 'platform/utilities/data/get';
import { focusElement } from 'platform/utilities/ui';
import { toggleLoginModal as toggleLoginModalAction } from 'platform/site-wide/user-nav/actions';
import SaveStatus from 'platform/forms/save-in-progress/SaveStatus';
import { getFormContext } from 'platform/forms/save-in-progress/selectors';
import DowntimeMessage from 'platform/forms/save-in-progress/DowntimeMessage';

const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo(
    'topScrollElement',
    window.VetsGov.scroll || {
      duration: 500,
      delay: 0,
      smooth: true,
    },
  );
};

const VALID_SUBMISSION_STATES = [
  'submitPending',
  'applicationSubmitted',
  'clientError',
  'throttledError',
  'validationError',
];

class RoutedSavableReviewPage extends Component {
  constructor(props) {
    super(props);
    this.debouncedAutoSave = debounce(1000, this.autoSave);
  }

  componentDidMount() {
    scrollToTop();
    focusElement('h2');
  }

  autoSave = () => {
    const { form, user } = this.props;
    if (user.login.currentlyLoggedIn) {
      const data = form.data;
      const { formId, version } = form;
      const returnUrl = this.props.location.pathname;

      this.props.autoSaveForm(formId, data, version, returnUrl);
    }
  };

  renderDowntime = (downtime, children) => {
    if (downtime.status === externalServiceStatus.down) {
      const Message = this.props.formConfig.downtime.message || DowntimeMessage;

      return <Message downtime={downtime} />;
    }

    return children;
  };

  render() {
    const {
      form,
      formConfig,
      formContext,
      location,
      pageList,
      path,
      route,
      showLoginModal,
      toggleLoginModal,
      user,
    } = this.props;

    const downtimeDependencies = get('downtime.dependencies', formConfig) || [];
    return (
      <div>
        <ReviewChapters
          formConfig={formConfig}
          formContext={formContext}
          pageList={pageList}
          onSetData={() => this.debouncedAutoSave()}
        />
        <DowntimeNotification
          appTitle="application"
          render={this.renderDowntime}
          dependencies={downtimeDependencies}
        >
          <SubmitController
            formConfig={formConfig}
            pageList={pageList}
            path={path}
          >
            <ErrorMessage
              active={form?.submission?.status}
              location={location}
              form={form}
              route={route}
              showLoginModal={showLoginModal}
              toggleLoginModal={toggleLoginModal}
              user={user}
            />
          </SubmitController>
        </DowntimeNotification>
        <ErrorMessage
          active
          location={location}
          form={form}
          route={route}
          showLoginModal={showLoginModal}
          toggleLoginModal={toggleLoginModal}
          user={user}
        />
        <SaveStatus
          isLoggedIn={user.login.currentlyLoggedIn}
          showLoginModal={showLoginModal}
          toggleLoginModal={toggleLoginModal}
          form={form}
        />
        <SaveFormLink
          locationPathname={location.pathname}
          form={form}
          user={user}
          showLoginModal={showLoginModal}
          saveAndRedirectToReturnUrl={this.props.saveAndRedirectToReturnUrl}
          toggleLoginModal={toggleLoginModal}
        >
          {formConfig.finishLaterLinkText}
        </SaveFormLink>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const route = ownProps.route;
  const { formConfig, pageList, path } = route;

  const { form, user } = state;

  const formContext = getFormContext({ form, user, onReviewPage: true });

  return {
    form,
    formConfig,
    formContext,
    pageList: pageList.map(
      page =>
        page.appStateSelector
          ? { ...page, appStateData: page.appStateSelector(state) }
          : page,
    ),
    showLoginModal: state.navigation.showLoginModal,
    path,
    route,
    user,
  };
}

const mapDispatchToProps = {
  autoSaveForm,
  saveAndRedirectToReturnUrl,
  toggleLoginModal: toggleLoginModalAction,
};

RoutedSavableReviewPage.propTypes = {
  autoSaveForm: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  route: PropTypes.shape({
    formConfig: PropTypes.object.isRequired,
  }).isRequired,
  formContext: PropTypes.object.isRequired,
  pageList: PropTypes.array.isRequired,
  path: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(RoutedSavableReviewPage),
);

export { RoutedSavableReviewPage };
