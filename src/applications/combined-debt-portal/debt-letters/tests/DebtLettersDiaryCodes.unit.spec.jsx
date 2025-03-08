import { expect } from 'chai';
import { render } from '@testing-library/react';
import { renderLetterHistory } from '../const/diary-codes';

describe('diary-codes', () => {
  describe('renderLetterHistory', () => {
    it('should render first demand letter for codes 100, 101, 102, 109', () => {
      const codes = ['100', '101', '102', '109'];
      codes.forEach(code => {
        const { container } = render(renderLetterHistory(code));
        const titleElement = container.querySelector('strong');
        const contentElement = container.querySelector('p:not(:first-child)');

        expect(titleElement).to.exist;
        expect(titleElement.textContent).to.equal('First demand letter');

        expect(contentElement).to.exist;
        expect(contentElement.textContent).to.include(
          'A letter was sent to notify you of your debt',
        );
      });
    });

    it('should render second demand letter for code 117', () => {
      const { getByText } = render(renderLetterHistory('117'));
      expect(getByText('Second demand letter')).to.exist;
      expect(getByText(/A letter was sent to inform you that failure to pay/))
        .to.exist;
    });

    it('should render third demand letter for code 123', () => {
      const { getByText } = render(renderLetterHistory('123'));
      expect(getByText('Third demand letter')).to.exist;
      expect(getByText(/A letter was sent to inform you that failure to pay/))
        .to.exist;
      expect(getByText(/Department of Treasury for collection/)).to.exist;
    });

    it('should render debt increase letter for code 130', () => {
      const { container } = render(renderLetterHistory('130'));

      // Check for the title
      const titleElement = container.querySelector('strong');
      expect(titleElement).to.exist;
      expect(titleElement.textContent).to.equal('Debt increase letter');

      // Check for the content
      const contentElement = container.querySelector('p:not(:first-child)');
      expect(contentElement).to.exist;
      expect(contentElement.textContent).to.equal(
        'A letter was sent to inform you that your debt’s balance has increased due to additional benefit over payments being made to you.',
      );
    });

    it('should return null for unknown codes', () => {
      expect(renderLetterHistory('999')).to.be.null;
    });
  });
});
