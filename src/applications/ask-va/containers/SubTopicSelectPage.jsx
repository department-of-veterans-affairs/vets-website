import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { focusElement } from 'platform/utilities/ui';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { setSubtopicID } from '../actions';
import CatAndTopicSummary from '../components/CatAndTopicSummary';
import { ServerErrorAlert } from '../config/helpers';
import { CHAPTER_1, URL, getApiUrl } from '../constants';

const SubTopicSelectPage = props => {
  const { onChange, loggedIn, goBack, formData, topicID, goForward } = props;
  const dispatch = useDispatch();

  const [apiData, setApiData] = useState([]);
  const [loading, isLoading] = useState(false);
  const [error, hasError] = useState(false);
  const [validationError, setValidationError] = useState(null);

  const showError = data => {
    if (data.selectSubtopic) goForward(data);
    focusElement('va-radio');
    return setValidationError('Select a subtopic');
  };

  const handleChange = event => {
    const selectedValue = event.detail.value;
    const selected = apiData.find(
      subtopic => subtopic.attributes.name === selectedValue,
    );
    dispatch(setSubtopicID(selected.id)); // askVA store subtopicID
    onChange({
      ...formData,
      selectSubtopic: selectedValue,
      subtopicId: selected.id,
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
      getApiData(
        getApiUrl(URL.GET_SUBTOPICS, {
          PARENT_ID: `${topicID}`,
        }),
      );
      focusElement('h2');
    },
    [loggedIn, topicID],
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
  formData: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  id: PropTypes.string,
  loggedIn: PropTypes.bool,
  topicID: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    loggedIn: isLoggedIn(state),
    formData: state.form.data,
    topicID: state.form.data.topicId,
  };
}

export default connect(mapStateToProps)(SubTopicSelectPage);
