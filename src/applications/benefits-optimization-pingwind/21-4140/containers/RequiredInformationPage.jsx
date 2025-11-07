import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import {
  getNextPagePath,
  getPreviousPagePath,
} from 'platform/forms-system/src/js/routing';
import { scrollTo } from 'platform/utilities/scroll';
import { waitForRenderThenFocus } from 'platform/utilities/ui';
import {
  VaSummaryBox,
  VaCheckbox,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setData } from 'platform/forms-system/src/js/actions';

const RequiredInformationPage = ({
  formData,
  location,
  route,
  router,
  setFormData,
}) => {
  useEffect(() => {
    scrollTo('topScrollElement');
    waitForRenderThenFocus('#main-content');
  }, []);

  const pageList = route?.pageList || [];
  const currentPath = location?.pathname || '';
  const initialAcknowledged = Boolean(
    formData?.requiredInformation?.acknowledged,
  );
  const [acknowledged, setAcknowledged] = useState(initialAcknowledged);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const goBack = () => {
    if (!router?.push) {
      return;
    }

    const previousPath = getPreviousPagePath(pageList, formData, currentPath);
    router.push(previousPath || '/introduction');
  };

  const goForward = () => {
    if (!router?.push) {
      return;
    }

    setAttemptedSubmit(true);

    if (!acknowledged) {
      scrollTo('required-information-alert');
      return;
    }

    const nextPath = getNextPagePath(pageList, formData, currentPath);
    router.push(nextPath);
  };

  const handleCheckboxChange = ({ detail } = {}) => {
    const { checked } = detail || {};
    const isChecked = Boolean(checked);
    setAcknowledged(isChecked);
    setAttemptedSubmit(false);

    if (setFormData) {
      setFormData({
        ...formData,
        requiredInformation: {
          ...formData?.requiredInformation,
          acknowledged: isChecked,
        },
      });
    }
  };

  const handleBlur = event => {
    const { currentTarget } = event || {};
    if (!currentTarget) {
      return;
    }

    // Defer until after focus settles so we can detect moves within the checkbox
    setTimeout(() => {
      const { activeElement } = document;
      if (
        activeElement === currentTarget ||
        currentTarget.contains(activeElement)
      ) {
        return;
      }

      if (!acknowledged) {
        setAttemptedSubmit(true);
      }
    }, 0);
  };

  return (
    <div className="schemaform-intro">
      <h1 id="main-content" className="vads-u-margin-bottom--2">
        Information We are Required to Share
      </h1>
      <p className="vads-u-margin-bottom--3" style={{ fontSize: '20px' }}>
        This is a questionnaire to verify your employment status.
      </p>
      <VaSummaryBox
        id="required-information-summary"
        uswds
        class="vads-u-margin-bottom--3"
      >
        <h2 className="vads-u-margin-top--0">
          <b>IMPORTANT</b>
        </h2>
        <p className="vads-u-margin--0">
          You are receiving compensation at the 100 percent rate based on being
          unable to secure or follow a substantially gainful occupation as a
          result of your service-connected disabilities. Section I needs to be
          completed in order to identify the person filling out the form. If you
          were self-employed or employed by others, including the Department of
          Veterans Affairs, at any time during the past 12 months, complete
          Section II of this form. If you have not been employed during the past
          12 months, complete Section III of this form.
        </p>
      </VaSummaryBox>
      <VaCheckbox
        label="I have read this statement"
        name="acknowledged-statement"
        checked={acknowledged}
        required
        onVaChange={handleCheckboxChange}
        onBlur={handleBlur}
        error={
          attemptedSubmit && !acknowledged
            ? 'You must confirm you have read this statement to continue.'
            : undefined
        }
      />
      <FormNavButtons goBack={goBack} goForward={goForward} />
    </div>
  );
};

RequiredInformationPage.propTypes = {
  formData: PropTypes.object,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  route: PropTypes.shape({
    pageList: PropTypes.array,
  }),
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
  setFormData: PropTypes.func,
};

const mapStateToProps = state => ({
  formData: state.form?.data || {},
});

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RequiredInformationPage);
