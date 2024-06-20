import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { requestStates } from 'platform/utilities/constants';

import ITFBanner from '../components/ITFBanner';
import { ITF_STATUSES } from '../constants';
import { createITF, fetchITF } from '../actions';
import { isActiveITF, isSupportedBenefitType } from '../utils/itf';
import { isOutsideForm } from '../../shared/utils/helpers';

const fetchWaitingStates = [requestStates.notCalled, requestStates.pending];

const showLoading = (message, label) => (
  <va-loading-indicator set-focus message={message} label={label} />
);

const ITFWrapper = ({
  loggedIn,
  benefitType,
  pathname,
  children,
  mockDispatch,
  router,
  accountUuid,
  inProgressFormId,
}) => {
  const allowITF = loggedIn && isSupportedBenefitType(benefitType);
  const [isFetching, setIsFetching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const dispatch = useDispatch();
  const itf = useSelector(state => state.itf || {});

  // When we first enter the form...
  useEffect(
    () => {
      const hasActiveITF = isActiveITF(itf.currentITF);
      const createITFCalled =
        hasActiveITF && itf.creationCallState !== requestStates.notCalled;
      // ...fetch the ITF
      if (
        allowITF &&
        !isFetching &&
        !isOutsideForm(pathname) &&
        itf.fetchCallState === requestStates.notCalled
      ) {
        setIsFetching(true);
        fetchITF({ accountUuid, inProgressFormId })(mockDispatch || dispatch);
      } else if (
        allowITF &&
        !isCreating &&
        !hasActiveITF &&
        !createITFCalled &&
        // If we've already fetched the ITFs, have none active, and haven't already
        // called createITF, submit a new ITF
        (itf.fetchCallState === requestStates.succeeded ||
          itf.fetchCallState === requestStates.failed)
      ) {
        setIsCreating(true);
        createITF({ accountUuid, benefitType, inProgressFormId })(
          mockDispatch || dispatch,
        );
      }
    },
    [
      accountUuid,
      allowITF,
      benefitType,
      dispatch,
      inProgressFormId,
      isCreating,
      isFetching,
      itf,
      pathname,
      mockDispatch,
    ],
  );

  if (!allowITF || isOutsideForm(pathname)) {
    return children;
  }

  if (fetchWaitingStates.includes(itf.fetchCallState)) {
    // If we get here, we've called fetchITF; While we're waiting, show the
    // loading indicator...
    return showLoading(
      'Please wait while we check to see if you have an existing Intent to File.',
      'looking for an intent to file',
    );
  }

  if (itf.fetchCallState === requestStates.failed) {
    // We'll get here after the fetchITF promise is fulfilled
    // render children to allow testing in non-production environment
    return (
      <ITFBanner status="error" router={router}>
        {children}
      </ITFBanner>
    );
  }

  if (itf?.currentITF?.status === ITF_STATUSES.active) {
    const status =
      itf.creationCallState === 'succeeded' ? 'itf-created' : 'itf-found';
    const { expirationDate: currentExpDate } = itf.currentITF;

    if (itf.previousITF) {
      const { expirationDate: prevExpDate } = itf.previousITF;
      // If there was a previous ITF, we created one; show the creation
      // success message
      return (
        <ITFBanner
          status={status}
          previousITF={itf.previousITF}
          currentExpDate={currentExpDate}
          previousExpDate={prevExpDate}
          router={router}
        >
          {children}
        </ITFBanner>
      );
    }

    // Else we fetched an active ITF
    return (
      <ITFBanner
        status={status}
        currentExpDate={currentExpDate}
        router={router}
      >
        {children}
      </ITFBanner>
    );
  }

  if (fetchWaitingStates.includes(itf.creationCallState)) {
    // createITF was called, but there was no active ITF found; While we're
    // waiting (again), show the loading indicator...again
    return showLoading(
      'Submitting a new Intent to File...',
      'submitting a new intent to file',
    );
  }

  // We'll get here after the createITF promise is fulfilled and we have no
  // active ITF because of a failed creation call. Render children after alerting
  // next steps to the Veteran
  return (
    <ITFBanner status="error" router={router}>
      {children}
    </ITFBanner>
  );
};

const requestStateEnum = Object.values(requestStates);

const itfShape = {
  id: PropTypes.string,
  creationDate: PropTypes.string,
  expirationDate: PropTypes.string.isRequired,
  participantId: PropTypes.number,
  source: PropTypes.string,
  status: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

ITFWrapper.propTypes = {
  children: PropTypes.any.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  pathname: PropTypes.string.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  accountUuid: PropTypes.string,
  benefitType: PropTypes.string,
  inProgressFormId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  itf: PropTypes.shape({
    fetchCallState: PropTypes.oneOf(requestStateEnum).isRequired,
    creationCallState: PropTypes.oneOf(requestStateEnum).isRequired,
    currentITF: PropTypes.shape(itfShape),
    previousITF: PropTypes.shape(itfShape),
  }),
  mockDispatch: PropTypes.func,
};

export default ITFWrapper;
