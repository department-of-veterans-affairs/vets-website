import { render } from '@testing-library/react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import Sinon from 'sinon';
import MedicationsListFilter from '../../../components/MedicationsList/MedicationsListFilter';
import { filterOptions } from '../../../util/constants';

describe('Medicaitons List Filter component', () => {
  const setup = (updateFilter, filterOption, setFilterOption) => {
    return render(
      <MedicationsListFilter
        updateFilter={updateFilter}
        filterOption={filterOption}
        setFilterOption={setFilterOption}
      />,
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('renders accordion', () => {
    const screen = setup();
    const accordion = screen.getByTestId('filter-accordion');
    expect(accordion).to.exist;
  });

  it('checks radio button that matches filter option', () => {
    const { container } = render(
      <MedicationsListFilter
        updateFilter={() => {}}
        filterOption={filterOptions.ACTIVE.url}
        setFilterOption={() => {}}
      />,
    );
    const radioOptionChecked = container.querySelector(
      `va-radio-option[label="${filterOptions.ACTIVE.label}"]`,
    );
    const radioOptionUnchecked = container.querySelector(
      `va-radio-option[label="${filterOptions.RENEWAL.label}"]`,
    );

    expect(radioOptionChecked).to.exist;
    expect(radioOptionUnchecked).to.exist;

    expect(radioOptionChecked).to.have.attr('checked', 'true');
    expect(radioOptionUnchecked).to.have.attr('checked', 'false');
  });
  it('calls setFilterOption when radio button is selected ', () => {
    const setFilterOption = Sinon.spy();
    const wrapper = mount(
      <MedicationsListFilter
        updateFilter={() => {}}
        filterOption={filterOptions.ACTIVE.label}
        setFilterOption={setFilterOption}
      />,
    );

    const event = { detail: { value: `${filterOptions.RENEWAL.label}` } };
    wrapper.find('VaRadio').prop('onVaValueChange')(event);

    expect(setFilterOption.calledOnce).to.be.true;
    wrapper.unmount();
  });
  it('calls updateFilter when user presses the Filter button ', () => {
    const updateFilter = Sinon.spy();
    const wrapper = mount(
      <MedicationsListFilter
        updateFilter={updateFilter}
        filterOption={filterOptions.ACTIVE.label}
        setFilterOption={() => {}}
      />,
    );

    const filterButton = wrapper.find('VaButton');

    filterButton.simulate('click');
    expect(updateFilter.calledOnce).to.be.true;
    wrapper.unmount();
  });
});
