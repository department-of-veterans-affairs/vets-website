import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';

import {
  BrandConsolidation,
  mapStateToProps,
} from '../../containers/BrandConsolidation';

describe('BrandConsolidation', () => {
  it('does not render children when brandConsolidationEnabled is false', () => {
    const state = {
      buildSettings: {
        brandConsolidationEnabled: false,
      },
    };

    const props = mapStateToProps(state);
    expect(props.brandConsolidationEnabled).to.be.false;

    const wrapper = enzyme.render(
      <BrandConsolidation {...props}>
        <h1>Brand-Consolidation Only</h1>
      </BrandConsolidation>,
    );

    expect(wrapper.html()).to.be.null;
  });

  it('does render children when brandConsolidationEnabled is true', () => {
    const state = {
      buildSettings: {
        brandConsolidationEnabled: true,
      },
    };

    const props = mapStateToProps(state);
    expect(props.brandConsolidationEnabled).to.be.true;

    const wrapper = enzyme.render(
      <BrandConsolidation {...props}>
        <h1>Brand-Consolidation Only</h1>
      </BrandConsolidation>,
    );
    expect(wrapper.html()).to.contain('Brand-Consolidation Only');
  });
});
