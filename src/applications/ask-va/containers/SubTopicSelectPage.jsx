import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { focusElement } from 'platform/utilities/ui';
import { ServerErrorAlert } from '../config/helpers';
import { CHAPTER_1, CHAPTER_2, URL, envUrl } from '../constants';
import CatAndTopicSummary from '../components/CatAndTopicSummary';

const SubTopicSelectPage = props => {
  const { onChange, loggedIn, goBack, goToPath, formData, topicID } = props;

  const [apiData, setApiData] = useState([]);
  const [loading, isLoading] = useState(false);
  const [error, hasError] = useState(false);
  const [validationError, setValidationError] = useState(null);

  const showError = data => {
    if (data.selectSubtopic) {
      return goToPath(`/${CHAPTER_2.PAGE_1.PATH}`);
    }
    focusElement('va-radio');
    return setValidationError('Please select a subtopic');
  };

  const handleChange = event => {
    const selectedValue = event.detail.value;
    onChange({ ...formData, selectSubtopic: selectedValue });
  };

  const getApiData = url => {
    isLoading(true);
    return apiRequest(url)
      .then(res => {
        setApiData(res.data);
        isLoading(false);
      })
      .catch(() => {
        isLoading(false);
        hasError(true);
      });
  };

  useEffect(
    () => {
      getApiData(
        `${envUrl}${
          URL.GET_SUBTOPICS
        }/${topicID}/subtopics?user_mock_data=true`,
      );
      focusElement('h2');
    },
    [loggedIn],
  );

  useEffect(
    () => {
      focusElement('h2');
    },
    [loading],
  );

  // render loading indicator while we fetch
  if (loading) {
    return (
      <va-loading-indicator label="Loading" message="Loading..." set-focus />
    );
  }

  return !error ? (
    <>
      {CatAndTopicSummary({
        category: formData.selectCategory,
        topic: formData.selectTopic,
      })}
      <h3 className="vads-u-margin-bottom--4">Subtopic</h3>
      <form className="rjsf">
        <VaRadio
          onVaValueChange={handleChange}
          className="vads-u-margin-top--neg3"
          label={CHAPTER_1.PAGE_3.QUESTION_1}
          label-header-level={CHAPTER_1.PAGE_3.QUESTION_1}
          error={validationError}
          required
          name="select_subtopic"
          uswds
        >
          {apiData.map(subTopic => (
            <VaRadioOption
              key={subTopic.id}
              name="select_subtopic"
              id={subTopic.id}
              value={subTopic.attributes.name}
              label={subTopic.attributes.name}
              checked={subTopic.attributes.name === formData.selectSubtopic}
              uswds
            />
          ))}
        </VaRadio>

        <FormNavButtons goBack={goBack} goForward={() => showError(formData)} />
      </form>
    </>
  ) : (
    <ServerErrorAlert />
  );
};

SubTopicSelectPage.propTypes = {
  loggedIn: PropTypes.bool,
  id: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  topicID: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    loggedIn: isLoggedIn(state),
    formData: state.form.data,
    topicID: state.askVA.topicID,
  };
}

export default connect(mapStateToProps)(SubTopicSelectPage);
