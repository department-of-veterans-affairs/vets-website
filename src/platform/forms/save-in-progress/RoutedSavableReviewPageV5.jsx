import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import ReviewChapters from 'platform/forms-system/src/js/review/ReviewChaptersV5';
import SubmitController from 'platform/forms-system/src/js/review/SubmitControllerV5';

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
    focusElement('h2');
  }

  autoSave = () => {
    const { form, user } = this.props;
    if (user.login.currentlyLoggedIn) {
      const { data } = form;
      const { formId, version, submission } = form;
      const returnUrl = this.props.location.pathname;

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
  formContext: PropTypes.object.isRequired,
  pageList: PropTypes.array.isRequired,
  path: PropTypes.string.isRequired,
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      customText: PropTypes.shape({
        finishAppLaterMessage: PropTypes.string,
        appType: PropTypes.string,
      }),
    }),
  }).isRequired,
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
