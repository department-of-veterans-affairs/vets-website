import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import * as recordEventModule from 'platform/monitoring/record-event';

import VehiclePage from '../../../../components/submit-flow/pages/VehiclePage';

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

  let recordEventStub;

  beforeEach(() => {
    recordEventStub = sinon.stub(recordEventModule, 'default');
  });

  afterEach(() => {
    recordEventStub.restore();
  });

  it('should render correctly', () => {
    const screen = render(<VehiclePage {...props} />);

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
    const screen = render(<VehiclePage {...props} />);

    expect(screen.getByTestId('vehicle-test-id')).to.exist;
    $('va-button-pair').__events.primaryClick(); // continue
    expect($('va-radio')).to.have.attribute(
      'error',
      'You must make a selection to continue.',
    );
  });

  it('should render an error selection is "no"', () => {
    render(
      <VehiclePage {...props} yesNo={{ ...props.yesNo, vehicle: 'no' }} />,
    );
    $('va-button-pair').__events.primaryClick(); // continue

    expect(
      recordEventStub.calledWith({
        event: 'smoc-questions',
        'smoc-page': 'vehicle',
        'smoc-action': 'unsupported',
      }),
    ).to.be.true;
    expect(setIsUnsupportedClaimType.calledWith(true)).to.be.true;
  });

  it('should move on to the next step if selection is "yes"', () => {
    render(
      <VehiclePage {...props} yesNo={{ ...props.yesNo, vehicle: 'yes' }} />,
    );
    $('va-button-pair').__events.primaryClick(); // continue

    expect(
      recordEventStub.calledWith({
        event: 'smoc-questions',
        'smoc-page': 'vehicle',
        'smoc-action': 'answered',
      }),
    ).to.be.true;
    expect(setIsUnsupportedClaimType.calledWith(false)).to.be.true;
    expect(setPageIndex.calledWith(3)).to.be.true;
  });

  it('should move back a step', () => {
    render(<VehiclePage {...props} />);
    $('va-button-pair').__events.secondaryClick(); // back

    expect(
      recordEventStub.calledWith({
        event: 'smoc-questions',
        'smoc-page': 'vehicle',
        'smoc-action': 'back',
      }),
    ).to.be.true;
    expect(setPageIndex.calledWith(1)).to.be.true;
  });
});
