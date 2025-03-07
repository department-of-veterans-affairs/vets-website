import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import VeteranInformation from '../../components/VeteranInformation';

describe('<VeteranInformation>', () => {
  const getData = (suffix = '') => ({
    props: {
      formData: {
        veteran: {
          ssnLastFour: '5678',
        },
      },
    },
    store: {
      getState: () => ({
        user: {
          profile: {
            userFullName: {
              first: 'uno',
              middle: 'dos',
              last: 'tres',
              suffix,
            },
            dob: '2000-01-05',
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
        <VeteranInformation />
      </Provider>,
    );
    expect($('va-card', container)).to.exist;
    expect($('va-link[external]', container)).to.exist;
  });

  it('should render with empty data', () => {
    const { props, store } = getData();
    const { container } = render(
      <Provider store={store}>
        <VeteranInformation {...props} />
      </Provider>,
    );
    expect($('va-card', container)).to.exist;
    expect($('.name', container).textContent).to.equal('Name: uno dos tres');
  });

  it('should render profile data', () => {
    const { props, store } = getData('suffix');
    const { container } = render(
      <Provider store={store}>
        <VeteranInformation {...props} />
      </Provider>,
    );

    expect($('h3')).to.exist;
    expect($('.name', container).textContent).to.equal(
      'Name: uno dos tres, suffix',
    );
    expect($('.ssn', container).textContent).to.contain(
      'Last 4 digits of Social Security number: 5678',
    );
    expect($('.dob', container).textContent).to.contain(
      'Date of birth: January 5, 2000',
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
