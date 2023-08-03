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
    const input = tree.find('[data-e2e-id="find-form-search-form"]');
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
});
