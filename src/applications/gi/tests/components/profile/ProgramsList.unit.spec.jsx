import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import ProgramsList from '../../../components/profile/ProgramsList';

describe('<ProgramsList>', () => {
  it('should render without crashing', () => {
    const match = { params: { programType: 'Graduate' } };
    const location = { state: { institutionName: 'Test Institution' } };

    const wrapper = mount(
      <MemoryRouter
        initialEntries={[
          { pathname: '/institution/10000132', state: location.state },
        ]}
      >
        <ProgramsList match={match} />
      </MemoryRouter>,
    );

    expect(wrapper.find(ProgramsList).exists()).to.be.true;
    expect(wrapper.find('h1').text()).to.equal('Test Institution');
    expect(wrapper.find('h2').exists()).to.be.true;
    expect(wrapper.find('VaSearchInput')).to.have.lengthOf(1);
    expect(wrapper.find('VaButton')).to.have.lengthOf(1);
    expect(wrapper.find('VaPagination')).to.have.lengthOf(1);
    wrapper.unmount();
  });
});
