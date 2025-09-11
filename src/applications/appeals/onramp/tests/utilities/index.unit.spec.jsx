import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import { printErrorMessage, renderSingleOrList } from '../../utilities';

describe('utilities', () => {
  describe('printErrorMessage', () => {
    const sandbox = sinon.createSandbox();
    let errorStub;

    beforeEach(() => {
      errorStub = sandbox.stub(console, 'error');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should call console.error with the given message', () => {
      printErrorMessage('Test error');
      expect(errorStub.calledWith('Test error')).to.be.true;
    });
  });

  describe('renderSingleOrList', () => {
    it('should return null for empty or undefined items', () => {
      expect(renderSingleOrList()).to.be.null;
      expect(renderSingleOrList([])).to.be.null;
    });

    describe('single item', () => {
      it('should render in a <p> without a period if useSentenceFormat is false', () => {
        const cardContent = ['You have new and relevant evidence'];
        const screen = render(
          renderSingleOrList(cardContent, false, 'test-class', null, 'testid'),
        );

        const p = screen.getByTestId('testid-0');
        expect(p).to.have.class('test-class');
        expect(p).to.have.text(cardContent[0]);
      });

      it('should render in a <p> with a period if useSentenceFormat is true', () => {
        const cardContent = ['You have new and relevant evidence'];
        const screen = render(
          renderSingleOrList(cardContent, true, null, null, 'testid'),
        );

        const p = screen.getByTestId('testid-0');
        expect(p).not.to.have.class();
        expect(p).to.have.text(`${cardContent[0]}.`);
      });
    });

    describe('multiple items', () => {
      it('should render a list of items correctly if useSentenceFormat is false', () => {
        const cardContent = ['Supplemental Claims', 'Higher-Level Reviews'];
        const screen = render(
          renderSingleOrList(cardContent, false, null, 'test-class', 'testid'),
        );

        const items = screen.getAllByRole('listitem');

        expect(items).to.have.lengthOf(2);
        expect(items[0]).to.have.class('test-class');
        expect(items[0]).to.have.text(cardContent[0]);
        expect(items[1]).to.have.text(cardContent[1]);
      });

      it('should include comma and "and" for all but last item if useSentenceFormat is true', () => {
        const cardContent = [
          'You have new and relevant evidence',
          'Your claim is not contested',
        ];

        const screen = render(
          renderSingleOrList(cardContent, true, null, null, 'testid'),
        );

        const items = screen.getAllByRole('listitem');

        expect(items[0].innerHTML).to.eq(
          `${cardContent[0]}, <strong>and</strong>`,
        );

        expect(items[1].innerHTML).to.eq(cardContent[1]);
      });
    });
  });
});
