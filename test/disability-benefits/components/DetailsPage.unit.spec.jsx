import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { DetailsPage } from '../../../src/js/disability-benefits/containers/DetailsPage';

describe('<DetailsPage>', () => {
  it('should render contention list', () => {
    const claim = {
      attributes: {
        contentionList: [
          'Condition 1',
          'Condition 2'
        ]
      }
    };

    const tree = SkinDeep.shallowRender(
      <DetailsPage
          claim={claim}/>
    );
    expect(tree.subTree('.claim-contentions-list').text()).to.contain('Condition 1Condition 2');
  });

  it('should render not available with an empty contention list', () => {
    const claim = {
      attributes: {
        contentionList: []
      }
    };

    const tree = SkinDeep.shallowRender(
      <DetailsPage
          claim={claim}/>
    );
    expect(tree.subTree('.claim-contentions-list').text()).to.contain('Not Available');
  });
});
