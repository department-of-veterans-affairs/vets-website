import React, { useEffect, useState } from 'react';
import { querySelectorWithShadowRoot } from 'platform/utilities/ui/webComponents';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { isLoggedIn } from 'platform/user/selectors';
import { capitalizeFirstLetter } from '../helpers';

import PrivacyActStatement from './PrivacyActStatement';

const PrivacyPolicy = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const formData = useSelector(state => state?.form?.data ?? {});
  const isAuthenticated = useSelector(state => isLoggedIn(state));

  const title = formData?.authorizedOfficial?.title;

  useEffect(
    () => {
      // add authentication field to *formData* before transform
      dispatch(setData({ ...formData, isAuthenticated }));
    },
    [isAuthenticated],
  );

  const removeNoteText = async () => {
    const noteText = await querySelectorWithShadowRoot(
      'p.font-sans-6',
      document.querySelector('va-statement-of-truth'),
    );
    noteText?.setAttribute('style', 'display:none;');
  };

  const removeOldPrivacyPolicy = async () => {
    const privacyPolicyText = await querySelectorWithShadowRoot(
      'p.short-line',
      document.querySelector('va-statement-of-truth'),
    );
    privacyPolicyText?.setAttribute('style', 'display:none;');
  };

  useEffect(() => {
    const initializeComponent = async () => {
      // Hide "Note" above Certification statement
      await removeNoteText();
      // Hide platform line for privacy policy, use custom
      await removeOldPrivacyPolicy();
    };

    initializeComponent();
  }, []);

  return (
    <>
      <p>
        I certify that my entries are true and correct to the best of my
        knowledge. I acknowledge that:
      </p>
      <ul>
        <li>
          This agreement will be valid for the full academic year starting
          August 1, unless my institution notifies VA of changes during an open
          enrollment period.
        </li>
        <li>
          The agreement must be signed by an official who is legally authorized
          to bind the school, such as the President, Chief Administrative
          Officer, or an equivalent official. It cannot be signed by the SCO or
          other personnel unless they hold one of these titles. The signed
          agreement must be submitted to VA by May 15, or the following Monday
          if May 15 falls on a weekend. Late submissions will not be accepted.
        </li>
        <li>
          At least one of my school’s programs must be approved for VA benefits
          and must include tuition or fees that exceed what the GI Bill covers.
        </li>
      </ul>
      <p>
        {' '}
        The terms of this agreement are available for public viewing on the{' '}
        <va-link
          href="https://benefits.va.gov/gibill/yellow_ribbon/yellow_ribbon_info_schools.asp"
          text="VA GI Bill website"
          external
        />
      </p>
      <span data-testid="privacy-policy-text">
        I have read and accept the{' '}
        <va-link
          onClick={() => setShowModal(true)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              setShowModal(true);
            }
          }}
          text="privacy policy"
          aria-label="View the privacy policy"
          role="button"
          tabIndex="0"
        />
        .
      </span>
      <p className="vads-u-margin-bottom--0">Your title</p>
      <strong>
        <p className="vads-u-font-size--h3 vads-u-margin-top--0">
          {capitalizeFirstLetter(title)}
        </p>
      </strong>
      <VaModal
        modalTitle="Privacy Act Statement"
        onCloseEvent={() => setShowModal(!showModal)}
        visible={showModal}
        large
      >
        <PrivacyActStatement />
      </VaModal>
    </>
  );
};

export default PrivacyPolicy;
