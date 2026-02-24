import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { renderWithStoreAndRouterV6 } from '~/platform/testing/unit/react-testing-library-helpers';
import {
  mockFetch,
  resetFetch,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers';
import sinon from 'sinon';

import TopicSelection from './TopicSelection';
import { createDefaultTopics } from '../services/mocks/utils/topic';
import { createTopicsResponse } from '../services/mocks/utils/responses';
import { getDefaultRenderOptions } from '../utils/test-utils';
import * as authUtils from '../utils/auth';

describe('VASS Component: TopicSelection', () => {
  let getVassTokenStub;
  beforeEach(() => {
    mockFetch();
    getVassTokenStub = sinon
      .stub(authUtils, 'getVassToken')
      .returns('mock-token');
  });

  afterEach(() => {
    resetFetch();
    getVassTokenStub.restore();
  });

  it('should render all content', async () => {
    const topics = createDefaultTopics();
    setFetchJSONResponse(
      global.fetch.onCall(0),
      createTopicsResponse({ topics }),
    );

    const { getByTestId } = renderWithStoreAndRouterV6(
      <TopicSelection />,
      getDefaultRenderOptions({
        obfuscatedEmail: 's****@email.com',
        uuid: 'c0ffee-1234-beef-5678',
        lastName: 'Smith',
        dob: '1935-04-07',
      }),
    );

    await waitFor(() => {
      expect(getByTestId('topic-checkbox-group')).to.exist;
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
