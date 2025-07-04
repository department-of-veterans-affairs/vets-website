import React from 'react';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useSelector, useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';

const AdditionalOfficialExemptInfo = props => {
  const formState = useSelector(state => state?.form?.data);
  const dispatch = useDispatch();

  return (
    <div className="vads-u-border-color--primary-alt-light vads-u-border--1px vads-u-margin-top--5 info ">
      <h4 className="vads-u-padding-top--0 vads-u-padding-x--3">
        Who is exempt from Section 305 training requirements?
      </h4>
      <div className="vads-u-margin-y--2 vads-u-padding-x--3">
        <ul>
          <li>
            Existing SCOs at a school not currently identified as a "covered
            educational institution."{' '}
            <va-link
              external
              text="Get more information about covered institutions"
              href="https://www.benefits.va.gov/gibill/resources/education_resources/school_certifying_officials/covered-educational-institutions.asp"
            />
          </li>
          <li>
            Transferring SCOs from the same type of school (IHL, NCD, OJT/APP,
            FLT) who have completed the training requirement within the current
            training year.
          </li>
          <li>New designees at schools offering ONLY high school diplomas.</li>
        </ul>
      </div>
      <VaCheckbox
        checked={props.formData}
        onVaChange={event => {
          dispatch(
            setData({
              ...formState,
              'additional-certifying-official': formState[
                'additional-certifying-official'
              ].map((official, index) => {
                if (index !== Number(props.formContext.pagePerItemIndex)) {
                  return official;
                }
                return {
                  ...official,
                  additionalOfficialTraining: {
                    ...official.additionalOfficialTraining,
                    trainingExempt: event.target.checked,
                  },
                };
              }),
            }),
          );
        }}
        label="This individual is exempt"
        className="vads-u-margin-y--2 vads-u-padding-x--3"
      />
    </div>
  );
};

export default AdditionalOfficialExemptInfo;
