import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';

import { $ } from 'platform/forms-system/src/js/utilities/ui';
import Declined from '../components/Declined';

const oldLocation = global.window.location;

describe('Declined', () => {
  after(() => {
    global.window.location = oldLocation;
  });

  it('should render', () => {
    const { container } = render(<Declined />);

    expect($('h1', container).textContent).to.eql('We’ve signed you out');
    expect($('ol', container).children.length).to.eql(4);
    expect($('va-button[text="Sign in"]', container)).to.be.null;
  });

  context('sign in button displays when session storage exists', () => {
    it('should redirect to vamobile when session storage exists', async () => {
      sessionStorage.setItem('ci', 'vamobile');
      const { container } = render(<Declined />);

      const signInButton = $('va-button', container);
      expect(signInButton).to.exist;
      fireEvent.click(signInButton);

      await waitFor(() => {
        expect(sessionStorage.getItem('ci')).to.be.null;
        expect(global.window.location).to.eql(
          'vamobile://login-terms-rejected',
        );
      });
    });
  });
});
