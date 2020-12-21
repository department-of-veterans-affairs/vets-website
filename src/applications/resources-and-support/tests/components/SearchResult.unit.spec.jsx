// Node modules.
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
// Relative imports.
import { SearchResult } from '../../components/SearchResult';

const results = [
  {
    entityBundle: 'step_by_step',
    entityUrl: { path: '/node/8434' },
    title:
      'How to change direct deposit information for VA disability or pension ',
    description:
      'Follow our step-by-step instructions for making&#xA0;changes to your VA direct deposit information for VA disability or pension benefit payments. We&apos;ll show you how to sign in and make changes on...',
    fieldPrimaryCategory: {
      entity: {
        entityUrl: { path: '/taxonomy/term/282' },
        name: 'VA account and profile',
      },
    },
    fieldOtherCategories: [],
    fieldTags: {
      entity: {
        fieldTopics: [
          {
            entity: {
              entityUrl: { path: '/taxonomy/term/292' },
              name: 'Sign in',
            },
          },
        ],
      },
    },
  },
  {
    entityBundle: 'step_by_step',
    entityUrl: { path: '/node/8520' },
    title: 'How to check your VA claim or appeal status online',
    description:
      'Follow our step-by-step instructions for&#xA0;checking the status of your&#xA0;VA claim or appeal online.\n',
    fieldPrimaryCategory: {
      entity: {
        entityUrl: { path: '/taxonomy/term/283' },
        name: 'Other topics and questions',
      },
    },
    fieldOtherCategories: [],
    fieldTags: {
      entity: {
        fieldTopics: [
          {
            entity: {
              entityUrl: { path: '/taxonomy/term/293' },
              name: 'Claims and appeals status',
            },
          },
        ],
      },
    },
  },
];

describe('SearchResult', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(
      <SearchResult
        article={results[0]}
        page={1}
        position={1}
        query="term"
        totalResults={results.length}
      />,
    );

    expect(wrapper).to.exist;
    wrapper.unmount();
  });
});
