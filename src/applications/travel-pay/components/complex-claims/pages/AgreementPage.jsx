import React, { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom-v5-compat';
import { useSelector, useDispatch } from 'react-redux';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import useSetPageTitle from '../../../hooks/useSetPageTitle';
import useSetFocus from '../../../hooks/useSetFocus';
import useRecordPageview from '../../../hooks/useRecordPageview';
import TravelAgreementContent from '../../TravelAgreementContent';
import TravelPayButtonPair from '../../shared/TravelPayButtonPair';
import { submitComplexClaim } from '../../../redux/actions';
import {
  selectComplexClaim,
  selectComplexClaimSubmissionState,
} from '../../../redux/selectors';

const AgreementPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { apptId, claimId } = useParams();
  const { data: claimData } = useSelector(selectComplexClaim);
  const { isSubmitting } = useSelector(selectComplexClaimSubmissionState);
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);
  const [isAgreementError, setIsAgreementError] = useState(false);

  const title = 'Beneficiary travel agreement';

  useSetPageTitle(title);
  useSetFocus();
  useRecordPageview('complex-claims', title);

  const onSubmit = async () => {
    setIsAgreementError(!isAgreementChecked);

    if (isAgreementChecked) {
      try {
        // Submit the complex claim via Redux action
        // Any errors from submission are stored in Redux under:
        //   - complexClaim.claim.submission.error
        await dispatch(submitComplexClaim(claimId, claimData));
        // Navigate to the confirmation page after successful submission
        navigate(`/file-new-claim/${apptId}/${claimId}/confirmation`);
      } catch (error) {
        // Navigate to confimration page on submission failure and show error
        navigate(`/file-new-claim/${apptId}/${claimId}/confirmation`);
      }
    }
  };

  const onBack = () => {
    navigate(`/file-new-claim/${apptId}/${claimId}/review`);
  };

  return (
    <>
      <h1>{title}</h1>
      <p className="vads-u-font-weight--bold vads-u-font-family--sans vads-u-display--inline">
        Penalty statement:
      </p>{' '}
      <p className="vads-u-display--inline">
        There are severe criminal and civil penalties, including a fine,
        imprisonment, or both, for knowingly submitting a false, fictitious, or
        fraudulent claim.
      </p>
      <p>
        By submitting this claim, you agree to the beneficiary travel agreement:
      </p>
      <TravelAgreementContent />
      <VaCheckbox
        data-testid="agreement-checkbox"
        className="vads-u-margin-x--1 vads-u-margin-y--2"
        checked={isAgreementChecked}
        name="accept-agreement"
        description={null}
        error={
          isAgreementError
            ? 'You must accept the beneficiary travel agreement before continuing.'
            : null
        }
        hint={null}
        label="I confirm that the information is true and correct to the best of my knowledge and belief. I’ve read and I accept the beneficiary travel agreement."
        onVaChange={() => setIsAgreementChecked(!isAgreementChecked)}
        required
      />
      <TravelPayButtonPair
        data-testid="agreement-button-pair"
        className="vads-u-margin-top--2"
        continueText="Submit claim"
        backText="Back"
        onContinue={onSubmit}
        onBack={onBack}
        loading={isSubmitting}
        hideContinueButtonArrows
      />
    </>
  );
};

export default AgreementPage;
