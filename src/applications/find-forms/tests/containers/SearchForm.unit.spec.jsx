import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import { SearchForm } from '../../containers/SearchForm';

describe('Find VA Forms <SearchForm>', () => {
  beforeEach(() => {
    delete window.location;
  });

  describe('when a search query is added', () => {
    beforeEach(() => {
      window.location = {
        search: '?q=health',
      };
    });

    const spy1 = sinon.spy();

    it('should fetch data on mount', () => {
      const { queryByTestId } = render(<SearchForm fetchForms={spy1} />);

      expect(spy1.called).to.be.true;
      expect(spy1.calledWith('health')).to.be.true;
      expect(queryByTestId(/find-form-error-body/i)).to.be.null;
    });
  });

  describe('when there is no search query added', () => {
    beforeEach(() => {
      window.location = {
        search: '?q=',
      };
    });

    const spy2 = sinon.spy();

    it('should not fetch data', () => {
      const { queryByTestId } = render(<SearchForm fetchForms={spy2} />);

      expect(spy2.called).to.be.false;
      expect(queryByTestId(/find-form-error-body/i)).to.be.null;
    });
  });

  describe('when there is a one-character query added', () => {
    beforeEach(() => {
      window.location = {
        search: '?q=a',
      };
    });

    const spy3 = sinon.spy();

    it('should not fetch data and show an error', async () => {
      const { queryByTestId } = render(<SearchForm fetchForms={spy3} />);

      expect(spy3.called).to.be.false;
      expect(queryByTestId(/find-form-error-body/i)).not.to.be.null;
    });
  });
});
