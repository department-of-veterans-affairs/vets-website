// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

// Relatives
import RequestDD214 from '../../containers/RequestDD214';

describe('Discharge Wizard <RequestDD214 />', () => {
  const reactRouterStub = {
    push: () => sinon.stub(),
  };
  it('should render the DOD Form 149 link', () => {
    const tree = shallow(<RequestDD214 router={reactRouterStub} />);
    expect(tree.html()).to.contain('DoD Form 149');
    tree.unmount();
  });
});
