import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { fireEvent } from '@testing-library/dom';
import ClearFiltersBtn from '../../components/ClearFiltersBtn';
import { mockConstants, renderWithStoreAndRouter } from '../helpers';

describe('<ClearFiltersBtn />', () => {
  const filters = {
    schools: true,
    excludedSchoolTypes: [],
    excludeCautionFlags: true,
    accredited: true,
    studentVeteran: true,
    yellowRibbonScholarship: true,
    employers: true,
    vettec: true,
    preferredProvider: true,
    country: 'ALL',
    state: 'ALL',
    specialMissionHbcu: true,
    specialMissionMenonly: true,
    specialMissionWomenonly: true,
    specialMissionRelaffil: true,
    specialMissionHSI: true,
    specialMissionNANTI: true,
    specialMissionANNHI: true,
    specialMissionAANAPII: true,
    specialMissionPBI: true,
    specialMissionTRIBAL: true,
  };
  it('calls dispatchFilterChange on click with the correct arguments', () => {
    const dispatchFilterChangeSpy = sinon.spy();
    const screen = renderWithStoreAndRouter(
      <ClearFiltersBtn
        dispatchFilterChange={dispatchFilterChangeSpy}
        filters={filters}
        smallScreen={false}
      />,
      {
        initialState: {
          constants: mockConstants(),
        },
      },
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(dispatchFilterChangeSpy.calledOnce).to.be.false;
    expect(
      dispatchFilterChangeSpy.calledWith({
        ...filters,
      }),
    ).to.be.false;
  });
  it('should not render button as link when ENV not Prod', () => {
    const dispatchFilterChangeSpy = sinon.spy();
    const screen = renderWithStoreAndRouter(
      <ClearFiltersBtn
        dispatchFilterChange={dispatchFilterChangeSpy}
        filters={filters}
        smallScreen={false}
      />,
      {
        initialState: {
          constants: mockConstants(),
        },
      },
    );
    const button = screen.queryByRole('button');
    expect(button).to.not.have.class('clear-filters-button');
  });
  it('should render button with className clear-filters-button mobile-clear-filter-button', () => {
    global.window.buildType = true;
    const dispatchFilterChangeSpy = sinon.spy();
    const screen = renderWithStoreAndRouter(
      <ClearFiltersBtn
        dispatchFilterChange={dispatchFilterChangeSpy}
        filters={filters}
        smallScreen
      />,
      {
        initialState: {
          constants: mockConstants(),
        },
      },
    );
    const button = screen.queryByRole('button');
    expect(button).to.have.class('clear-filters-button');
  });
  it('should render button when ENV not Prod', () => {
    const dispatchFilterChangeSpy = sinon.spy();
    const screen = renderWithStoreAndRouter(
      <ClearFiltersBtn
        dispatchFilterChange={dispatchFilterChangeSpy}
        filters={filters}
      />,
      {
        initialState: {
          constants: mockConstants(),
        },
      },
    );
    const button = screen.getByRole('button');
    expect(button).to.have.class('clear-filters-btn');
  });
  it('should render button with className clear-filters-button when ENV is Prod', () => {
    global.window.buildType = true;
    const dispatchFilterChangeSpy = sinon.spy();
    const screen = renderWithStoreAndRouter(
      <ClearFiltersBtn
        dispatchFilterChange={dispatchFilterChangeSpy}
        filters={filters}
        smallScreen
      />,
      {
        initialState: {
          constants: mockConstants(),
        },
      },
    );
    const button = screen.getByRole('button');
    expect(button).to.have.class('clear-filters-button');
  });
  it('should render button with className clear-filters-button when ENV is Prod and not smallscreen', () => {
    global.window.buildType = true;
    const dispatchFilterChangeSpy = sinon.spy();
    const screen = renderWithStoreAndRouter(
      <ClearFiltersBtn
        dispatchFilterChange={dispatchFilterChangeSpy}
        filters={filters}
        smallScreen={false}
      />,
      {
        initialState: {
          constants: mockConstants(),
        },
      },
    );
    const button = screen.getByRole('button');
    expect(button).to.have.class('clear-filters-button');
  });
});
