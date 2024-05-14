import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { fromUnixTime } from 'date-fns';
import { format } from 'date-fns-tz';

import scrollToTop from '~/platform/utilities/ui/scrollToTop';
import { focusElement, getScrollOptions } from '~/platform/utilities/ui';
import { savedMessage } from '~/platform/forms-system/src/js/utilities/save-in-progress-messages';

import { fetchInProgressForm, removeInProgressForm } from './actions';
import FormStartControls from './FormStartControls';
import { APP_TYPE_DEFAULT } from '../../forms-system/src/js/constants';

class FormSaved extends React.Component {
  constructor(props) {
    super(props);
    const scrollProps = props.scrollParams || getScrollOptions();
    this.scrollToTop = () => {
      scrollToTop('topScrollElement', scrollProps);
    };
    this.location = props.location || window.location;
  }

  componentDidMount() {
    // if we don’t have this then that means we’re loading the page
    // without any data and should just go back to the intro
    if (!this.props.lastSavedDate) {
      this.props.router.replace(this.props.route.pageList[0].path);
    } else {
      this.scrollToTop();
      focusElement('.usa-alert h2');
    }
  }

  getResumeOnly = () => {
    return this.props.route?.formConfig?.saveInProgress?.resumeOnly;
  };

  render() {
    const { formId, lastSavedDate, expirationMessage } = this.props;
    const { profile } = this.props.user;
    const { verified } = profile;
    const prefillAvailable = !!(
      profile && profile.prefillsAvailable.includes(formId)
    );
    const { success } = this.props.route.formConfig.savedFormMessages || {};
    const expirationDate = this.props.expirationDate
      ? format(fromUnixTime(this.props.expirationDate), 'MMMM d, yyyy')
      : null;
    const appType =
      this.props.route.formConfig?.customText?.appType || APP_TYPE_DEFAULT;

    return (
      <div>
        <va-alert status="info" uswds>
          <div className="usa-alert-body">
            <h2
              slot="headline"
              className="vads-u-font-size--h3 vads-u-margin-y--0"
            >
              {savedMessage(this.props.route.formConfig)}
            </h2>
            <br />
            {!!lastSavedDate &&
              !!expirationDate && (
                <div className="saved-form-metadata-container">
                  <span className="saved-form-metadata">
                    Last saved on{' '}
                    {format(lastSavedDate, "MMMM d, yyyy', at' h:mm aaaa z")}
                  </span>
                  {expirationMessage || (
                    <p className="expires-container">
                      Your saved {appType}{' '}
                      <span className="expires">
                        will expire on {expirationDate}.
                      </span>
                    </p>
                  )}
                </div>
              )}
            {success}
            If you’re on a public computer, please sign out of your account
            before you leave so your information stays secure.
          </div>
        </va-alert>
        {!verified && (
          <va-alert status="warning" uswds class="vads-u-margin-top--2">
            <div className="usa-alert-body">
              We want to keep your information safe with the highest level of
              security. Please{' '}
              <a
                href={`/verify?next=${this.location.pathname}`}
                className="verify-link"
              >
                verify your identity
              </a>
              .
            </div>
          </va-alert>
        )}
        <br />
        <FormStartControls
          startPage={this.props.route.pageList[1].path}
          router={this.props.router}
          formId={this.props.formId}
          returnUrl={this.props.returnUrl}
          migrations={this.props.migrations}
          fetchInProgressForm={this.props.fetchInProgressForm}
          prefillTransformer={this.props.prefillTransformer}
          removeInProgressForm={this.props.removeInProgressForm}
          prefillAvailable={prefillAvailable}
          formSaved
          resumeOnly={this.getResumeOnly()}
        />
      </div>
    );
  }
}

FormSaved.propTypes = {
  expirationDate: PropTypes.number,
  expirationMessage: PropTypes.node,
  fetchInProgressForm: PropTypes.func,
  formId: PropTypes.string,
  lastSavedDate: PropTypes.number,
  location: PropTypes.object,
  migrations: PropTypes.array,
  prefillTransformer: PropTypes.func,
  removeInProgressForm: PropTypes.func,
  returnUrl: PropTypes.string,
  route: PropTypes.shape({
    pageList: PropTypes.arrayOf(
      PropTypes.shape({
        path: PropTypes.string,
      }),
    ),
    formConfig: PropTypes.object.isRequired,
  }),
  router: PropTypes.shape({
    replace: PropTypes.func,
  }),
  scrollParams: PropTypes.object,
  user: PropTypes.shape({
    profile: PropTypes.shape({
      prefillsAvailable: PropTypes.array,
      verified: PropTypes.bool,
    }),
  }),
};

function mapStateToProps(state) {
  return {
    formId: state.form.formId,
    returnUrl: state.form.loadedData.metadata.returnUrl,
    lastSavedDate: state.form.lastSavedDate,
    expirationDate: state.form.expirationDate,
    migrations: state.form.migrations,
    prefillTransformer: state.form.prefillTransformer,
    user: state.user,
  };
}

const mapDispatchToProps = {
  fetchInProgressForm,
  removeInProgressForm,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(FormSaved),
);

export { FormSaved };
