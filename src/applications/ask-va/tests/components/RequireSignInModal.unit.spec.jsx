import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import RequireSignInModal from '../../components/RequireSignInModal';

describe('RequireSignInModal Component', () => {
  it('should render the modal with the correct content', () => {
    const { getByText } = render(
      <RequireSignInModal show onClose={() => {}} restrictedItem="Topic A" />,
    );

    expect(
      getByText(
        'To continue with Topic A selected you must Sign In or make another selection.',
      ),
    ).to.exist;
  });
});
