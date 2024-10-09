import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';
import { focusElement } from 'platform/utilities/ui';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import RequireSignInModal from '../components/RequireSignInModal';
import SignInMayBeRequired from '../components/SignInMyBeRequired';
import {
  CategoryEducation,
  whoIsYourQuestionAboutLabels,
  CHAPTER_3,
  CHAPTER_2,
} from '../constants';
import { flowPaths } from '../config/schema-helpers/formFlowHelper';

const WhoIsYourQuestionAboutCustomPage = props => {
  const { onChange, loggedIn, goBack, goToPath, formData } = props;
  const [validationError, setValidationError] = useState(null);
  const [showModal, setShowModal] = useState({ show: false, message: '' });

  const caregiverSelected = {
    category: 'Health care',
    topic: 'Caregiver support program',
    subtopic: 'Program of General Caregiver Support Services (PGCSS)',
  };

  const radioOptions = () => {
    const labels = Object.values(whoIsYourQuestionAboutLabels);
    const values = Object.keys(whoIsYourQuestionAboutLabels);
    return labels.map((option, index) => {
      return { label: option, value: values[index] };
    });
  };

  const onModalNo = () => {
    onChange({ ...formData, whoIsYourQuestionAbout: undefined });
    setShowModal({ show: false, message: '' });
  };

  const showError = data => {
    if (data.whoIsYourQuestionAbout) {
      if (
        data.selectCategory !== CategoryEducation &&
        data.whoIsYourQuestionAbout !== radioOptions()[2].value
      ) {
        return goToPath(`/${CHAPTER_3.RELATIONSHIP_TO_VET.PATH}`);
      }
      return goToPath(`/${flowPaths.general}-1`);
    }
    focusElement('va-radio');
    return setValidationError('Please select who your question is about');
  };

  const handleChange = event => {
    const selectedValue = event.detail.value;
    onChange({ ...formData, whoIsYourQuestionAbout: selectedValue });
    if (
      formData.selectCategory === caregiverSelected.category &&
      formData.selectTopic === caregiverSelected.topic &&
      formData.selectSubtopic === caregiverSelected.subtopic &&
      !loggedIn &&
      (selectedValue === radioOptions()[0].value ||
        selectedValue === radioOptions()[1].value)
    ) {
      setShowModal({
        show: true,
        message: `If your question is about yourself or someone else you need to sign in.`,
      });
    } else {
      onChange({ ...formData, whoIsYourQuestionAbout: selectedValue });
    }
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
              value={option.value}
              checked={formData.whoIsYourQuestionAbout === option.value}
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

      <RequireSignInModal
        onClose={onModalNo}
        show={showModal.show}
        message={showModal.message}
      />
    </>
  );
};

WhoIsYourQuestionAboutCustomPage.propTypes = {
  id: PropTypes.string,
  loggedIn: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    loggedIn: isLoggedIn(state),
    formData: state.form.data,
  };
}

export default connect(mapStateToProps)(WhoIsYourQuestionAboutCustomPage);
