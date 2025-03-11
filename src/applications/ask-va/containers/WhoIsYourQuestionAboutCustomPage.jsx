import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import SignInMayBeRequired from '../components/SignInMyBeRequired';
import { CHAPTER_2, whoIsYourQuestionAboutLabels } from '../constants';

const WhoIsYourQuestionAboutCustomPage = props => {
  const { onChange, isLoggedIn, goBack, formData, goForward } = props;
  const [validationError, setValidationError] = useState(null);

  const radioOptions = () => {
    const labels = Object.values(whoIsYourQuestionAboutLabels);
    const values = Object.keys(whoIsYourQuestionAboutLabels);
    return labels.map((option, index) => {
      return { label: option, value: values[index] };
    });
  };

  const showError = data => {
    if (data.whoIsYourQuestionAbout) {
      goForward(data);
    }
    focusElement('va-radio');
    return setValidationError('Please select who your question is about');
  };

  const handleChange = event => {
    const selectedValue = event.detail.value;

    onChange({
      ...formData,
      whoIsYourQuestionAbout: selectedValue,
      yourQuestionRequiresSignIn:
        (selectedValue === whoIsYourQuestionAboutLabels.MYSELF ||
          selectedValue === whoIsYourQuestionAboutLabels.SOMEONE_ELSE) &&
        !isLoggedIn,
    });
  };

  return (
    <>
      <SignInMayBeRequired />
      <form className="rjsf">
        <VaRadio
          class="rjsf-web-component-field"
          label={CHAPTER_2.PAGE_1.TITLE}
          label-header-level="3"
          name="root_whoIsYourQuestionAbout"
          required="true"
          onVaValueChange={handleChange}
          error={validationError}
        >
          {radioOptions().map(option => (
            <va-radio-option
              key={option.value}
              name="who-is-your-question-about"
              label={option.label}
              value={option.label}
              checked={formData.whoIsYourQuestionAbout === option.label}
              aria-describedby={
                formData.whoIsYourQuestionAbout === option.value
                  ? option.value
                  : null
              }
            />
          ))}
        </VaRadio>
        <FormNavButtons goBack={goBack} goForward={() => showError(formData)} />
      </form>
    </>
  );
};

WhoIsYourQuestionAboutCustomPage.propTypes = {
  formData: PropTypes.shape({
    whoIsYourQuestionAbout: PropTypes.string,
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  id: PropTypes.string,
  isLoggedIn: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    isLoggedIn: state.user.login.currentlyLoggedIn,
    formData: state.form.data,
  };
}

export default connect(mapStateToProps)(WhoIsYourQuestionAboutCustomPage);
