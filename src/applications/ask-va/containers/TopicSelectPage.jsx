import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { focusElement } from 'platform/utilities/ui';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { setTopicID } from '../actions';
import CatAndTopicSummary from '../components/CatAndTopicSummary';
import { ServerErrorAlert } from '../config/helpers';
import { CHAPTER_1, URL, getApiUrl } from '../constants';

const TopicSelectPage = props => {
  const {
    onChange,
    isLoggedIn,
    goBack,
    goForward,
    formData,
    categoryID,
  } = props;
  const dispatch = useDispatch();
  const isLOA3 = useSelector(state => state.user.profile.loa.current === 3);

  const [apiData, setApiData] = useState([]);
  const [loading, isLoading] = useState(false);
  const [error, hasError] = useState(false);
  const [validationError, setValidationError] = useState(null);

  const showError = () => {
    if (formData.selectTopic) {
      goForward(formData);
    }
    focusElement('va-radio');
    return setValidationError('Select a topic');
  };

  const handleChange = event => {
    const selectedValue = event.detail.value;

    if (!selectedValue || selectedValue === '') {
      // Clear form data when no topic is selected
      dispatch(setTopicID(null));
      onChange({
        ...formData,
        selectTopic: '',
        topicId: null,
        topicRequiresSignIn: false,
        requireSignInLogic: {
          ...formData.requireSignInLogic,
          topic: false,
        },
      });
      return;
    }

    const selected = apiData.find(
      topic => topic.attributes.name === selectedValue,
    );

    if (!selected) return;

    dispatch(setTopicID(selected.id));

    onChange({
      ...formData,
      contactPreferences: selected.attributes.contactPreferences,
      selectTopic: selectedValue,
      topicId: selected.id,
      topicRequiresSignIn:
        selected.attributes.requiresAuthentication && !isLOA3,
      requireSignInLogic: formData.requireSignInLogic
        ? {
            ...formData.requireSignInLogic,
            topic: selected.attributes.requiresAuthentication,
          }
        : {
            category: false,
            topic: selected.attributes.requiresAuthentication,
            personQuestionIsAbout: false,
          },
    });
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
      getApiData(getApiUrl(URL.GET_TOPICS, { PARENT_ID: categoryID }));
    },
    [isLoggedIn, categoryID],
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
      {CatAndTopicSummary({ category: formData.selectCategory })}
      <h3 className="vads-u-margin-bottom--4">Topic</h3>
      <form className="rjsf">
        <VaRadio
          onVaValueChange={handleChange}
          className="vads-u-margin-top--neg3"
          label={CHAPTER_1.PAGE_2.QUESTION_1}
          label-header-level={CHAPTER_1.PAGE_2.QUESTION_1}
          error={validationError}
          name="select_topic"
          required
          uswds
        >
          {apiData?.map(topic => (
            <VaRadioOption
              key={topic.id}
              name="select_topic"
              id={topic.id}
              value={topic.attributes.name}
              label={topic.attributes.name}
              checked={topic.attributes.name === formData.selectTopic}
              uswds
            />
          ))}
        </VaRadio>

        <FormNavButtons goBack={goBack} goForward={() => showError()} />
      </form>
    </>
  ) : (
    <ServerErrorAlert />
  );
};

TopicSelectPage.propTypes = {
  categoryID: PropTypes.string,
  formData: PropTypes.object,
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
    categoryID: state.form.data.categoryId,
  };
}

export default connect(mapStateToProps)(TopicSelectPage);
