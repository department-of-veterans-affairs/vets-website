import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouterV6 as renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';

import Review from './Review';
import { getDefaultRenderOptions } from '../utils/test-utils';

describe('VASS Component: Review', () => {
  it('should render review page correctly', () => {
    const screen = renderWithStoreAndRouter(
      <Review />,
      getDefaultRenderOptions({
        hydrated: true,
        selectedDate: '2025-01-15T10:00:00.000Z',
        selectedTopics: [{ topicId: '1', topicName: 'Topic 1' }],
        uuid: 'c0ffee-1234-beef-5678',
        lastname: 'Smith',
        dob: '1935-04-07',
      }),
    );
    expect(screen.getByTestId('review-page')).to.exist;
    expect(screen.getByTestId('back-link')).to.exist;
    expect(screen.getByTestId('header')).to.exist;
    expect(screen.getByTestId('date-time-title')).to.exist;
    expect(screen.getByTestId('date-time-edit-link')).to.exist;
    expect(screen.getByTestId('date-time-description')).to.exist;
    expect(screen.getByTestId('topic-title')).to.exist;
    expect(screen.getByTestId('topic-edit-link')).to.exist;
    expect(screen.getByTestId('topic-description')).to.exist;
    expect(screen.getByTestId('confirm-call-button')).to.exist;
  });
});
