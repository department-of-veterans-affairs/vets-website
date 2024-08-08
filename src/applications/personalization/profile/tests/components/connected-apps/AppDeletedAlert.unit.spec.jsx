import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { AppDeletedAlert } from '../../../components/connected-apps/AppDeletedAlert';

describe('<AppDeletedAlert>', () => {
  it('renders correctly', () => {
    const privacyUrl = 'https://www.apple.com/legal/privacy/';
    const defaultProps = {
      id: '',
      title: 'Apple Health',
      dismissAlert: () => {},
      privacyUrl,
    };

    const view = render(<AppDeletedAlert {...defaultProps} />);

    expect(
      view.getByText(
        /If you have questions about data the app has already collected/i,
      ),
    ).to.exist;

    const link = view.getByRole('link');
    expect(link).to.have.attribute('href', privacyUrl);
  });
});
