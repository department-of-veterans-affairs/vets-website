import React, { useState } from 'react';
import {
  VaRadio,
  VaRadioOption,
  VaButton,
  VaCheckbox,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from 'platform/user/selectors';
import { submitCh31CaseMilestones } from '../actions/ch31-case-milestones';
import {
  CH31_CASE_MILESTONES_RESET_STATE,
  MILESTONE_COMPLETION_TYPES,
} from '../constants';

const ORIENTATION_TYPE = {
  WATCH_VIDEO: 'Watch the VA Orientation Video online',
  COMPLETE_DURING_MEETING:
    'Complete orientation during the Initial Evaluation Counselor Meeting',
};

const preferenceRadioGroupName = 'orientation_type_preference';

export default function SelectPreferenceView() {
  const [orientationTypeRadioValue, setOrientationTypeRadioValue] = useState();
  const [attestationChecked, setAttestationChecked] = useState(false);
  const [checkboxError, setCheckboxError] = useState(false);
  const user = useSelector(selectUser);

  const ch31CaseMilestonesState = useSelector(
    state => state?.ch31CaseMilestones,
  );
  const dispatch = useDispatch();

  const submitAttestation = () => {
    if (
      orientationTypeRadioValue === ORIENTATION_TYPE.WATCH_VIDEO &&
      !attestationChecked
    ) {
      setCheckboxError(true);
      return;
    }

    dispatch(
      submitCh31CaseMilestones({
        milestoneCompletionType: MILESTONE_COMPLETION_TYPES.STEP_3,
        user,
      }),
    );
  };

  const errorAlert = (
    <va-alert class="vads-u-margin-bottom--1" status="error" visible slim>
      <p className="vads-u-margin-y--0">
        We’re sorry. Something went wrong on our end while submitting your
        preference. Please try again later.
      </p>
    </va-alert>
  );

  const submitBtn = (
    <VaButton
      loading={ch31CaseMilestonesState?.loading}
      onClick={submitAttestation}
      text="Submit"
    />
  );

  return (
    <>
      <p>
        You will need to complete your Orientation by either scheduling a
        meeting with your local RO, or by watching online the VA Orientation
        Video.
      </p>
      <p>
        Which is your preferred course of action? Please, make your selection:
      </p>
      <VaRadio
        label="My preference is to:"
        onVaValueChange={e => {
          setOrientationTypeRadioValue(e.detail.value);
          setCheckboxError(false);
          setAttestationChecked(false);
          dispatch({ type: CH31_CASE_MILESTONES_RESET_STATE });
        }}
      >
        <VaRadioOption
          label={ORIENTATION_TYPE.WATCH_VIDEO}
          name={preferenceRadioGroupName}
          value={ORIENTATION_TYPE.WATCH_VIDEO}
        />
        {orientationTypeRadioValue === ORIENTATION_TYPE.WATCH_VIDEO && (
          <div className="vads-u-margin-left--4">
            <p>
              VR&E services can help Veterans with job training, employment
              accommodations, resume development, and coaching. Please watch the
              full video and self-certify upon completion.
            </p>
            <p>
              <va-link channel href="https://www.va.gov" text="Link" />
            </p>
            <VaCheckbox
              checkboxDescription="Please check the box above if you have watched the Video Tutorial provided."
              label="I acknowledge and attest that I have watched and understand the five Paths for Career Planning."
              checked={attestationChecked}
              required
              error={
                checkboxError
                  ? 'You must acknowledge and attest that you have watched the video.'
                  : undefined
              }
              onVaChange={e => {
                setAttestationChecked(e.target.checked);
                setCheckboxError(false);
                dispatch({ type: CH31_CASE_MILESTONES_RESET_STATE });
              }}
            />
            {ch31CaseMilestonesState?.error && errorAlert}
            {submitBtn}
          </div>
        )}
        <VaRadioOption
          label={ORIENTATION_TYPE.COMPLETE_DURING_MEETING}
          name={preferenceRadioGroupName}
          value={ORIENTATION_TYPE.COMPLETE_DURING_MEETING}
        />
        {orientationTypeRadioValue ===
          ORIENTATION_TYPE.COMPLETE_DURING_MEETING && (
          <div className="vads-u-margin-left--4">
            {ch31CaseMilestonesState?.error && errorAlert}
            {submitBtn}
          </div>
        )}
      </VaRadio>
    </>
  );
}
