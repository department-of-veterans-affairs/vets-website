import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import VetTecProgramView from '../../../0994/components/VetTecProgramView';

const formData = {
  programName: 'pgoramname',
  plannedStartDate: '2010-01-02',
};

describe('<VetTecProgramView>', () => {
  it('should render', () => {
    const component = shallow(<VetTecProgramView formData={formData} />);

    const text = component.text();
    expect(text).to.contain('pgoramname');
    expect(text).to.contain('2010-01-02');

    component.unmount();
  });
});
