// Node modules.
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { SearchForm } from './index';

describe('container <SearchForm>', () => {
  it('should render', () => {
    const tree = shallow(<SearchForm />);
    const select = tree.find('select');

    expect(select.length).to.be.equal(2);
    tree.unmount();
  });

  it('fetches data on mount', () => {
    const oldWindow = global.window;

    global.window = {
      location: {
        search: '?platform=ios&category=health',
      },
    };

    const fetchResultsThunk = sinon.stub();
    const tree = shallow(<SearchForm fetchResultsThunk={fetchResultsThunk} />);

    expect(fetchResultsThunk.calledOnce).to.be.true;
    expect(
      fetchResultsThunk.firstCall.calledWith({
        category: 'health',
        platform: 'ios',
      }),
    ).to.be.true;
    expect(tree.state().category).to.be.equal('health');

    tree.unmount();

    global.window = oldWindow;
  });

  it('updates the platform in state', () => {
    const tree = shallow(<SearchForm />);
    const input = tree.find('select[name="platform-field"]');

    input.simulate('change', { target: { value: 'new value' } });

    expect(tree.state().platform).to.be.equal('new value');

    tree.unmount();
  });

  it('fetches data on submit', () => {
    const fetchResultsThunk = sinon.stub();
    const tree = shallow(<SearchForm fetchResultsThunk={fetchResultsThunk} />);

    tree.setState({ platform: 'testing' });

    const form = tree.find('form');
    const preventDefault = sinon.stub();

    form.simulate('submit', { preventDefault });

    expect(fetchResultsThunk.calledOnce).to.be.true;
    expect(preventDefault.calledOnce).to.be.true;

    tree.unmount();
  });
});
