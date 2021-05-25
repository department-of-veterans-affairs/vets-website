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

  it.skip('fetches data on mount', () => {
    // 5/19/2019 skipping due to Enzyme still not playing well with useEffect.
    // There's an issue with the useEffect() not being invoked. Enzyme team is working on a solve.
    const oldWindow = global.window;
    global.window = {
      location: {
        search: '?q=health',
      },
    };
    const fetchForms = sinon.stub().resolves(stub);
    const tree = shallow(<SearchForm fetchForms={fetchForms} />);
    expect(fetchForms.called).to.be.true;
    expect(fetchForms.calledWith('health')).to.be.true;
    expect(tree.state().query).to.be.equal('health');

    tree.unmount();

    global.window = oldWindow;
  });

  it('updates the query in state', () => {
    const tree = shallow(<SearchForm />);
    const input = tree.find('input');

    input.simulate('change', { target: { value: 'new value' } });
    expect(tree.find('input').props().value).to.equal('new value');

    tree.unmount();
  });

  it('fetches data on submit', () => {
    const fetchForms = sinon.stub().resolves(stub);
    const tree = shallow(<SearchForm fetchForms={fetchForms} />);
    const input = tree.find('input');

    input.simulate('change', { target: { value: 'health' } });

    const form = tree.find('form');
    const preventDefault = sinon.stub();

    form.simulate('submit', { preventDefault });

    expect(fetchForms.calledOnce).to.be.true;
    expect(preventDefault.calledOnce).to.be.true;

    tree.unmount();
  });
});
