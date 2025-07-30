import React, { useState, useEffect } from 'react';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useSelector, useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';

const PrimaryOfficialBenefitsDisclaimer = ({ required, ...props }) => {
  const formState = useSelector(state => state?.form?.data);
  const dispatch = useDispatch();

  const [checkboxError, setCheckboxError] = useState(null);

  useEffect(
    () => {
      setCheckboxError(
        required && !props.formData
          ? 'Please check the box before proceeding'
          : null,
      );
    },
    [required, !props.formData],
  );

  return (
    <div className="vads-u-border-color--primary-alt-light vads-u-border--1px vads-u-margin-top--5 info">
      <div className="vads-u-padding-top--0 vads-u-padding-x--3">
        <p>
          VA will not pay VA benefits for enrollment in a course certified by
          the individual taking the course. During compliance survey, the
          records of any individuals listed in this form who are receiving VA
          benefits at this facility will be reviewed.
        </p>
        <p>
          <strong>Note:</strong> Another SCO at this facility will need to
          submit any enrollment certificate and changes for this individual.
        </p>
      </div>
      <VaCheckbox
        checked={props.formData}
        onVaChange={event => {
          dispatch(
            setData({
              ...formState,
              primaryOfficialBenefitStatus: {
                ...formState.primaryOfficialBenefitStatus,
                'view:benefitsDisclaimer': event.target.checked
                  ? true
                  : undefined,
              },
            }),
          );
        }}
        error={props?.formContext?.submitted ? checkboxError : null}
        required
        label="I understand"
        className={
          props?.formContext?.submitted && checkboxError
            ? 'vads-u-margin-y--2 vads-u-padding-x--3 vads-u-margin-left--2p5'
            : 'vads-u-margin-y--2 vads-u-padding-x--3'
        }
      />
    </div>
  );
};

export default PrimaryOfficialBenefitsDisclaimer;
