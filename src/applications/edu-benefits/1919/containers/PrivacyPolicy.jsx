import React, { useState, useEffect } from 'react';
import { querySelectorWithShadowRoot } from 'platform/utilities/ui/webComponents';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { isLoggedIn } from 'platform/user/selectors';
import { getTitle } from '../helpers';
import PrivacyActStatement from '../components/PrivacyActStatement';

const PrivacyPolicy = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const formData = useSelector(state => state.form.data);
  const title = getTitle(formData?.certifyingOfficial?.role);
  const isAuthenticated = useSelector(state => isLoggedIn(state));

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
    <div>
      <p>
        I certify that my entries are true and correct to the best of my
        knowledge. I agree to immediately notify the VA of any potential
        violations of the above prohibitions. I further acknowledge that this
        certification must be completed by a certifying official, owner,
        officer, or another individual in an official capacity, such as the
        President or Chief Administrative Officer of the institution.
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
          text="privacy policy."
          aria-label="View the privacy policy"
          role="button"
          tabIndex="0"
        />
      </span>
      <p className="vads-u-margin-bottom--0">Your title</p>
      <strong>
        <p className="vads-u-font-size--h3 vads-u-margin-top--0">{title}</p>
      </strong>
      <VaModal
        modalTitle="Privacy Act Statement"
        onCloseEvent={() => setShowModal(!showModal)}
        visible={showModal}
        large
      >
        <PrivacyActStatement showRespondentBurden={false} />
      </VaModal>
    </div>
  );
};

export default PrivacyPolicy;
