import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import HelpdeskInfo from '../../components/HelpdeskInfo';

describe('HelpdeskInfo component', () => {
  describe('AAL notice', () => {
    it('does not render the AAL notice by default', () => {
      const { queryByText } = render(<HelpdeskInfo />);
      const noteText = queryByText(/Note:/);
      expect(noteText).to.not.exist;
    });

    it('does not render the AAL notice when aalNoticeEnabled is false', () => {
      const { queryByText } = render(<HelpdeskInfo aalNoticeEnabled={false} />);
      const noteText = queryByText(/Note:/);
      expect(noteText).to.not.exist;
    });

    it('renders the AAL notice when aalNoticeEnabled is true', () => {
      const { getByText } = render(<HelpdeskInfo aalNoticeEnabled />);
      const noteText = getByText(/Note:/);
      expect(noteText).to.exist;
    });
  });
});
