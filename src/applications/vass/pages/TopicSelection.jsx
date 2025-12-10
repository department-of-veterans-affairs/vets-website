import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom-v5-compat';
import {
  VaCheckbox,
  VaButtonPair,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import Wrapper from '../layout/Wrapper';
import { usePersistentSelections } from '../hooks/usePersistentSelections';
import {
  setSelectedTopics,
  selectSelectedTopics,
} from '../redux/slices/formSlice';
import { useGetTopicsQuery } from '../redux/api/vassApi';

// TODO: remove this once we have a real UUID
const UUID = 'af40d0e7-df29-4df3-8b5e-03eac2e760fa';

const TopicSelection = () => {
  const dispatch = useDispatch();
  const selectedTopics = useSelector(selectSelectedTopics);
  const navigate = useNavigate();
  const { saveTopicsSelection } = usePersistentSelections(UUID);
  const { data } = useGetTopicsQuery();
  const topics = useMemo(() => data?.topics || [], [data]);

  const saveTopics = useCallback(
    newTopics => {
      saveTopicsSelection(newTopics);
      dispatch(setSelectedTopics(newTopics));
    },
    [saveTopicsSelection, dispatch],
  );

  const handleTopicChange = event => {
    const { checked } = event.detail;
    if (checked) {
      const newTopics = [
        ...selectedTopics,
        topics.find(topic => topic.topicId === event.target.value),
      ];
      saveTopics(newTopics);
    } else {
      const newTopics = selectedTopics.filter(
        topic => topic.topicId !== event.target.value,
      );
      saveTopics(newTopics);
    }
  };

  const handleBack = () => {
    // TODO: manage state?
    navigate(-1);
  };

  const handleContinue = () => {
    // TODO: manage state && error handling
    navigate('/review');
  };

  return (
    <Wrapper
      pageTitle="What topic would you like to talk about?"
      showBackLink
      required
    >
      <va-checkbox-group
        required
        data-testid="topic-checkbox-group"
        label="Check all that apply"
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
