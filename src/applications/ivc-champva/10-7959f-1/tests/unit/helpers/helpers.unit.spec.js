import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import formConfig from '../../../config/form';
import PrefillCopy from '../../../helpers/PrefillCopy';
import PrefilledAddress from '../../../helpers/prefilledAddress';
import { CustomSSNReviewPage } from '../../../helpers/CustomSSN';
import mockData from '../../e2e/fixtures/data/test-data.json';

const getData = ({ loggedIn = true, isVerified = true } = {}) => ({
  props: {
    loggedIn,
    route: {
      formConfig,
      pageList: [{ path: '/introduction' }, { path: '/next', formConfig }],
    },
  },
  mockStore: {
    getState: () => ({
      isVerified,
      user: {
        login: {
          currentlyLoggedIn: loggedIn,
        },
        profile: {
          savedForms: [],
          prefillsAvailable: [],
        },
      },
      form: {
        formId: formConfig.formId,
        loadedData: {
          metadata: {},
        },
      },
      route: {
        formConfig: {},
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  },
});

describe('Prefill', () => {
  it('should render', () => {
    const { props, mockStore } = getData();
    const { container } = render(
      <Provider store={mockStore}>
        <PrefillCopy {...props} />
      </Provider>,
    );
    expect(container).to.exist;
  });
});

describe('Prefill Copy not logged', () => {
  it('should render empty div', () => {
    const { props, mockStore } = getData({ loggedIn: false });
    const { container } = render(
      <Provider store={mockStore}>
        <PrefillCopy {...props} />
      </Provider>,
    );
    expect(container).to.exist;
  });
});

describe('PrefilledAddress', () => {
  it('should render', () => {
    const { props, mockStore } = getData();
    const { container } = render(
      <Provider store={mockStore}>
        <PrefilledAddress {...props} />
      </Provider>,
    );
    expect(container).to.exist;
  });
});

describe('PrefilledAddress not logged in', () => {
  it('should render empty div', () => {
    const { props, mockStore } = getData({ loggedIn: false });
    const { container } = render(
      <Provider store={mockStore}>
        <PrefilledAddress {...props} />
      </Provider>,
    );
    expect(container).to.exist;
  });
});

describe('CustomSSNPage', () => {
  it('should render', () => {
    const { props, mockStore } = getData();
    const { container } = render(
      <Provider store={mockStore}>
        <CustomSSNReviewPage {...props.data} />
      </Provider>,
    );
    expect(container).to.exist;
  });
});

describe('CustomSSNPage', () => {
  it('should render with a file number if ssn is empty', () => {
    const component = (
      <CustomSSNReviewPage
        data={{
          ...mockData.data,
          veteranSocialSecurityNumber: {
            ssn: undefined,
            vaFileNumber: '589631256',
          },
        }}
      />
    );
    const { mockStore } = getData();
    const { container } = render(
      <Provider store={mockStore}>{component}</Provider>,
    );
    expect(container).to.exist;
  });
});
