import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import NeedsToVerifyAlert from '../../components/NeedsToVerifyAlert';

describe('<NeedsToVerifyAlert>', () => {
  it('renders without crashing', () => {
    const { container } = renderInReduxProvider(<NeedsToVerifyAlert />, {
      initialState: { user: { profile: { signIn: { serviceName: 'idme' } } } },
    });
    expect(container).to.exist;
  });
});
