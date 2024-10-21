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
import { setTopicID } from '../actions';
import CatAndTopicSummary from '../components/CatAndTopicSummary';
import RequireSignInModal from '../components/RequireSignInModal';
import { ServerErrorAlert } from '../config/helpers';
import {
  CHAPTER_1,
  URL,
  envUrl,
  requireSignInTopics,
  requiredForSubtopicPage,
} from '../constants';

const TopicSelectPage = props => {
  const {
    onChange,
    loggedIn,
    goBack,
    goToPath,
    goForward,
    formData,
    categoryID,
  } = props;
  const dispatch = useDispatch();

  const [apiData, setApiData] = useState([]);
  const [loading, isLoading] = useState(false);
  const [error, hasError] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [showModal, setShowModal] = useState({ show: false, selected: '' });

  const onModalNo = () => {
    onChange('');
    setShowModal({ show: false, selected: '' });
  };

  const showError = data => {
    if (data.selectTopic) {
      if (requiredForSubtopicPage.includes(data.selectTopic)) {
        return goToPath(`/${CHAPTER_1.PAGE_3.PATH}`);
      }
      return goForward(data);
    }
    focusElement('va-radio');
    return setValidationError('Please select a topic');
  };

  const handleChange = event => {
    const selectedValue = event.detail.value;
    const selected = apiData.find(
      topic => topic.attributes.name === selectedValue,
    );
    dispatch(setTopicID(selected.id));
    onChange({ ...formData, selectTopic: selectedValue });
    if (requireSignInTopics.includes(selectedValue) && !loggedIn)
      setShowModal({ show: true, selected: selectedValue });
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
        `${envUrl}${URL.GET_CATEGORIESTOPICS}/${categoryID}/${URL.GET_TOPICS}`,
      );
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
          {apiData.map(topic => (
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

        <FormNavButtons goBack={goBack} goForward={() => showError(formData)} />
      </form>

      <RequireSignInModal
        onClose={onModalNo}
        show={showModal.show}
        restrictedItem={showModal.selected}
      />
    </>
  ) : (
    <ServerErrorAlert />
  );
};

TopicSelectPage.propTypes = {
  categoryID: PropTypes.string,
  id: PropTypes.string,
  loggedIn: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    loggedIn: isLoggedIn(state),
    formData: state.form.data,
    categoryID: state.askVA.categoryID,
  };
}

export default connect(mapStateToProps)(TopicSelectPage);
