import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom-v5-compat';
import {
  VaCheckbox,
  VaButtonPair,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import Wrapper from '../layout/Wrapper';
import {
  setSelectedTopics,
  selectSelectedTopics,
} from '../redux/slices/formSlice';
import { useGetTopicsQuery } from '../redux/api/vassApi';
import { useErrorFocus } from '../hooks/useErrorFocus';
import { URLS } from '../utils/constants';

const TopicSelection = () => {
  const [{ error, handleSetError }] = useErrorFocus(['va-checkbox-group']);
  const dispatch = useDispatch();
  const selectedTopics = useSelector(selectSelectedTopics);
  const navigate = useNavigate();
  const { data, isLoading: loading } = useGetTopicsQuery();
  const topics = useMemo(() => data?.topics || [], [data]);

  const handleTopicChange = event => {
    handleSetError('');
    const { checked } = event.detail;
    if (checked) {
      const newTopics = [
        ...selectedTopics,
        topics.find(topic => topic.topicId === event.target.value),
      ];
      dispatch(setSelectedTopics(newTopics));
    } else {
      const newTopics = selectedTopics.filter(
        topic => topic.topicId !== event.target.value,
      );
      dispatch(setSelectedTopics(newTopics));
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleContinue = () => {
    if (!selectedTopics?.length) {
      handleSetError('Please choose a topic for your appointment.');
      return;
    }
    navigate(URLS.REVIEW);
  };

  return (
    <Wrapper
      pageTitle="What do you want to learn more about?"
      showBackLink
      required
      loading={loading}
    >
      <va-checkbox-group
        data-testid="topic-checkbox-group"
        label="Check all that apply"
        class="vass-checkbox-group"
        error={error}
      >
        {topics.map(({ topicId, topicName }) => (
          <VaCheckbox
            key={topicId}
            data-testid={`topic-checkbox-${topicId
              .toLowerCase()
              .replace(/\s+/g, '-')}`}
            label={topicName}
            name="topic"
            value={topicId}
            onVaChange={handleTopicChange}
            checked={(selectedTopics || []).some(
              topic => topic.topicId === topicId,
            )}
          />
        ))}
      </va-checkbox-group>
      <VaButtonPair
        data-testid="button-pair"
        continue
        onPrimaryClick={handleContinue}
        onSecondaryClick={handleBack}
        class="vads-u-margin-top--4"
      />
    </Wrapper>
  );
};

export default TopicSelection;
