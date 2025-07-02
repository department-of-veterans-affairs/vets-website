import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { ShowAlertOrSip } from '../../components/ShowAlertOrSip';

describe('<ShowAlertOrSip>', () => {
  it('renders without crashing when not logged in', () => {
    const { container } = renderInReduxProvider(
      <ShowAlertOrSip
        sipOptions={{ formId: 'test', pageList: [], startText: 'Start' }}
      />,
      { initialState: { user: { login: { currentlyLoggedIn: false } } } },
    );
    expect(container).to.exist;
  });
});
