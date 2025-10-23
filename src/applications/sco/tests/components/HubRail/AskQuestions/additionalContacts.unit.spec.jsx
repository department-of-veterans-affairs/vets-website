import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import AdditionalContacts from '../../../../components/HubRail/AskQuestions/additionalContacts';

describe('AdditionalContacts', () => {
  it('renders without crashing', () => {
    const tree = shallow(<AdditionalContacts />);
    expect(tree.exists()).to.be.true;
    tree.unmount();
  });
});
