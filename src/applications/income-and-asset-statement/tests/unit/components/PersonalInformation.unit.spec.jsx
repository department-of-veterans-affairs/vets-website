import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import PersonalInformation from '../../../components/PersonalInformation';

describe('<PersonalInformation>', () => {
  const getData = (suffix = '') => ({
    props: {
      formData: {
        veteran: {
          ssnLastFour: '9876',
          vaFileLastFour: '5432',
        },
      },
    },
    store: {
      getState: () => ({
        user: {
          profile: {
            userFullName: {
              first: 'Casey',
              middle: 'Morgan',
              last: 'Johnson',
              suffix,
            },
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
  });

  it('should render with no data', () => {
    const store = {
      getState: () => ({ user: { profile: {} } }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const { container } = render(
      <Provider store={store}>
        <PersonalInformation />
      </Provider>,
    );
    expect($('va-card', container)).to.exist;
    expect($('va-link[external]', container)).to.exist;
  });

  it('should render with empty data', () => {
    const { props, store } = getData();
    const { container } = render(
      <Provider store={store}>
        <PersonalInformation {...props} />
      </Provider>,
    );
    expect($('va-card', container)).to.exist;
    expect($('.name', container).textContent).to.equal(
      'Name: Casey Morgan Johnson',
    );
  });

  it('should render profile data', () => {
    const { props, store } = getData('suffix');
    const { container } = render(
      <Provider store={store}>
        <PersonalInformation {...props} />
      </Provider>,
    );

    expect($('h3')).to.exist;
    expect($('.name', container).textContent).to.equal(
      'Name: Casey Morgan Johnson, suffix',
    );
    expect($('.ssn', container).textContent).to.contain(
      'Last 4 digits of Social Security number: 9876',
    );
    expect($('.vafn', container).textContent).to.contain(
      'Last 4 digits of File number: 5432',
    );
    expect($$('.dd-privacy-mask', container).length).to.eq(2);
    expect($$('.dd-privacy-hidden', container).length).to.eq(1);
    expect($$('.dd-privacy-mask[data-dd-action-name]', container).length).to.eq(
      2,
    );
    expect(
      $$('.dd-privacy-hidden[data-dd-action-name]', container).length,
    ).to.eq(1);
  });
});
