import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { MemoryRouter } from 'react-router-dom';
import ProgramsList from '../../../components/profile/ProgramsList';

describe('<ProgramsList>', () => {
  const match = { params: { programType: 'science' } };
  const locationState = { state: { name: 'Graduate Programs' } };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <MemoryRouter initialEntries={[{ pathname: '/', state: locationState }]}>
        <ProgramsList match={match} />
      </MemoryRouter>,
    );
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should render correctly', () => {
    expect(wrapper.find(ProgramsList).exists()).to.be.true;
  });
});
