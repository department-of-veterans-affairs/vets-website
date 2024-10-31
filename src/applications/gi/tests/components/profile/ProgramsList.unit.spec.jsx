import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import ProgramsList from '../../../components/profile/ProgramsList';

describe('<ProgramsList>', () => {
  const match = { params: { programType: 'Graduate' } };
  const location = { state: { institutionName: 'Test Institution' } };
  const gradPrograms = [
    'CERT ADAPTATIONS-GLOBAL CLIMATE CHG',
    'CERT WEB DEVELOPMENT CERTIFICATE',
    'CERT APPLIED ARCHEOLOGY',
    'CERT ART HISTORY',
    'CERT BUSINESS ANALYTICS FLEX OPTION',
    'CERT BUSINESS FUNDAMENTALS',
    'CERT CAMPAIGNS',
    'CERT CHILD AND FAMILY ADVOCACY',
    'CERT COMMUNITY ENGAGEMENT',
    'CERT CONFLICT ANALYSIS AND RESOLUTION',
    'CERT CREATIVE WRITING',
    'CERT DATA SCIENCE',
    'CERT DESIGN',
    'CERT DIGITAL AND MEDIA LITERACY',
    'CERT DIGITAL DESIGN AND FABRICATION',
    'CERT DIGITAL MEDIA AND PRODUCTION',
    'CERT DIVERSITY AND INCLUSION',
    'CERT ENVIRONMENTAL SUSTAINABILITY',
    'CERT ETHICS',
    'CERT FILM STUDIES',
    'CERT CREATIVE WRITING',
    'CERT DATA SCIENCE',
    'CERT DESIGN',
    'CERT DIGITAL AND MEDIA LITERACY',
    'CERT DIGITAL DESIGN AND FABRICATION',
    'CERT DIGITAL MEDIA AND PRODUCTION',
    'CERT DIVERSITY AND INCLUSION',
    'CERT ENVIRONMENTAL SUSTAINABILITY',
    'CERT ETHICS',
    'CERT FILM STUDIES',
  ];

  const mountComponent = (state = location.state) => {
    return mount(
      <MemoryRouter
        initialEntries={[{ pathname: '/institution/10000132', state }]}
      >
        <ProgramsList match={match} />
      </MemoryRouter>,
    );
  };

  it('should render without crashing', () => {
    const wrapper = mountComponent();
    expect(wrapper.find(ProgramsList).exists()).to.be.true;
    expect(wrapper.find('h1').text()).to.equal('Test Institution');
    expect(wrapper.find('h2').exists()).to.be.true;
    expect(wrapper.find('VaSearchInput')).to.have.lengthOf(1);
    expect(wrapper.find('VaButton')).to.have.lengthOf(1);
    expect(wrapper.find('VaPagination')).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('calculates total pages correctly', () => {
    const wrapper = mountComponent();
    const itemsPerPage = 20;
    const totalPages = Math.ceil(gradPrograms.length / itemsPerPage);
    expect(wrapper.find('VaPagination').prop('pages')).to.equal(totalPages);
    wrapper.unmount();
  });

  it('slices programs correctly for the current page', () => {
    const wrapper = mountComponent();
    const currentPage = 2;
    wrapper.find('VaPagination').prop('onPageSelect')({
      detail: { page: currentPage },
    });
    wrapper.update();
    const expectedPrograms = gradPrograms.slice(
      (currentPage - 1) * 20,
      currentPage * 20,
    );
    const displayedPrograms = wrapper.find('li').map(node => node.text());
    expect(displayedPrograms).to.deep.equal(expectedPrograms);
    wrapper.unmount();
  });

  it('handles search input correctly', () => {
    const wrapper = mountComponent();
    const searchQuery = 'CERT WEB DEVELOPMENT CERTIFICATE';
    wrapper
      .find('VaSearchInput')
      .simulate('input', { target: { value: searchQuery } });
    wrapper.update();
    const displayedPrograms = wrapper.find('li').map(node => node.text());
    expect(displayedPrograms).to.deep.equal([searchQuery]);
    wrapper.unmount();
  });
});
