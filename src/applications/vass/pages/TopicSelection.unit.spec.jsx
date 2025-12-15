import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouterV6 } from '~/platform/testing/unit/react-testing-library-helpers';
import sinon from 'sinon';

import TopicSelection from './TopicSelection';
import topics from '../services/mocks/utils/topic';
import reducers from '../redux/reducers';
import { vassApi } from '../redux/api/vassApi';
import * as apiHooks from '../redux/api/vassApi';

describe('VASS Component: TopicSelection', () => {
  const sandbox = sinon.createSandbox();
  afterEach(() => {
    sandbox.restore();
  });

  it('should render all content', () => {
    sandbox
      .stub(apiHooks, 'useGetTopicsQuery')
      .returns({ data: { topics }, isLoading: false });

    const { getByTestId } = renderWithStoreAndRouterV6(<TopicSelection />, {
      initialState: {
        vassForm: {
          hydrated: false,
          selectedDate: null,
          selectedTopics: [],
        },
      },
      reducers,
      additionalMiddlewares: [vassApi.middleware],
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
