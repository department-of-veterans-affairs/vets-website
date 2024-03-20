import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import { setData } from 'platform/forms-system/src/js/actions';
import { focusElement } from 'platform/utilities/ui';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import ReviewPageNavigationAlert from '../alerts/ReviewPageNavigationAlert';
import {
  clearJobIndex,
  setJobButton,
  clearJobButton,
  jobButtonConstants,
} from '../../utils/session';
import { getGMT } from '../../actions/geographicMeansThreshold';

const EmploymentQuestion = props => {
  const {
    data,
    goBack,
    goToPath,
    setFormData,
    contentBeforeButtons,
    contentAfterButtons,
  } = props;

  const dispatch = useDispatch();
  const headerRef = useRef(null);
  const [hasJobToAdd, setHasJobToAdd] = useState(
    data.questions?.vetIsEmployed ?? false,
  );

  const {
    reviewNavigation = false,
    'view:reviewPageNavigationToggle': showReviewNavigation,
  } = data;

  const hasJobs =
    data.personalData?.employmentHistory?.veteran?.employmentRecords;

  useEffect(
    () => {
      if (headerRef?.current) {
        focusElement(headerRef?.current);
      }
    },
    [headerRef],
  );

  useEffect(() => {
    clearJobIndex();
    clearJobButton();
  }, []);

  useEffect(
    () => {
      setFormData({
        ...data,
        questions: {
          ...data?.questions,
          vetIsEmployed: hasJobToAdd,
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasJobToAdd],
  );

  // useEffect to get GMT data
  useEffect(() => {
    const fetchData = async () => {
      const year = 2023;
      const { hasDependents = 0 } = data?.questions;
      const dependents = parseInt(hasDependents, 10);

      const {
        zipCode,
      } = data?.personalData?.veteranContactInformation?.address;

      const gmtResponse = await getGMT(dependents, year, zipCode);

      dispatch(
        setData({
          ...data,
          gmtData: {
            ...data.gmtData,
            ...gmtResponse,
          },
        }),
      );
    };

    if (data['view:streamlinedWaiver']) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goForward = () => {
    if (hasJobToAdd) {
      if (!hasJobs?.length) {
        setJobButton(jobButtonConstants.FIRST_JOB);
      }

      const path = hasJobs
        ? '/employment-history'
        : '/enhanced-employment-records';
      goToPath(path);
    } else {
      goToPath('/your-benefits');
    }
  };

  const onSelection = event => {
    const { value } = event?.detail || {};
    if (value === undefined) return;
    setHasJobToAdd(value === 'true');
  };

  const handleBackNavigation = () => {
    if (reviewNavigation) {
      dispatch(
        setData({
          ...data,
          reviewNavigation: false,
        }),
      );
      goToPath('/review-and-submit');
    } else {
      goBack();
    }
  };

  return (
    <form>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0" ref={headerRef}>
            Your work history
          </h3>
        </legend>
        {reviewNavigation && showReviewNavigation ? (
          <ReviewPageNavigationAlert data={data} title="household income" />
        ) : null}
        <VaRadio
          class="vads-u-margin-y--2"
          label="Have you had any jobs in the last 2 years?"
          onVaValueChange={onSelection}
          required
          uswds
        >
          <va-radio-option
            id="has-job"
            label="Yes"
            value="true"
            checked={hasJobToAdd}
            uswds
          />
          <va-radio-option
            id="has-no-job"
            label="No"
            value="false"
            name="primary"
            checked={!hasJobToAdd}
            uswds
          />
        </VaRadio>
        {contentBeforeButtons}
        <FormNavButtons
          goBack={handleBackNavigation}
          goForward={goForward}
          submitToContinue
        />
        {contentAfterButtons}
      </fieldset>
    </form>
  );
};

EmploymentQuestion.propTypes = {
  data: PropTypes.shape({
    'view:streamlinedWaiver': PropTypes.bool,
    gmtData: PropTypes.object,
    personalData: PropTypes.shape({
      veteranContactInformation: PropTypes.shape({
        address: PropTypes.shape({
          zipCode: PropTypes.string,
        }),
      }),
      employmentHistory: PropTypes.shape({
        veteran: PropTypes.shape({
          employmentRecords: PropTypes.array,
        }),
      }),
    }),
    questions: PropTypes.shape({
      vetIsEmployed: PropTypes.bool,
    }),
    reviewNavigation: PropTypes.bool,
    'view:reviewPageNavigationToggle': PropTypes.bool,
  }).isRequired,
  goBack: PropTypes.func.isRequired,
  goToPath: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
};

export default EmploymentQuestion;
