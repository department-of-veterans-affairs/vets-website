import PropTypes from 'prop-types';
import React from 'react';
import appendQuery from 'append-query';
import { connect } from 'react-redux';
import { signInServiceEnabled } from 'platform/user/authentication/selectors';
import { isInProgressPath } from 'platform/forms/helpers';
import { SAVE_STATUSES } from 'platform/forms/save-in-progress/actions';
import {
  toggleFormSignInModal,
  toggleLoginModal,
} from 'platform/site-wide/user-nav/actions';
import { getBackendStatuses } from 'platform/monitoring/external-services/actions';
import recordEvent from '../../../monitoring/record-event';

export const onClickHandler = ({
  context,
  useSignInService,
  analyticsEvent,
  shouldConfirmLeavingForm,
}) => {
  const getNextParameter = () => {
    return new URLSearchParams(window.location.search).get('next');
  };

  const appendOrRemoveParameter = ({
    url = 'loginModal',
    useSiS = true,
  } = {}) => {
    if (url === 'loginModal' && getNextParameter()) {
      toggleLoginModal(true);
    }

    const location = window.location.toString();
    const nextQuery = { next: url, oauth: useSignInService || useSiS };
    const path = useSiS ? location : location.replace('&oauth=true', '');
    const nextPath = appendQuery(path, nextQuery);
    window.location.assign(nextPath);

    return nextQuery;
  };

  const handleSignInSignUp = ({
    signInContext = context,
    googleAnalyticsEvent = analyticsEvent,
    confirmLeavingForm = shouldConfirmLeavingForm,
  }) => {
    if (googleAnalyticsEvent) {
      recordEvent({ googleAnalyticsEvent });
    }
    if (confirmLeavingForm) {
      toggleFormSignInModal(true);
    } else {
      // Make only one upfront request to get all backend statuses to prevent
      // each identity dependency's warning banner from making duplicate
      // requests when the sign-in modal renders.

      getBackendStatuses();
      appendOrRemoveParameter({});
      if (signInContext) {
        toggleLoginModal(true, context);
      }
      toggleLoginModal(true);
    }
  };

  return handleSignInSignUp({
    context,
    analyticsEvent,
    shouldConfirmLeavingForm,
  });
};

export const LoginModalButton = ({
  context,
  shouldConfirmLeavingForm,
  analyticsEvent,
  message = 'Sign in or create an account',
  className,
  dataTestId,
  onClick = onClickHandler,
  ...props
}) => {
  const { useSignInService } = props;
  return (
    <button
      type="button"
      onClick={() =>
        onClick({
          context,
          useSignInService,
          analyticsEvent,
          shouldConfirmLeavingForm,
        })
      }
      className={className}
      data-testId={dataTestId}
    >
      {message}
    </button>
  );
};

const mapStateToProps = state => {
  let formAutoSavedStatus;
  let additionalRoutes;
  let additionalSafePaths;
  const { form } = state;
  if (typeof form === 'object') {
    formAutoSavedStatus = form.autoSavedStatus;
    additionalRoutes = form.additionalRoutes;
    additionalSafePaths =
      additionalRoutes && additionalRoutes.map(route => route.path);
  }
  const shouldConfirmLeavingForm =
    typeof formAutoSavedStatus !== 'undefined' &&
    formAutoSavedStatus !== SAVE_STATUSES.success &&
    isInProgressPath(window.location.pathname, additionalSafePaths);

  return {
    shouldConfirmLeavingForm,
    useSignInService: signInServiceEnabled(state),
    ...state.navigation,
  };
};

const mapDispatchToProps = {
  getBackendStatuses,
  toggleFormSignInModal,
  toggleLoginModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginModalButton);

LoginModalButton.propTypes = {
  analyticsEvent: PropTypes.object,
  className: PropTypes.string,
  context: PropTypes.string,
  dataTestId: PropTypes.string,
  message: PropTypes.string,
  shouldConfirmLeavingForm: PropTypes.bool,
  useSiS: PropTypes.bool,
  useSignInService: PropTypes.bool,
  onClick: PropTypes.func,
};
