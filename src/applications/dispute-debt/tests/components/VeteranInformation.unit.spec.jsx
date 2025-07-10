import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import VeteranInformation from '../../components/VeteranInformation';

describe('<VeteranInformation>', () => {
  it('renders without crashing with minimal data', () => {
    const { getByText } = renderInReduxProvider(
      <VeteranInformation formData={{ veteran: {} }} />,
      {
        initialState: {
          user: { profile: { userFullName: { first: 'John', last: 'Doe' } } },
        },
      },
    );
    expect(getByText('Your personal information')).to.exist;
  });
});
