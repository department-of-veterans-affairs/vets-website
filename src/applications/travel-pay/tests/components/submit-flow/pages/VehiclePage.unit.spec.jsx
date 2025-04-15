import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import VehiclePage from '../../../../components/submit-flow/pages/VehiclePage';
import SmocContextProvider from '../../../../context/SmocContext';

describe('Vehicle page', () => {
  const setPageIndex = sinon.spy();
  const setIsUnsupportedClaimType = sinon.spy();

  const props = {
    pageIndex: 2,
    setPageIndex,
    yesNo: {
      mileage: 'yes',
      vehicle: '',
      address: '',
    },
    setYesNo: () => {},
    setIsUnsupportedClaimType,
  };

  it('should render correctly', () => {
    const screen = render(
      <SmocContextProvider>
        <VehiclePage />
      </SmocContextProvider>,
    );

    expect(screen.getByTestId('vehicle-test-id')).to.exist;
    expect($('va-radio')).to.have.attribute(
      'label',
      'Did you travel in your own vehicle?',
    );
    expect($('va-radio')).to.not.have.attribute('error');
    expect($('va-button-pair')).to.exist;

    fireEvent.click(
      $(
        `va-additional-info[trigger="If you didn't travel in your own vehicle"]`,
      ),
    );
    expect(
      screen.getByText(
        /bus, train, taxi, or other authorized public transportation/i,
      ),
    ).to.exist;
  });

  it('should render an error if no selection made', () => {
    const screen = render(
      <SmocContextProvider>
        <VehiclePage />
      </SmocContextProvider>,
    );

    expect(screen.getByTestId('vehicle-test-id')).to.exist;
    $('va-button-pair').__events.primaryClick(); // continue
    expect($('va-radio')).to.have.attribute(
      'error',
      'You must make a selection to continue.',
    );
  });

  it('should render an error selection is "no"', () => {
    render(
      <SmocContextProvider
        value={{ ...props, yesNo: { ...props.yesNo, vehicle: 'no' } }}
      >
        <VehiclePage />
      </SmocContextProvider>,
    );
    $('va-button-pair').__events.primaryClick(); // continue

    expect(setIsUnsupportedClaimType.calledWith(true)).to.be.true;
  });

  it('should move on to the next step if selection is "yes"', () => {
    render(
      <SmocContextProvider
        value={{ ...props, yesNo: { ...props.yesNo, vehicle: 'yes' } }}
      >
        <VehiclePage />
      </SmocContextProvider>,
    );
    $('va-button-pair').__events.primaryClick(); // continue

    expect(setIsUnsupportedClaimType.calledWith(false)).to.be.true;
    expect(setPageIndex.calledWith(3)).to.be.true;
  });

  it('should move back a step', () => {
    render(
      <SmocContextProvider value={props}>
        <VehiclePage />
      </SmocContextProvider>,
    );
    $('va-button-pair').__events.secondaryClick(); // back

    expect(setPageIndex.calledWith(1)).to.be.true;
  });
});
