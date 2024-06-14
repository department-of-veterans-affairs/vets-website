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
  const getData = (emptyData = true) => ({
    props: {
      formData: {
        veteran: {
          vaFileLastFour: emptyData ? '' : '8765',
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
            },
            dob: '2000-01-05',
            gender: 'F',
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
    expect($('.blue-bar-block', container)).to.exist;
  });

  it('should render with empty data', () => {
    const { props, store } = getData();
    const { container } = render(
      <Provider store={store}>
        <VeteranInformation {...props} />
      </Provider>,
    );
    expect($('.blue-bar-block', container)).to.exist;
  });

  it('should render profile data', () => {
    const { props, store } = getData(false);
    const { container } = render(
      <Provider store={store}>
        <VeteranInformation {...props} />
      </Provider>,
    );

    expect($('h3')).to.exist;
    expect($('.name', container).textContent).to.equal('uno dos tres');
    expect($('.ssn', container).textContent).to.contain('●●●–●●–5678');
    expect($('.vafn', container).textContent).to.contain('●●●–●●–8765');
    expect($('.dob', container).textContent).to.contain('January 5, 2000');
    expect($('.gender', container).textContent).to.contain('Female');
    expect($$('.dd-privacy-mask', container).length).to.eq(3);
    expect($$('.dd-privacy-hidden', container).length).to.eq(2);
    expect($$('.dd-privacy-mask[data-dd-action-name]', container).length).to.eq(
      3,
    );
    expect(
      $$('.dd-privacy-hidden[data-dd-action-name]', container).length,
    ).to.eq(2);
  });
});
