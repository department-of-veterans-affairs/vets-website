import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { FormPage } from 'platform/forms-system/src/js/containers/FormPage';
import { setData, uploadFile } from 'platform/forms-system/src/js/actions';

import debounce from '../../utilities/data/debounce';

import SaveFormLink from './SaveFormLink';
import SaveStatus from './SaveStatus';
import {
  saveErrors,
  autoSaveForm,
  saveAndRedirectToReturnUrl,
} from './actions';
import { getFormContext } from './selectors';
import { FINISH_APP_LATER_DEFAULT_MESSAGE } from '../../forms-system/src/js/constants';

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
      const { data } = form;
      const { formId, version, submission } = form;
      const returnUrl = this.props.location.pathname;
      this.props.autoSaveForm(formId, data, version, returnUrl, submission);
    }
  }

  render() {
    const { user, form, formConfig, route } = this.props;
    const finishAppLaterMessage =
      formConfig?.customText?.finishAppLaterMessage ||
      FINISH_APP_LATER_DEFAULT_MESSAGE;
    const contentBeforeButtons = (
      <SaveFormLink
        locationPathname={this.props.location.pathname}
        form={form}
        formConfig={formConfig}
        route={route}
        pageList={route.pageList}
        user={user}
        saveAndRedirectToReturnUrl={this.props.saveAndRedirectToReturnUrl}
      >
        {finishAppLaterMessage}
      </SaveFormLink>
    );
    const contentAfterButtons = (
      <SaveStatus
        isLoggedIn={user.login.currentlyLoggedIn}
        form={form}
        formConfig={formConfig}
      />
    );

    return (
      <FormPage
        {...this.props}
        blockScrollOnMount={saveErrors.has(form.savedStatus)}
        setData={this.onChange}
        formContext={getFormContext({ user, form })}
        contentBeforeButtons={contentBeforeButtons}
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
    customText: PropTypes.shape({
      finishAppLaterMessage: PropTypes.string,
    }),
  }),
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(RoutedSavablePage),
);

export { RoutedSavablePage };
