// Dependencies.
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { SearchForm } from './index';

describe('Yellow Ribbon container <SearchForm>', () => {
  it('should render', () => {
    const tree = shallow(<SearchForm />);
    const input = tree.find('input');
    const select = tree.find('select');

    expect(input.length).to.be.equal(1);
    expect(select.length).to.be.equal(1);
    tree.unmount();
  });

  it('fetches data on mount', () => {
    const oldWindow = global.window;

    global.window = {
      location: {
        search:
          '?contributionAmount=unlimited&city=boulder&country=usa&name=university&numberOfStudents=unlimited&state=co',
      },
    };

    const fetchResultsThunk = sinon.stub();
    const tree = shallow(<SearchForm fetchResultsThunk={fetchResultsThunk} />);

    expect(fetchResultsThunk.calledOnce).to.be.true;
    expect(
      fetchResultsThunk.firstCall.calledWith({
        city: 'boulder',
        contributionAmount: 'unlimited',
        country: 'usa',
        name: 'university',
        numberOfStudents: 'unlimited',
        state: 'co',
      }),
    ).to.be.true;
    expect(tree.state().name).to.be.equal('university');

    tree.unmount();

    global.window = oldWindow;
  });

  it('updates the name in state', () => {
    const tree = shallow(<SearchForm />);
    const input = tree.find('input[name="yr-search-name"]');

    input.simulate('change', { target: { value: 'new value' } });

    expect(tree.state().name).to.be.equal('new value');

    tree.unmount();
  });

  it('fetches data on submit', () => {
    const fetchResultsThunk = sinon.stub();
    const tree = shallow(<SearchForm fetchResultsThunk={fetchResultsThunk} />);

    tree.setState({ name: 'testing' });

    const form = tree.find('form');
    const preventDefault = sinon.stub();

    form.simulate('submit', { preventDefault });

    expect(fetchResultsThunk.calledOnce).to.be.true;
    expect(preventDefault.calledOnce).to.be.true;

    tree.unmount();
  });
});
