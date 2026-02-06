import React from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';

import { FIELD_NAMES } from 'platform/user/exportsFile';
import { FIELD_OPTION_IDS } from '@@vap-svc/constants/schedulingPreferencesConstants';
import AppointmentTimesWrapper from '../../../../components/health-care-settings/sub-tasks/AppointmentTimesWrapper';
import PreferenceSelection from '../../../../components/health-care-settings/sub-tasks/select-times/pages/PreferenceSelection';
import TimesSelection from '../../../../components/health-care-settings/sub-tasks/select-times/pages/TimesSelection';

// Mock the PreferenceSelectionContainer component
let mockGetContentComponent;
let mockGetButtons;
let capturedProps;

const MockPreferenceSelectionContainer = props => {
  capturedProps = props;
  mockGetContentComponent = props.getContentComponent;
  mockGetButtons = props.getButtons;
  return <div data-testid="preference-selection-container" />;
};

MockPreferenceSelectionContainer.propTypes = {
  emptyValue: PropTypes.array.isRequired,
  fieldName: PropTypes.string.isRequired,
  getButtons: PropTypes.func.isRequired,
  getContentComponent: PropTypes.func.isRequired,
  noPreferenceValue: PropTypes.string.isRequired,
};

describe('AppointmentTimesWrapper', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    capturedProps = null;
    mockGetContentComponent = null;
    mockGetButtons = null;

    // Mock the PreferenceSelectionContainer import
    sandbox
      .stub(
        require('../../../../components/health-care-settings/sub-tasks/PreferenceSelectionContainer'),
        'default',
      )
      .value(MockPreferenceSelectionContainer);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders without crashing', () => {
    const { container } = render(<AppointmentTimesWrapper />);
    expect(container).to.exist;
  });

  it('renders PreferenceSelectionContainer with correct props', () => {
    const { getByTestId } = render(<AppointmentTimesWrapper />);

    expect(getByTestId('preference-selection-container')).to.exist;
    expect(capturedProps).to.exist;
  });

  it('passes the correct fieldName prop', () => {
    render(<AppointmentTimesWrapper />);

    expect(capturedProps.fieldName).to.equal(
      FIELD_NAMES.SCHEDULING_PREF_APPOINTMENT_TIMES,
    );
  });

  it('passes an empty array as emptyValue', () => {
    render(<AppointmentTimesWrapper />);

    expect(capturedProps.emptyValue).to.deep.equal([]);
  });

  it('passes the correct noPreferenceValue', () => {
    render(<AppointmentTimesWrapper />);

    expect(capturedProps.noPreferenceValue).to.equal(
      FIELD_OPTION_IDS[FIELD_NAMES.SCHEDULING_PREF_APPOINTMENT_TIMES]
        .NO_PREFERENCE,
    );
  });

  describe('getContentComponent', () => {
    it('returns PreferenceSelection component when step is "select"', () => {
      render(<AppointmentTimesWrapper />);

      const Component = mockGetContentComponent('select');
      expect(Component).to.equal(PreferenceSelection);
    });

    it('returns TimesSelection component when step is not "select"', () => {
      render(<AppointmentTimesWrapper />);

      const Component = mockGetContentComponent('times');
      expect(Component).to.equal(TimesSelection);
    });

    it('returns TimesSelection component when step is "confirm"', () => {
      render(<AppointmentTimesWrapper />);

      const Component = mockGetContentComponent('confirm');
      expect(Component).to.equal(TimesSelection);
    });
  });

  describe('getButtons', () => {
    let handlers;

    beforeEach(() => {
      handlers = {
        continue: sinon.spy(),
        breadCrumbClick: sinon.spy(),
        save: sinon.spy(),
      };
    });

    it('returns VaButtonPair with Continue and Cancel buttons for initial step', () => {
      render(<AppointmentTimesWrapper />);

      const buttons = mockGetButtons('select', false, handlers);
      expect(buttons).to.exist;
      expect(buttons.props.leftButtonText).to.equal('Continue');
      expect(buttons.props.rightButtonText).to.equal('Cancel');
      expect(buttons.props.onPrimaryClick).to.equal(handlers.continue);
      expect(buttons.props.onSecondaryClick).to.equal(handlers.breadCrumbClick);
      expect(buttons.props['data-testid']).to.equal('continue-cancel-buttons');
    });

    it('returns VaButtonPair with Save and Cancel buttons when quickExit is true', () => {
      render(<AppointmentTimesWrapper />);

      const buttons = mockGetButtons('select', true, handlers);
      expect(buttons).to.exist;
      expect(buttons.props.leftButtonText).to.equal('Save to profile');
      expect(buttons.props.rightButtonText).to.equal('Cancel');
      expect(buttons.props.onPrimaryClick).to.equal(handlers.save);
      expect(buttons.props.onSecondaryClick).to.equal(handlers.breadCrumbClick);
      expect(buttons.props['data-testid']).to.equal('save-cancel-buttons');
    });

    it('returns VaButtonPair with Save and Cancel buttons when step is "confirm"', () => {
      render(<AppointmentTimesWrapper />);

      const buttons = mockGetButtons('confirm', false, handlers);
      expect(buttons).to.exist;
      expect(buttons.props.leftButtonText).to.equal('Save to profile');
      expect(buttons.props.rightButtonText).to.equal('Cancel');
      expect(buttons.props.onPrimaryClick).to.equal(handlers.save);
      expect(buttons.props.onSecondaryClick).to.equal(handlers.breadCrumbClick);
      expect(buttons.props['data-testid']).to.equal('save-cancel-buttons');
    });

    it('returns VaButtonPair with Continue buttons when step is "times" and quickExit is false', () => {
      render(<AppointmentTimesWrapper />);

      const buttons = mockGetButtons('times', false, handlers);
      expect(buttons).to.exist;
      expect(buttons.props.leftButtonText).to.equal('Continue');
      expect(buttons.props.rightButtonText).to.equal('Cancel');
      expect(buttons.props.onPrimaryClick).to.equal(handlers.continue);
      expect(buttons.props.onSecondaryClick).to.equal(handlers.breadCrumbClick);
      expect(buttons.props['data-testid']).to.equal('continue-cancel-buttons');
    });

    it('calls the correct handler when primary button is clicked in continue mode', () => {
      render(<AppointmentTimesWrapper />);

      const buttons = mockGetButtons('select', false, handlers);
      buttons.props.onPrimaryClick();
      expect(handlers.continue.calledOnce).to.be.true;
      expect(handlers.save.called).to.be.false;
    });

    it('calls the correct handler when primary button is clicked in save mode', () => {
      render(<AppointmentTimesWrapper />);

      const buttons = mockGetButtons('confirm', false, handlers);
      buttons.props.onPrimaryClick();
      expect(handlers.save.calledOnce).to.be.true;
      expect(handlers.continue.called).to.be.false;
    });

    it('calls breadCrumbClick handler when secondary button is clicked', () => {
      render(<AppointmentTimesWrapper />);

      const buttons = mockGetButtons('select', false, handlers);
      buttons.props.onSecondaryClick();
      expect(handlers.breadCrumbClick.calledOnce).to.be.true;
    });
  });

  describe('integration with PreferenceSelectionContainer', () => {
    it('passes getContentComponent function to PreferenceSelectionContainer', () => {
      render(<AppointmentTimesWrapper />);

      expect(capturedProps.getContentComponent).to.be.a('function');
    });

    it('passes getButtons function to PreferenceSelectionContainer', () => {
      render(<AppointmentTimesWrapper />);

      expect(capturedProps.getButtons).to.be.a('function');
    });

    it('ensures all required props are passed to PreferenceSelectionContainer', () => {
      render(<AppointmentTimesWrapper />);

      expect(capturedProps).to.have.property('emptyValue');
      expect(capturedProps).to.have.property('getContentComponent');
      expect(capturedProps).to.have.property('getButtons');
      expect(capturedProps).to.have.property('fieldName');
      expect(capturedProps).to.have.property('noPreferenceValue');
    });
  });
});
