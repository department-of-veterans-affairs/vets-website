import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, waitFor } from '@testing-library/react';
import { SearchForm } from '../../containers/SearchForm';

describe('Find VA Forms <SearchForm>', () => {
  const oldLocation = global.window.location;

  afterEach(() => {
    global.window.location = oldLocation;
  });

  context('when a search query is added', () => {
    it('should fetch data on mount', async () => {
      global.window.location = { search: '?q=health' };
      const spy1 = sinon.spy();
      const { queryByTestId } = render(<SearchForm fetchForms={spy1} />);
      expect(spy1.called).to.be.true;
      expect(spy1.calledWith('health')).to.be.true;
      await waitFor(() => {
        expect(queryByTestId(/find-form-error-body/i)).to.be.null;
      });
    });
  });

  context('when there is no search query added', () => {
    it('should not fetch data', async () => {
      global.window.location = { search: '?q=' };
      const spy2 = sinon.spy();
      const { queryByTestId } = render(<SearchForm fetchForms={spy2} />);
      expect(spy2.called).to.be.false;
      await waitFor(() => {
        expect(queryByTestId(/find-form-error-body/i)).to.be.null;
      });
    });
  });

  context('when there is a one-character query added', () => {
    it('should not fetch data and show an error', async () => {
      global.window.location = { search: '?q=a' };
      const spy3 = sinon.spy();
      const { queryByTestId } = render(<SearchForm fetchForms={spy3} />);
      expect(spy3.called).to.be.false;
      await waitFor(() => {
        expect(queryByTestId(/find-form-error-body/i)).not.to.be.null;
      });
    });
  });
});
