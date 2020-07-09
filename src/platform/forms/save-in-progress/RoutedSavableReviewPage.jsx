import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Scroll from 'react-scroll';
import {
  FINISH_APP_LATER_DEFAULT_MESSAGE,
  APP_TYPE_DEFAULT,
} from './constants';
import debounce from '../../utilities/data/debounce';

import ReviewChapters from 'platform/forms-system/src/js/review/ReviewChapters';
import SubmitController from 'platform/forms-system/src/js/review/SubmitController';

import CallHRC from '../../static-data/CallHRC';
import DowntimeNotification, {
  externalServiceStatus,
} from '../../monitoring/DowntimeNotification';
import get from '../../utilities/data/get';
import { focusElement } from '../../utilities/ui';
import { toggleLoginModal } from '../../site-wide/user-nav/actions';
import SaveFormLink from './SaveFormLink';
import SaveStatus from './SaveStatus';
import {
  autoSaveForm,
  saveAndRedirectToReturnUrl,
  saveErrors,
} from './actions';
import { getFormContext } from './selectors';
import DowntimeMessage from './DowntimeMessage';

const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo(
    'topScrollElement',
    window.VetsGov?.scroll || {
      duration: 500,
      delay: 0,
      smooth: true,
    },
  );
};

class RoutedSavableReviewPage extends React.Component {
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

  renderErrorMessage = () => {
    const { route, user, form, location, showLoginModal } = this.props;
    const errorText = route.formConfig.errorText;
    const savedStatus = form.savedStatus;
    const { appType } = route?.formConfig?.customText || APP_TYPE_DEFAULT;
    const saveLink = (
      <SaveFormLink
        locationPathname={location.pathname}
        form={form}
        formConfig={route?.formConfig}
        user={user}
        showLoginModal={showLoginModal}
        saveAndRedirectToReturnUrl={this.props.saveAndRedirectToReturnUrl}
        toggleLoginModal={this.props.toggleLoginModal}
      >
        Save your form
      </SaveFormLink>
    );

    if (saveErrors.has(savedStatus)) {
      return saveLink;
    }

    let InlineErrorComponent;
    if (typeof errorText === 'function') {
      InlineErrorComponent = errorText;
    } else if (typeof errorText === 'string') {
      InlineErrorComponent = () => <p>{errorText}</p>;
    } else {
      InlineErrorComponent = () => (
        <p>
          If it still doesn’t work, please <CallHRC />
        </p>
      );
    }

    return (
      <div className="usa-alert usa-alert-error schemaform-failure-alert">
        <div className="usa-alert-body">
          <p className="schemaform-warning-header">
            <strong>
              We’re sorry. We can't submit your {appType} right now.
            </strong>
          </p>
          <p>
            We’re working to fix the problem. Please make sure you’re connected
            to the Internet, and then try saving your {appType} again.{' '}
            {saveLink}.
          </p>
          {!user.login.currentlyLoggedIn && (
            <p>
              If you don’t have an account, you’ll have to start over. Try
              submitting your {appType} again tomorrow.
            </p>
          )}
          <InlineErrorComponent />
        </div>
      </div>
    );
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
      user,
    } = this.props;
    const finishAppLaterMessage =
      formConfig?.customText?.finishAppLaterMessage ||
      FINISH_APP_LATER_DEFAULT_MESSAGE;
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
            renderErrorMessage={this.renderErrorMessage}
          />
        </DowntimeNotification>
        <SaveStatus
          isLoggedIn={user.login.currentlyLoggedIn}
          showLoginModal={this.props.showLoginModal}
          toggleLoginModal={this.props.toggleLoginModal}
          form={form}
          formConfig={formConfig}
        />
        <SaveFormLink
          locationPathname={location.pathname}
          form={form}
          formConfig={formConfig}
          user={user}
          showLoginModal={this.props.showLoginModal}
          saveAndRedirectToReturnUrl={this.props.saveAndRedirectToReturnUrl}
          toggleLoginModal={this.props.toggleLoginModal}
        >
          {finishAppLaterMessage}
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
  toggleLoginModal,
};

RoutedSavableReviewPage.propTypes = {
  autoSaveForm: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      customText: PropTypes.shape({
        finishAppLaterMessage: PropTypes.string,
        appType: PropTypes.string,
      }),
    }),
  }).isRequired,
  formContext: PropTypes.object.isRequired,
  pageList: PropTypes.array.isRequired,
  path: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
};

RoutedSavableReviewPage.defaultProps = {
  route: {
    formConfig: {
      customText: {
        finishAppLaterMessage: '',
        appType: '',
      },
    },
  },
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(RoutedSavableReviewPage),
);

export { RoutedSavableReviewPage };
