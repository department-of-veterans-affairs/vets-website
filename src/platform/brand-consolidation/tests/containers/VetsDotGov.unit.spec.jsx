import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';

import { VetsDotGov, mapStateToProps } from '../../containers/VetsDotGov';

describe('VetsDotGov', () => {
  it('renders children when brandConsolidationEnabled is false', () => {
    const state = {
      buildSettings: {
        brandConsolidationEnabled: false,
      },
    };

    const props = mapStateToProps(state);
    expect(props.vetsDotGovEnabled).to.be.true;

    const wrapper = enzyme.render(
      <VetsDotGov {...props}>
        <h1>Vets.Gov Only</h1>
      </VetsDotGov>,
    );

    expect(wrapper.html()).to.contain('Vets.Gov Only');
  });

  it('does not render children when brandConsolidationEnabled is true', () => {
    const state = {
      buildSettings: {
        brandConsolidationEnabled: true,
      },
    };

    const props = mapStateToProps(state);
    expect(props.vetsDotGovEnabled).to.be.false;

    const wrapper = enzyme.render(
      <VetsDotGov {...props}>
        <h1>Vets.Gov Only</h1>
      </VetsDotGov>,
    );
    expect(wrapper.html()).to.be.null;
  });
});
