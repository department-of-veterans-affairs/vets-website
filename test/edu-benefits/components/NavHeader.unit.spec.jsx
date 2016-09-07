import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import NavHeader from '../../../src/js/edu-benefits/components/NavHeader';

describe('<NavHeader>', () => {
  it('should render', () => {
    const path = '/some-url';
    const chapters = [
      {
        name: 'Wrong chapter',
        pages: [
          {
            path: '/some-url2',
            name: 'Testing'
          }
        ]
      },
      {
        name: 'Test chapter',
        pages: [
          {
            path: '/some-url',
            name: 'Testing'
          }
        ]
      }
    ];

    const tree = SkinDeep.shallowRender(
      <NavHeader
          path={path}
          chapters={chapters}/>
    );
    expect(tree.subTree('h4').text()).to.equal('2 of 2 Test chapter');
  });
});
