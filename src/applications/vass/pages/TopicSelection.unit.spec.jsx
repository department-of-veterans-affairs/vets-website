import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouterV6 } from '~/platform/testing/unit/react-testing-library-helpers';

import TopicSelection from './TopicSelection';
import { topics } from '../services/Topic/topic';

describe('VASS Component: TopicSelection', () => {
  it('should render all content', () => {
    const { getByTestId } = renderWithStoreAndRouterV6(<TopicSelection />, {
      initialState: {},
    });

    expect(getByTestId('header')).to.exist;
    expect(getByTestId('back-link')).to.exist;
    expect(getByTestId('topic-checkbox-group')).to.exist;
    expect(getByTestId('button-pair')).to.exist;

    topics.forEach(({ topicId }) => {
      const testId = `topic-checkbox-${topicId
        .toLowerCase()
        .replace(/\s+/g, '-')}`;
      expect(getByTestId(testId)).to.exist;
    });
  });
});
