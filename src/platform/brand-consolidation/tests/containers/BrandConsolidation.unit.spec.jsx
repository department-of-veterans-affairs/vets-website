import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';

import { BrandConsolidation, mapStateToProps } from '../../containers/BrandConsolidation';

describe('BrandConsolidation', () => {

  it('does not render children when brandConsolidationEnabled is false', () => {
    const state = {
      buildSettings: {
        brandConsolidationEnabled: false
      }
    };
    const props = mapStateToProps(state);
    const wrapper = enzyme.shallow(
      <BrandConsolidation {...props}>
        <h1>Hello there!</h1>
      </BrandConsolidation>
    );

    expect(wrapper.get(0)).to.be.null;
  });

  it('does render children when brandConsolidationEnabled is true', () => {
    const state = {
      buildSettings: {
        brandConsolidationEnabled: true
      }
    };
    const props = mapStateToProps(state);
    const wrapper = enzyme.shallow(
      <BrandConsolidation {...props}>
        <h1>Hello there!</h1>
      </BrandConsolidation>
    );
    expect(wrapper.text()).to.be.equal('Hello there!');
  });

});
