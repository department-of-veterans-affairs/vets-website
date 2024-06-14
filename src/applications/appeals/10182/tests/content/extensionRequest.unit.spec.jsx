import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { ShowAlert } from '../../content/extensionRequest';

import { SHOW_PART3_REDIRECT } from '../../constants';

describe('<ContestableIssuesWidget>', () => {
  const getStore = (redirect = 'redirected') => ({
    getState: () => ({
      form: { data: { [SHOW_PART3_REDIRECT]: redirect } },
    }),
    subscribe: () => {},
    dispatch: () => {},
  });

  it('should render redirect alert', () => {
    const { container } = render(
      <Provider store={getStore()}>
        <div>
          <ShowAlert />
        </div>
      </Provider>,
    );
    expect($('va-alert', container)).to.exist;
  });

  it('should not render redirect alert', () => {
    const { container } = render(
      <Provider store={getStore('done')}>
        <div>
          <ShowAlert />
        </div>
      </Provider>,
    );
    expect($('va-alert', container)).to.not.exist;
  });
});
