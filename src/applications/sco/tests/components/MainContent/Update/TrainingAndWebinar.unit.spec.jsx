import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import TrainingAndWebinar from '../../../../components/MainContent/Update/TrainingAndWebinar';

describe('TrainingAndWebinar', () => {
  it('renders without crashing', () => {
    const tree = shallow(<TrainingAndWebinar />);
    expect(tree.exists()).to.be.true;
    tree.unmount();
  });
});
