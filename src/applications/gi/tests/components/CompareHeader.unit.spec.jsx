import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import CompareHeader from '../../components/CompareHeader';

describe('<CompareHeader>', () => {
  it('should render', () => {
    const tree = shallow(
      <BrowserRouter>
        <CompareHeader
          institutions={[
            {
              name: 'Test Institution A',
            },
            {
              name: 'Test Institution B',
            },
          ]}
        />
      </BrowserRouter>,
    );
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });
});
