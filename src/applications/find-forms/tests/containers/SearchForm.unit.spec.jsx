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

  it('should fetch data on mount when a search query is added', async () => {
    global.window.location = { search: '?q=health' };
    const spy1 = sinon.spy();
    const { queryByTestId } = render(<SearchForm fetchForms={spy1} />);
    await waitFor(() => {
      expect(spy1.called).to.be.true;
      expect(spy1.calledWith('health')).to.be.true;
      expect(queryByTestId(/find-form-error-body/i)).to.be.null;
    });
  });

  it('should not fetch data when there is no search query', async () => {
    global.window.location = { search: '?q=' };
    const spy2 = sinon.spy();
    const { queryByTestId } = render(<SearchForm fetchForms={spy2} />);
    await waitFor(() => {
      expect(queryByTestId(/find-form-error-body/i)).to.be.null;
      expect(spy2.called).to.be.false;
    });
  });

  it('should not fetch data and show an error when there is only 1 character search query', async () => {
    global.window.location = { search: '?q=a' };
    const spy3 = sinon.spy();
    const { queryByTestId } = render(<SearchForm fetchForms={spy3} />);
    await waitFor(() => {
      expect(spy3.called).to.be.false;
      expect(queryByTestId(/find-form-error-body/i)).not.to.be.null;
    });
  });
});
