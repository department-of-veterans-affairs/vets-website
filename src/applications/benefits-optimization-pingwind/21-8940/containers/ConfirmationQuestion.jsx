import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { getNextPagePath } from 'platform/forms-system/src/js/routing';
import { setData } from 'platform/forms-system/src/js/actions';
import { scrollTo } from 'platform/utilities/scroll';
import {
  VaAlert,
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const mapBooleanToRadioValue = value => {
  if (value === true) {
    return 'Y';
  }

  if (value === false) {
    return 'N';
  }

  return undefined;
};

const ConfirmationQuestion = ({
  formData,
  location,
  route,
  router,
  setFormData,
}) => {
  useEffect(() => {
    scrollTo('topScrollElement');
  }, []);

  const pageList = route?.pageList || [];
  const currentPath = location?.pathname || '';

  const initialConfirmation = formData?.confirmationQuestion ?? null;
  const initialNewCondition = formData?.newConditionQuestion ?? null;
  const [confirmation, setConfirmation] = useState(initialConfirmation);
  const [newCondition, setNewCondition] = useState(initialNewCondition);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [confirmationAnswered, setConfirmationAnswered] = useState(false);
  const [radioError, setRadioError] = useState(undefined);

  const goBack = () => {
    if (router?.push) {
      router.push('/introduction');
    }
  };

  const goForward = () => {
    setAttemptedSubmit(true);
    if (!router?.push) return;

    const nextPath = getNextPagePath(pageList, formData, currentPath);

    if (
      confirmation === true ||
      (confirmation === false && newCondition === true)
    ) {
      setRadioError(undefined);
      router.push(nextPath);
      return;
    }

    if (confirmation === false && newCondition === false) {
      setRadioError(
        'Oops, we hit a snag. You told us you are NOT applying for increased unemployability compensation benefits. Select the Find a VA Form link to find the right form, or to continue with this form, 21-8940, select "Yes" and continue.',
      );
      scrollTo('confirmation-question');
      return;
    }

    if (
      confirmation === false &&
      (newCondition === undefined || newCondition === null)
    ) {
      scrollTo('new-condition-question');
      return;
    }

    scrollTo('confirmation-question');
  };

  const handleConfirmationChange = value => {
    setConfirmation(value);
    setAttemptedSubmit(false);
    setConfirmationAnswered(true);
    setRadioError(undefined);
    if (value === false) {
      setNewCondition(null);
      setFormData({
        ...formData,
        confirmationQuestion: value,
        newConditionQuestion: null,
      });
    } else {
      setFormData({
        ...formData,
        confirmationQuestion: value,
      });
    }
  };

  const handleNewConditionChange = value => {
    setNewCondition(value);
    setAttemptedSubmit(false);
    if (value === true) {
      setRadioError(undefined);
    }
    setFormData({
      ...formData,
      newConditionQuestion: value,
    });
  };

  const confirmationError =
    attemptedSubmit && (confirmation === undefined || confirmation === null)
      ? 'You must make a selection to proceed.'
      : undefined;

  const newConditionError =
    attemptedSubmit &&
    confirmation === false &&
    (newCondition === undefined || newCondition === null)
      ? 'You must make a selection to proceed.'
      : undefined;

  const confirmationValue = mapBooleanToRadioValue(confirmation);
  const newConditionValue = mapBooleanToRadioValue(newCondition);
  const shouldShowNewConditionAlert =
    newCondition !== null && newCondition !== undefined;

  let newConditionAlert = null;
  if (newCondition === false) {
    newConditionAlert = (
      <VaAlert id="confirmation-alert" status="warning" uswds visible>
        <h3 slot="headline">Seems like you need a different form.</h3>
        <p>
          Let’s get you to the right place! Visit our forms page to find the
          right one for your needs. Remember, you can always get help from a{' '}
          <a
            href="/disability/get-help-filing-claim/"
            target="_blank"
            rel="noreferrer"
          >
            Veteran Service Organization
          </a>
          .
        </p>
        <p>
          <a
            href="https://www.va.gov/find-forms/"
            target="_blank"
            rel="noreferrer"
          >
            Find a VA Form
          </a>
        </p>
      </VaAlert>
    );
  } else if (newCondition === true) {
    newConditionAlert = (
      <VaAlert status="info" uswds visible>
        <h3 slot="headline">Important</h3>
        <p>
          Please remember, if you are filing a claim for a new or secondary
          condition or for increased disability compensation, you will also need
          to complete the Form 21-526EZ if you haven’t done so already.
        </p>
        <p>
          <a
            href="/disability/file-disability-claim-form-21-526ez/introduction"
            target="_blank"
            rel="noreferrer"
          >
            VA Form 21-526EZ
          </a>
        </p>
      </VaAlert>
    );
  }

  return (
    <div className="schemaform-intro">
      <h1 id="main-content" className="vads-u-margin-bottom--2">
        Let’s confirm VA Form 21-8940 is the right form for your needs
      </h1>
      <VaRadio
        id="confirmation-question"
        name="confirmation-question"
        label="Are you applying for increased compensation due to unemployability?"
        required
        value={confirmationValue}
        error={radioError || confirmationError}
        onVaValueChange={e => handleConfirmationChange(e.detail.value === 'Y')}
      >
        <VaRadioOption name="confirmation-question" label="Yes" value="Y" />
        <VaRadioOption name="confirmation-question" label="No" value="N" />
      </VaRadio>
      {confirmationAnswered && confirmation === false ? (
        <>
          <VaRadio
            id="new-condition-question"
            name="new-condition-question"
            label="Are you applying for a new or secondary condition?"
            required
            value={newConditionValue}
            error={newConditionError}
            onVaValueChange={e =>
              handleNewConditionChange(e.detail.value === 'Y')
            }
          >
            <VaRadioOption
              name="new-condition-question"
              label="Yes"
              value="Y"
            />
            <VaRadioOption name="new-condition-question" label="No" value="N" />
          </VaRadio>

          {shouldShowNewConditionAlert && newConditionAlert}
        </>
      ) : null}
      <FormNavButtons goBack={goBack} goForward={goForward} />
    </div>
  );
};

ConfirmationQuestion.propTypes = {
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
)(ConfirmationQuestion);
