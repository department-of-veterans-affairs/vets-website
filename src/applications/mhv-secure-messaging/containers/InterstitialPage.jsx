import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import PropType from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import CrisisLineConnectButton from '../components/CrisisLineConnectButton';
import { Paths, PageTitles } from '../util/constants';
import featureToggles from '../hooks/useFeatureToggles';
import { acceptInterstitial } from '../actions/threadDetails';
import { getRecentRecipients } from '../actions/recipients';
import manifest from '../manifest.json';
import {
  clearPrescription,
  getPrescriptionById,
  setRedirectPath,
} from '../actions/prescription';

const InterstitialPage = props => {
  const { type } = props;
  const history = useHistory();
  const location = useLocation();
  const { mhvSecureMessagingCuratedListFlow } = featureToggles();
  const dispatch = useDispatch();

  const h1Ref = useRef(null);
  const {
    allRecipients,
    recentRecipients,
    noAssociations,
    error: recipientsError,
  } = useSelector(state => state.sm.recipients);

  useEffect(
    () => {
      if (recipientsError || noAssociations) {
        history.push(Paths.INBOX);
      }
    },
    [recipientsError, noAssociations, history],
  );

  useEffect(
    () => {
      if (allRecipients?.length > 0 && recentRecipients === undefined) {
        dispatch(getRecentRecipients(6));
      }
    },
    [dispatch, recentRecipients, allRecipients],
  );

  useEffect(() => {
    focusElement(document.querySelector('h1'));
  }, []);

  document.title = `Only Use Messages For Non-Urgent Needs${
    PageTitles.DEFAULT_PAGE_TITLE_TAG
  }`;

  // Determine the correct destination based on whether recent recipients exist
  // This is used for both the href attribute AND the programmatic navigation
  const getDestinationPath = useCallback(
    (includeRootUrl = false) => {
      const hasRecentRecipients = recentRecipients?.length > 0;

      const path = hasRecentRecipients
        ? Paths.RECENT_CARE_TEAMS
        : `${Paths.COMPOSE}${Paths.SELECT_CARE_TEAM}`;

      return includeRootUrl ? `${manifest.rootUrl}${path}` : path;
    },
    [recentRecipients],
  );

  const handleContinueButton = useCallback(
    event => {
      event?.preventDefault();
      dispatch(acceptInterstitial());
      if (mhvSecureMessagingCuratedListFlow && type !== 'reply') {
        history.push(getDestinationPath());
      }
    },
    [
      history,
      mhvSecureMessagingCuratedListFlow,
      type,
      dispatch,
      getDestinationPath,
    ],
  );

  const handleRedirect = useCallback(
    () => {
      dispatch(acceptInterstitial());
      if (mhvSecureMessagingCuratedListFlow && type !== 'reply') {
        history.push(Paths.RECENT_CARE_TEAMS);
      }
    },
    [history, mhvSecureMessagingCuratedListFlow, type, dispatch],
  );

  useEffect(
    () => {
      const searchParams = new URLSearchParams(location.search);
      const prescriptionId = searchParams.get('prescriptionId');
      const redirectPath = searchParams.get('redirectPath');
      if (prescriptionId) {
        dispatch(getPrescriptionById(prescriptionId));
        handleRedirect();
      } else {
        dispatch(clearPrescription());
      }
      if (redirectPath) {
        dispatch(setRedirectPath(decodeURIComponent(redirectPath)));
      }
    },
    [location.search, handleRedirect, dispatch],
  );

  const continueButtonText = useMemo(
    () => {
      switch (type) {
        case 'reply':
          return 'Continue to reply';
        case 'draft':
          return 'Continue to draft';
        default:
          return 'Continue to start message';
      }
    },
    [type],
  );

  return (
    <div className="interstitial-page">
      <h1 className="vads-u-margin-bottom--2" ref={h1Ref}>
        Only use messages for <span className="no-word-wrap">non-urgent</span>{' '}
        needs
      </h1>
      <div>
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--3">
          Your care team may take up to <strong>3 business days</strong> to
          reply.
        </p>
        {mhvSecureMessagingCuratedListFlow ? (
          <va-link-action
            href={getDestinationPath(true)}
            onClick={handleContinueButton}
            text={continueButtonText}
            type="primary"
            data-testid="start-message-link"
            data-dd-action-name={`${continueButtonText} button on Interstitial Page`}
          />
        ) : (
          <va-button
            text={continueButtonText}
            data-testid="continue-button"
            onClick={handleContinueButton}
            data-dd-action-name={`${continueButtonText} button on Interstitial Page`}
          />
        )}
        <h2 className="vads-u-font-size--h3 vads-u-margin-top--3 vads-u-margin-bottom--2">
          If you need help sooner, use one of these urgent communications
          options:
        </h2>
        <ul className="vads-u-margin--0">
          <li className="vads-u-margin--0">
            <p className="vads-u-margin-top--0 vads-u-margin-bottom--1p5">
              <strong>
                If you’re in crisis or having thoughts of suicide,{' '}
              </strong>{' '}
              connect with our Veterans Crisis Line. We offer confidential
              support anytime, day or night.
            </p>

            <CrisisLineConnectButton />
          </li>
          <li className="vads-u-margin--0">
            <p className="vads-u-margin-top--1p5 vads-u-margin-bottom--0">
              <strong>If you think your life or health is in danger, </strong>
              {` call `}
              <va-telephone
                contact="911"
                data-dd-action-name="911 link on Interstital Page"
              />
              {` or go to the nearest emergency room.`}
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

InterstitialPage.propTypes = {
  type: PropType.string,
};

export default InterstitialPage;
