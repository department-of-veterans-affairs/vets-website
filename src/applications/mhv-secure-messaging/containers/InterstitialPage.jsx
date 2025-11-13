import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import PropType from 'prop-types';
import { useDispatch } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import CrisisLineConnectButton from '../components/CrisisLineConnectButton';
import { Paths, PageTitles } from '../util/constants';
import featureToggles from '../hooks/useFeatureToggles';
import { acceptInterstitial } from '../actions/threadDetails';
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

  useEffect(() => {
    focusElement(document.querySelector('h1'));
  }, []);

  document.title = `Only Use Messages For Non-Urgent Needs${
    PageTitles.DEFAULT_PAGE_TITLE_TAG
  }`;

  const handleContinueButton = useCallback(
    () => {
      dispatch(acceptInterstitial());
      if (mhvSecureMessagingCuratedListFlow && type !== 'reply') {
        history.push(`${Paths.RECENT_CARE_TEAMS}`);
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
        handleContinueButton();
      } else {
        dispatch(clearPrescription());
      }
      if (redirectPath) {
        dispatch(setRedirectPath(decodeURIComponent(redirectPath)));
      }
    },
    [location.search, handleContinueButton, dispatch],
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

        <button
          className="continue-button vads-u-padding-y--1p5 vads-u-padding-x--2p5 vads-u-margin-top--0 vads-u-margin-bottom--3"
          data-testid="continue-button"
          onClick={handleContinueButton}
          data-dd-action-name={`${continueButtonText} button on Interstitial Page`}
        >
          {continueButtonText}
          <span className="sr-only">. Page content will change.</span>
        </button>

        <h2 className="vads-u-font-size--h3 vads-u-margin-top--0 vads-u-margin-bottom--2">
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
