import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';

import { content } from '../../content/evidenceSummary';

describe('evidenceSummary', () => {
  describe('addMoreLink', () => {
    it('should render', () => {
      global.window.dataLayer = [];
      const { getByText, getByRole } = render(
        <div>{content.addMoreLink()}</div>,
      );

      fireEvent.click(getByText('Add more evidence'));

      const event = global.window.dataLayer.slice(-1)[0];
      expect(event).to.deep.equal({
        event: 'cta-action-link-click',
        'action-link-type': 'primary',
        'action-link-click-label': 'Add more evidence',
        'action-link-icon-color': 'green',
      });
      const header = getByRole('heading');
      expect(header.tagName).to.eq('H4');
      expect(header.textContent).to.contain('Are you missing evidence?');
    });

    it('should render an h5 on the review page', () => {
      window.location = { pathname: '/review-and-submit' };
      const { getByRole } = render(<div>{content.addMoreLink()}</div>);
      expect(getByRole('heading').tagName).to.eq('H5');
    });
  });
});
