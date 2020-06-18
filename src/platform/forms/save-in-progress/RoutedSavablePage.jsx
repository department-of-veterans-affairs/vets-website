import { setData, uploadFile } from 'platform/forms-system/src/js/actions';
import { FormPage } from 'platform/forms-system/src/js/containers/FormPage';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { toggleLoginModal } from '../../site-wide/user-nav/actions';
import debounce from '../../utilities/data/debounce';
import {
  autoSaveForm,
  saveAndRedirectToReturnUrl,
  saveErrors,
} from './actions';
import { FINISH_APP_LATER_DEFAULT_MESSAGE } from './constants';
import SaveFormLink from './SaveFormLink';
import SaveStatus from './SaveStatus';
import { getFormContext } from './selectors';

class RoutedSavablePage extends React.Component {
  constructor(props) {
    super(props);
    this.debouncedAutoSave = debounce(1000, this.autoSave);
  }

  onChange = formData => {
    this.props.setData(formData);
    this.debouncedAutoSave();
  };

  autoSave() {
    const { form, user } = this.props;
    if (user.login.currentlyLoggedIn) {
      const data = form.data;
      const { formId, version } = form;
      const returnUrl = this.props.location.pathname;

      this.props.autoSaveForm(formId, data, version, returnUrl);
    }
  }

  render() {
    const { user, form, formConfig } = this.props;
    const contentAfterButtons = (
      <div>
        <SaveStatus
          isLoggedIn={user.login.currentlyLoggedIn}
          showLoginModal={this.props.showLoginModal}
          toggleLoginModal={this.props.toggleLoginModal}
          form={form}
          formConfig={formConfig}
        />
        <SaveFormLink
          locationPathname={this.props.location.pathname}
          form={form}
          user={user}
          showLoginModal={this.props.showLoginModal}
          saveAndRedirectToReturnUrl={this.props.saveAndRedirectToReturnUrl}
          toggleLoginModal={this.props.toggleLoginModal}
        >
          {formConfig.savedFormMessages.finishAppLaterMessage ||
            FINISH_APP_LATER_DEFAULT_MESSAGE}
        </SaveFormLink>
      </div>
    );

    return (
      <FormPage
        {...this.props}
        blockScrollOnMount={saveErrors.has(form.savedStatus)}
        setData={this.onChange}
        formContext={getFormContext({ user, form })}
        contentAfterButtons={contentAfterButtons}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { appStateSelector } = ownProps.route.pageConfig;
  return {
    form: state.form,
    user: state.user,
    showLoginModal: state.navigation.showLoginModal,
    appStateData: appStateSelector && appStateSelector(state),
    formConfig: ownProps.route.formConfig,
  };
}

const mapDispatchToProps = {
  setData,
  saveAndRedirectToReturnUrl,
  autoSaveForm,
  toggleLoginModal,
  uploadFile,
};

RoutedSavablePage.propTypes = {
  form: PropTypes.object.isRequired,
  route: PropTypes.shape({
    pageConfig: PropTypes.shape({
      pageKey: PropTypes.string.isRequired,
      schema: PropTypes.object.isRequired,
      uiSchema: PropTypes.object.isRequired,
    }),
    pageList: PropTypes.arrayOf(
      PropTypes.shape({
        path: PropTypes.string.isRequired,
      }),
    ),
  }),
  setData: PropTypes.func,
  formConfig: PropTypes.shape({
    savedFormMessages: PropTypes.shape({
      finishAppLaterMessage: PropTypes.string,
    }),
  }).isRequired,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(RoutedSavablePage),
);

export { RoutedSavablePage };
