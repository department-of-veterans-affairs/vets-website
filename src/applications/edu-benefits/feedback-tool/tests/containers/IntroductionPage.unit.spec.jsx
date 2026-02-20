import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import IntroductionPage from '../../containers/IntroductionPage';
import formConfig from '../../config/form';
import { complaintTypesList } from '../../constants';

const getData = ({
  loggedIn = true,
  isVerified = true,
  data = {},
  contestedIssues = {},
} = {}) => ({
  props: {
    loggedIn,
    location: {
      basename: '/education/submit-school-feedback',
    },
    route: {
      formConfig,
      pageList: [{ path: '/introduction' }, { path: '/next', formConfig }],
    },
  },
  mockStore: {
    getState: () => ({
      user: {
        login: {
          currentlyLoggedIn: loggedIn,
        },
        profile: {
          savedForms: [],
          prefillsAvailable: [],
          verified: isVerified,
        },
      },
      form: {
        formId: formConfig.formId,
        loadedStatus: 'success',
        savedStatus: '',
        loadedData: {
          metadata: {},
        },
        data,
        contestedIssues,
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
  },
});

describe('<IntroductionPage>', () => {
  it('Should Render Component', () => {
    const { props, mockStore } = getData({ loggedIn: false });
    const wrapper = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(wrapper).to.not.be.null;
    wrapper.unmount();
  });

  it('Should render complaint types as a list instead of a table', () => {
    const { props, mockStore } = getData({ loggedIn: false });
    const { container, getByText } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    // Verify that table element is not present
    const table = container.querySelector('table');
    expect(table).to.be.null;

    // Verify that all complaint types are rendered in a list
    complaintTypesList.forEach(item => {
      const text = item.content[0].value;
      expect(getByText(text)).to.exist;
    });
  });
});
