import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import createCommonStore from '../../../../platform/startup/store';
import { VetTecScoContact } from '../../components/vet-tec/VetTecScoContact';
import reducer from '../../reducers';

const defaultProps = createCommonStore(reducer).getState();

describe('<VetTecScoContact>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<VetTecScoContact {...defaultProps} />);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  it('return null when no sco is supplied', () => {
    expect(VetTecScoContact()).to.be.null;
  });

  it('expect header text to render when it should', () => {
    const sco = {
      facilityCode: '2V000203',
      institutionName: 'GALVANIZE INC',
      priority: 'PRIMARY',
      firstName: 'MARTIN',
      lastName: 'INDIATSI',
      title: 'REGISTRAR BURSAR',
      phoneAreaCode: '303',
      phoneNumber: '749-0110',
      phoneExtension: null,
      email: 'VABENEFITS@GALVANIZE.COM',
    };
    const tree = SkinDeep.shallowRender(
      VetTecScoContact(sco, 'School certifying officials'),
    );
    const header = tree.subTree('h3').text();
    expect(header).to.equal('School certifying officials');
  });

  it("expect header to not render when it shouldn't", () => {
    const sco = {
      facilityCode: '2V000203',
      institutionName: 'GALVANIZE INC',
      priority: 'PRIMARY',
      firstName: 'MARTIN',
      lastName: 'INDIATSI',
      title: 'REGISTRAR BURSAR',
      phoneAreaCode: '303',
      phoneNumber: '749-0110',
      phoneExtension: null,
      email: 'VABENEFITS@GALVANIZE.COM',
    };
    const tree = SkinDeep.shallowRender(VetTecScoContact(sco));
    const placeholder = tree.subTree('.vads-u-margin-y--5');
    expect(placeholder).not.to.be.false;
  });
});
