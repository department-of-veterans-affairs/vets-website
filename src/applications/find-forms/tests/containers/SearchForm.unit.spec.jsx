// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

// Relative imports.
import { SearchForm } from '../../containers/SearchForm';

import stub from '../../constants/stub.json';

describe('Find VA Forms <SearchForm>', () => {
  it('should render', () => {
    const tree = shallow(<SearchForm />);
    const input = tree.find('input');

    expect(input.length).to.be.equal(1);
    tree.unmount();
  });

  it('fetches data on mount', () => {
    const oldWindow = global.window;

    global.window = {
      location: {
        search: '?q=health',
      },
    };

    const fetchFormsThunk = sinon.stub().resolves(stub);
    const tree = shallow(<SearchForm fetchFormsThunk={fetchFormsThunk} />);

    expect(fetchFormsThunk.calledOnce).to.be.true;
    expect(fetchFormsThunk.calledWith('health')).to.be.true;
    expect(tree.state().query).to.be.equal('health');

    tree.unmount();

    global.window = oldWindow;
  });

  it('updates the query in state', () => {
    const tree = shallow(<SearchForm />);
    const input = tree.find('input');

    input.simulate('change', { target: { value: 'new value' } });

    expect(tree.state().query).to.be.equal('new value');

    tree.unmount();
  });

  it('fetches data on submit', () => {
    const fetchFormsThunk = sinon.stub().resolves(stub);
    const tree = shallow(<SearchForm fetchFormsThunk={fetchFormsThunk} />);

    tree.setState({ query: 'health' });

    const form = tree.find('form');
    const preventDefault = sinon.stub();

    form.simulate('submit', { preventDefault });

    expect(fetchFormsThunk.calledOnce).to.be.true;
    expect(preventDefault.calledOnce).to.be.true;

    tree.unmount();
  });
});
