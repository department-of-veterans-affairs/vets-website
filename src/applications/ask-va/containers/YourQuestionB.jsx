import { VaTextarea } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { withRouter } from 'react-router';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { ServerErrorAlert } from '../config/helpers';
import { clearFormData, removeAskVaForm } from '../actions';

const YourQuestionBPage = ({
  goForward,
  formData,
  onChange,
  router,
  formId,
}) => {
  const [error] = useState(false);
  const dispatch = useDispatch();

  const handleGoBack = () => {
    dispatch(clearFormData());
    dispatch(removeAskVaForm(formId));
    router.push('/');
  };

  const handleChange = event => {
    const { value } = event.currentTarget;
    const initialData =
      formData.initialFormData === undefined
        ? { ...formData }
        : { ...formData.initialFormData };

    onChange({
      ...formData,
      initialFormData: initialData,
      question: value,
    });
  }

  useEffect(
    () => {
      focusElement('h2');
    },
    [formData.aboutYourself],
  );

  return !error ? (
    <>
      <h3>Your question</h3>
      <form>
        <VaTextarea
          id="root_yourQuestion"
          name="question"
          required
          value={formData.question}
          error-message="Please let us know what your question is about."
          label="What is your question?"
          maxlength={10000}
          charcount
          onInput={handleChange}
        />
        <FormNavButtons goBack={handleGoBack} goForward={goForward} />
      </form>
    </>
  ) : (
    <ServerErrorAlert />
  );
};

YourQuestionBPage.propTypes = {
  formData: PropTypes.object,
  formId: PropTypes.string,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  isLoggedIn: PropTypes.bool,
  router: PropTypes.object,
  user: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    isLoggedIn: state.user.login.currentlyLoggedIn,
    formData: state.form.data,
    formId: state.form.formId,
  };
}

export default connect(mapStateToProps)(withRouter(YourQuestionBPage));
