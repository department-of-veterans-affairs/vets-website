import React from 'react';
import { shallow } from 'enzyme';

import VetTecProgramView from '../../../0994/components/VetTecProgramView';

const formData = {
  programName: 'pgoramname',
  plannedStartDate: '2010-01-02',
};

describe('<VetTecProgramView>', () => {
  it('should render', () => {
    const component = shallow(<VetTecProgramView formData={formData} />);

    component.unmount();
  });
});
