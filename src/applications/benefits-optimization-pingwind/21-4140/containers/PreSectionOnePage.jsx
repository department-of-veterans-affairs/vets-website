import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { getNextPagePath } from 'platform/forms-system/src/js/routing';
import { setData } from 'platform/forms-system/src/js/actions';
import { scrollTo } from 'platform/utilities/scroll';
import { waitForRenderThenFocus } from 'platform/utilities/ui';
import {
  VaAlert,
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const PreSectionOnePage = ({
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
  const NO_SELECTION_MESSAGE =
    'Oops, we hit a snag. You told us we did NOT ask you to verify your employment status. Select the VA Form link to find the right form, or to continue with this form, 21-4140, to verify your employment, select “Yes” and continue.';

  const initialSelection = formData?.preSectionOne?.selection;
  const [selection, setSelection] = useState(initialSelection);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const goBack = () => {
    if (router?.push) {
      router.push('/introduction');
    }
  };

  const goForward = () => {
    if (!router?.push) {
      return;
    }

    setAttemptedSubmit(true);

    if (selection === 'yes') {
      const nextPath = getNextPagePath(pageList, formData, currentPath);
      router.push(nextPath);
      return;
    }

    if (selection === 'no') {
      scrollTo('employment-status-alert');
    }
  };

  const handleValueChange = ({ detail } = {}) => {
    const { value } = detail || {};
    setSelection(value);
    setAttemptedSubmit(false);

    if (setFormData) {
      setFormData({
        ...formData,
        preSectionOne: {
          ...formData?.preSectionOne,
          selection: value,
        },
      });
    }
  };

  const handleBlur = event => {
    const { currentTarget } = event || {};
    if (!currentTarget) {
      return;
    }

    // Defer until after focus settles so we can detect moves within the radio group
    setTimeout(() => {
      const activeElement = document.activeElement;
      if (
        activeElement === currentTarget ||
        currentTarget.contains(activeElement)
      ) {
        return;
      }

      if (!selection) {
        setAttemptedSubmit(true);
      }
    }, 0);
  };

  const radioError = (() => {
    if (!attemptedSubmit) {
      return undefined;
    }

    if (!selection) {
      return 'You must make a selection. This field is required.';
    }

    if (selection === 'no') {
      return NO_SELECTION_MESSAGE;
    }

    return undefined;
  })();

  return (
    <div className="schemaform-intro">
      <h1 id="main-content" className="vads-u-margin-bottom--2">
        Let's get started!
      </h1>
      <p className="vads-u-margin-bottom--3">
        We want to confirm you're in the right place.
      </p>
      <VaRadio
        name="employment-status-verification"
        label="Have we asked you to verify your employment status because you currently receive Individual Unemployability disability benefits for a service-connected condition?"
        required
        value={selection}
        error={radioError}
        onVaValueChange={handleValueChange}
        onBlur={handleBlur}
      >
        <VaRadioOption
          name="employment-status-verification"
          label="Yes"
          value="yes"
        />
        <VaRadioOption
          name="employment-status-verification"
          label="No"
          value="no"
        />
      </VaRadio>
      {selection === 'no' && (
        <VaAlert
          id="employment-status-alert"
          status="warning"
          class="vads-u-margin-y--3"
          uswds
          visible
        >
          <h2>Hmmm? Seems like you need a different form.</h2>
          <p className="vads-u-margin--0">
            Let’s get you to the right place! Visit our forms page to find the
            right one for your needs. Remember, you can always get help from a
          </p>
          <a
            href="https://www.va.gov/get-help-from-accredited-representative/find-rep/"
            target="_blank"
            rel="noreferrer"
          >
            VA accredited representative or Veteran Service Organization (VSO).
            It's free!
          </a>
          <br />
          <a
            href="https://www.va.gov/find-forms/"
            target="_blank"
            rel="noreferrer"
          >
            Find a VA Form
          </a>
        </VaAlert>
      )}
      <FormNavButtons goBack={goBack} goForward={goForward} />
    </div>
  );
};

PreSectionOnePage.propTypes = {
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
)(PreSectionOnePage);
