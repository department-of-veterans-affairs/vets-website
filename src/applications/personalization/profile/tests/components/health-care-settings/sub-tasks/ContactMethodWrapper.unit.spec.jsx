import React from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';

import { FIELD_NAMES } from 'platform/user/exportsFile';
import { FIELD_OPTION_IDS } from '@@vap-svc/constants/schedulingPreferencesConstants';
import ContactMethodWrapper from '../../../../components/health-care-settings/sub-tasks/ContactMethodWrapper';
import ContactMethodSelect from '../../../../components/health-care-settings/sub-tasks/contact-method/pages/ContactMethodSelect';
import ContactMethodConfirm from '../../../../components/health-care-settings/sub-tasks/contact-method/pages/ContactMethodConfirm';

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

describe('ContactMethodWrapper', () => {
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
    const { container } = render(<ContactMethodWrapper />);
    expect(container).to.exist;
  });

  it('renders PreferenceSelectionContainer with correct props', () => {
    const { getByTestId } = render(<ContactMethodWrapper />);

    expect(getByTestId('preference-selection-container')).to.exist;
    expect(capturedProps).to.exist;
  });

  it('passes the correct fieldName prop', () => {
    render(<ContactMethodWrapper />);

    expect(capturedProps.fieldName).to.equal(
      FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD,
    );
  });

  it('passes an empty string as emptyValue', () => {
    render(<ContactMethodWrapper />);

    expect(capturedProps.emptyValue).to.equal('');
  });

  it('passes the correct noPreferenceValue', () => {
    render(<ContactMethodWrapper />);

    expect(capturedProps.noPreferenceValue).to.equal(
      FIELD_OPTION_IDS[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]
        .NO_PREFERENCE,
    );
  });

  describe('getContentComponent', () => {
    it('returns ContactMethodSelect component when step is "select"', () => {
      render(<ContactMethodWrapper />);

      const Component = mockGetContentComponent('select');
      expect(Component).to.equal(ContactMethodSelect);
    });

    it('returns ContactMethodConfirm component when step is not "select"', () => {
      render(<ContactMethodWrapper />);

      const Component = mockGetContentComponent('confirm');
      expect(Component).to.equal(ContactMethodConfirm);
    });

    it('returns ContactMethodConfirm component for any non-select step', () => {
      render(<ContactMethodWrapper />);

      const Component = mockGetContentComponent('other');
      expect(Component).to.equal(ContactMethodConfirm);
    });
  });

  describe('getButtons', () => {
    let handlers;

    beforeEach(() => {
      handlers = {
        continue: sinon.spy(),
        breadCrumbClick: sinon.spy(),
        save: sinon.spy(),
        updateContactInfo: sinon.spy(),
      };
    });

    it('returns VaButtonPair with Continue and Cancel buttons for initial step', () => {
      render(<ContactMethodWrapper />);

      const buttons = mockGetButtons('select', false, handlers);
      expect(buttons).to.exist;
      expect(buttons.props.leftButtonText).to.equal('Continue');
      expect(buttons.props.rightButtonText).to.equal('Cancel');
      expect(buttons.props.onPrimaryClick).to.equal(handlers.continue);
      expect(buttons.props.onSecondaryClick).to.equal(handlers.breadCrumbClick);
      expect(buttons.props['data-testid']).to.equal('continue-cancel-buttons');
    });

    it('returns VaButtonPair with Save and Cancel buttons when quickExit is true', () => {
      render(<ContactMethodWrapper />);

      const buttons = mockGetButtons('select', true, handlers);
      expect(buttons).to.exist;
      expect(buttons.props.leftButtonText).to.equal('Save to profile');
      expect(buttons.props.rightButtonText).to.equal('Cancel');
      expect(buttons.props.onPrimaryClick).to.equal(handlers.save);
      expect(buttons.props.onSecondaryClick).to.equal(handlers.breadCrumbClick);
      expect(buttons.props['data-testid']).to.equal(
        'quick-exit-cancel-buttons',
      );
    });

    it('returns VaButtonPair with Save and Update information buttons when step is "confirm"', () => {
      render(<ContactMethodWrapper />);

      const buttons = mockGetButtons('confirm', false, handlers);
      expect(buttons).to.exist;
      expect(buttons.props.leftButtonText).to.equal('Save to profile');
      expect(buttons.props.rightButtonText).to.equal('Update information');
      expect(buttons.props.onPrimaryClick).to.equal(handlers.save);
      expect(buttons.props.onSecondaryClick).to.equal(
        handlers.updateContactInfo,
      );
      expect(buttons.props['data-testid']).to.equal('save-update-buttons');
    });

    it('uses quick-exit-cancel-buttons testid when quickExit is true but step is not confirm', () => {
      render(<ContactMethodWrapper />);

      const buttons = mockGetButtons('select', true, handlers);
      expect(buttons.props['data-testid']).to.equal(
        'quick-exit-cancel-buttons',
      );
    });

    it('calls the correct handler when primary button is clicked in continue mode', () => {
      render(<ContactMethodWrapper />);

      const buttons = mockGetButtons('select', false, handlers);
      buttons.props.onPrimaryClick();
      expect(handlers.continue.calledOnce).to.be.true;
      expect(handlers.save.called).to.be.false;
    });

    it('calls the correct handler when primary button is clicked in save mode', () => {
      render(<ContactMethodWrapper />);

      const buttons = mockGetButtons('confirm', false, handlers);
      buttons.props.onPrimaryClick();
      expect(handlers.save.calledOnce).to.be.true;
      expect(handlers.continue.called).to.be.false;
    });

    it('calls breadCrumbClick handler when secondary button is clicked in select step', () => {
      render(<ContactMethodWrapper />);

      const buttons = mockGetButtons('select', false, handlers);
      buttons.props.onSecondaryClick();
      expect(handlers.breadCrumbClick.calledOnce).to.be.true;
    });

    it('calls updateContactInfo handler when secondary button is clicked in confirm step', () => {
      render(<ContactMethodWrapper />);

      const buttons = mockGetButtons('confirm', false, handlers);
      buttons.props.onSecondaryClick();
      expect(handlers.updateContactInfo.calledOnce).to.be.true;
      expect(handlers.breadCrumbClick.called).to.be.false;
    });
  });

  describe('integration with PreferenceSelectionContainer', () => {
    it('passes getContentComponent function to PreferenceSelectionContainer', () => {
      render(<ContactMethodWrapper />);

      expect(capturedProps.getContentComponent).to.be.a('function');
    });

    it('passes getButtons function to PreferenceSelectionContainer', () => {
      render(<ContactMethodWrapper />);

      expect(capturedProps.getButtons).to.be.a('function');
    });

    it('ensures all required props are passed to PreferenceSelectionContainer', () => {
      render(<ContactMethodWrapper />);

      expect(capturedProps).to.have.property('emptyValue');
      expect(capturedProps).to.have.property('getContentComponent');
      expect(capturedProps).to.have.property('getButtons');
      expect(capturedProps).to.have.property('fieldName');
      expect(capturedProps).to.have.property('noPreferenceValue');
    });
  });
});
