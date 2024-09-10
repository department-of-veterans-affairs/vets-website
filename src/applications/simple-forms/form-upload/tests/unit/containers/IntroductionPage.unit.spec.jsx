import React from 'react';
import { Provider } from 'react-redux';
import { render, cleanup } from '@testing-library/react';
import { expect } from 'chai';

import formConfig from '../../../config/form';
import IntroductionPage from '../../../containers/IntroductionPage';
import { getFormContent } from '../../../helpers';

const TEST_URL = 'https://dev.va.gov/form-upload/21-0779/introduction';
const config = formConfig(TEST_URL);

const props = {
  route: {
    path: 'introduction',
    pageList: [
      {
        pageKey: 'introduction',
        path: '/introduction',
      },
      {
        path: '/first-page',
        title: 'First Page',
        uiSchema: {},
        schema: {
          type: 'object',
          properties: {
            firstField: {
              type: 'string',
            },
          },
        },
        chapterTitle: 'Chapter 1',
        chapterKey: 'chapter1',
        pageKey: 'page1',
      },
      {
        pageKey: 'review-and-submit',
        path: '/review-and-submit',
        chapterKey: 'review',
      },
    ],
    formConfig: config,
  },
};

const mockStore = {
  getState: () => ({
    user: {
      login: {
        currentlyLoggedIn: false,
      },
      profile: {
        savedForms: [],
        prefillsAvailable: ['FORM-UPLOAD-FLOW'],
        dob: '2000-01-01',
        loa: {
          current: 3,
        },
        verified: true,
      },
    },
    form: {
      formId: formConfig.formId,
      loadedStatus: 'success',
      savedStatus: '',
      loadedData: {
        metadata: {},
      },
      data: {},
    },
    scheduledDowntime: {
      globalDowntime: null,
      isReady: true,
      isPending: false,
      serviceMap: { get() {} },
      dismissedDowntimeWarnings: [],
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

describe('IntroductionPage', () => {
  beforeEach(() => {
    window.location = new URL(TEST_URL);
  });

  afterEach(() => {
    cleanup();
  });

  it('renders successfully', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(container).to.exist;
  });

  it('renders the correct title, subtitle', () => {
    const { title, subTitle } = getFormContent();

    const { getByText } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(getByText(title)).to.exist;
    expect(getByText(subTitle)).to.exist;
  });
});
