import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Scroll from 'react-scroll';

import debounce from '../../utilities/data/debounce';

import ReviewChapters from 'us-forms-system/lib/js/review/ReviewChapters';
import SubmitController from 'us-forms-system/lib/js/review/SubmitController';
import CallHelpDesk from '../../brand-consolidation/components/CallHelpDesk';

import isBrandConsolidationEnabled from '../../brand-consolidation/feature-flag';
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

const brandConsolidationIsEnabled = isBrandConsolidationEnabled();
const propertyName = brandConsolidationIsEnabled ? 'VA.gov' : 'Vets.gov';
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

class RoutedSavableReviewPage extends React.Component {
  constructor(props) {
    super(props);
    this.debouncedAutoSave = debounce(1000, this.autoSave);
  }

  componentDidMount() {
    scrollToTop();
    focusElement('h4');
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

    const saveLink = (
      <SaveFormLink
        locationPathname={location.pathname}
        form={form}
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
          If it still doesn’t work, please{' '}
          <CallHelpDesk>
            call the {propertyName} Help Desk at{' '}
            <a href="tel:855-574-7286">1-855-574-7286</a> (TTY:{' '}
            <a href="tel:18008778339">1-800-877-8339</a>
            ). We’re here Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m.
            (ET).
          </CallHelpDesk>
        </p>
      );
    }

    return (
      <div className="usa-alert usa-alert-error schemaform-failure-alert">
        <div className="usa-alert-body">
          <p className="schemaform-warning-header">
            <strong>We’re sorry. We can't submit your form right now.</strong>
          </p>
          <p>
            We’re working to fix the problem. Please make sure you’re connected
            to the Internet, and then try saving your form again. {saveLink}.
          </p>
          {!user.login.currentlyLoggedIn && (
            <p>
              If you don’t have an account, you’ll have to start over. Try
              submitting your form again tomorrow.
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
        />
        <SaveFormLink
          locationPathname={location.pathname}
          form={form}
          user={user}
          showLoginModal={this.props.showLoginModal}
          saveAndRedirectToReturnUrl={this.props.saveAndRedirectToReturnUrl}
          toggleLoginModal={this.props.toggleLoginModal}
        />
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
    pageList,
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
