import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('should render correctly and record pageview', () => {
    const screen = render(<VehiclePage {...props} />);

    expect(screen.getByTestId('vehicle-test-id')).to.exist;
    expect($('va-radio')).to.have.attribute(
      'label',
      'Did you travel in your own vehicle?',
    );
    expect(
      recordEventStub.calledWith({
        event: 'smoc-pageview',
        action: 'view',
        /* eslint-disable camelcase */
        heading_1: 'vehicle',
        /* eslint-enable camelcase */
      }),
    ).to.be.true;
    expect($('va-radio')).to.not.have.attribute('error');
    expect($('va-button-pair')).to.exist;
    const additionalInfoElement = screen.getByTestId('vehicle-help-text');
    expect(additionalInfoElement).to.exist;
    userEvent.click(additionalInfoElement);
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
        event: 'smoc-button',
        action: 'click',
        /* eslint-disable camelcase */
        heading_1: 'vehicle',
        link_text: 'continue',
        /* eslint-enable camelcase */
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
        event: 'smoc-button',
        action: 'click',
        /* eslint-disable camelcase */
        heading_1: 'vehicle',
        link_text: 'continue',
        /* eslint-enable camelcase */
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
        event: 'smoc-button',
        action: 'click',
        /* eslint-disable camelcase */
        heading_1: 'vehicle',
        link_text: 'back',
        /* eslint-enable camelcase */
      }),
    ).to.be.true;
    expect(setPageIndex.calledWith(1)).to.be.true;
  });
});
