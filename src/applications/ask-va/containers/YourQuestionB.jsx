import { VaTextarea } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { withRouter } from 'react-router';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { ServerErrorAlert } from '../config/helpers';
import { clearFormData, removeAskVaForm } from '../actions';

const YourQuestionBPage = ({ goForward, formData, router, formId }) => {
  const [error] = useState(false);
  const dispatch = useDispatch();

  const handleGoBack = () => {
    dispatch(clearFormData());
    dispatch(removeAskVaForm(formId));
    router.push('/');
  };

  useEffect(
    () => {
      focusElement('h2');
    },
    [formData.aboutYourself],
  );

  // 'ui:description': FormElementTitle({ title: CHAPTER_2.PAGE_3.TITLE }),
  //   'ui:objectViewField': PageFieldSummary,
  //   question: {
  //     'ui:title': CHAPTER_2.PAGE_3.QUESTION_1,
  //     'ui:webComponentField': VaTextareaField,
  //     'ui:required': () => true,
  //     'ui:errorMessages': {
  //       required: 'Please let us know what your question is about.',
  //     },
  //     'ui:options': {
  //       required: true,
  //       charcount: true,
  //       useFormsPattern: 'single',
  //     },
  //   },

  // <VaSelect
  //           id="root_selectCategory"
  //           label="Select the category that best describes your question"
  //           name="Select category"
  //           value={formData.selectCategory}
  //           onVaSelect={handleChange}
  //           required
  //           error={validationError}
  //           uswds
  //         ></VaSelect>

  //   label="Select the category that best describes your question"
  // name="Select category"
  // value={formData.selectCategory}

  return !error ? (
    <>
      <h3>Your question</h3>
      <form>
        <VaTextarea
          id="root_yourQuestion"
          name="question"
          required
          value={formData.description}
          error-message="Please let us know what your question is about."
          label="What is your question?"
          maxlength={10000}
          charcount={10000}
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
