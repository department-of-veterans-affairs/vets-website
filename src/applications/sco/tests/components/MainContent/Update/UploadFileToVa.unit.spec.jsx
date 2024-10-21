import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import UploadFileToVa from '../../../../components/MainContent/Update/UploadFileToVa';

describe('UploadFileToVa', () => {
  it('renders without crashing', () => {
    const tree = shallow(<UploadFileToVa />);
    expect(tree.exists()).to.be.true;
    tree.unmount();
  });
});
