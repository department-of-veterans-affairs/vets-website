import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import ReviewChapters from 'platform/forms-system/src/js/review/ReviewChapters';
import SubmitController from 'platform/forms-system/src/js/review/SubmitController';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement, getScrollOptions } from 'platform/utilities/ui';

import DowntimeNotification, {
  externalServiceStatus,
} from '../../monitoring/DowntimeNotification';
import get from '../../utilities/data/get';
import debounce from '../../utilities/data/debounce';
import { toggleLoginModal } from '../../site-wide/user-nav/actions';
import SaveStatus from './SaveStatus';
import { autoSaveForm } from './actions';
import { getFormContext } from './selectors';
import DowntimeMessage from './DowntimeMessage';

class RoutedSavableReviewPage extends React.Component {
  constructor(props) {
    super(props);
    this.debouncedAutoSave = debounce(1000, this.autoSave);
  }

  componentDidMount() {
    scrollToTop('topScrollElement', getScrollOptions());
    // The first h2 is the breadcrumb "Step 1 of..." which is a chapter
    // containing multiple pages, so the h2 won't be unique between pages
    focusElement('h2');
  }

  autoSave = () => {
    const { form, user, route } = this.props;
    if (user.login.currentlyLoggedIn) {
      const { data } = form;
      const { formId, version, submission } = form;
      const returnUrl =
        route.pageConfig?.returnUrl || this.props.location.pathname;

      this.props.autoSaveForm(formId, data, version, returnUrl, submission);
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
    const { form, formConfig, formContext, pageList, path, user } = this.props;
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
          customText={formConfig.customText}
        >
          <SubmitController
            formConfig={formConfig}
            pageList={pageList}
            path={path}
          />
        </DowntimeNotification>
        <SaveStatus
          isLoggedIn={user.login.currentlyLoggedIn}
          showLoginModal={this.props.showLoginModal}
          toggleLoginModal={this.props.toggleLoginModal}
          form={form}
          formConfig={formConfig}
        />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { route } = ownProps;
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
  toggleLoginModal,
};

RoutedSavableReviewPage.propTypes = {
  autoSaveForm: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  formConfig: PropTypes.shape({
    customText: PropTypes.shape({
      finishAppLaterMessage: PropTypes.string,
      appType: PropTypes.string,
    }),
    downtime: PropTypes.shape({
      message: PropTypes.string,
    }),
  }).isRequired,
  formContext: PropTypes.object.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  pageList: PropTypes.array.isRequired,
  path: PropTypes.string.isRequired,
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      customText: PropTypes.shape({
        finishAppLaterMessage: PropTypes.string,
        appType: PropTypes.string,
      }),
      downtime: PropTypes.shape({
        message: PropTypes.string,
      }),
    }),
    pageConfig: PropTypes.shape({
      returnUrl: PropTypes.string,
    }),
  }).isRequired,
  showLoginModal: PropTypes.bool.isRequired,
  toggleLoginModal: PropTypes.func.isRequired,
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
