import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';
import _ from 'lodash';

import { Main } from '../../../src/js/letters/containers/Main';
import { AVAILABILITY_STATUSES } from '../../../src/js/letters/utils/constants';

/**
 * Define a simple child element for our component to render in tests. This
 * gets passed in on props.children per defaultProps below. We'll use the
 * testText to assert against as needed
 */
const testText = 'test child element';
const childElement = (<span>{testText}</span>);

// Destructure AVAILABILITY_STATUSES object for easier access
const {
  awaitingResponse,
  available,
  backendServiceError,
  backendAuthenticationError,
  invalidAddressProperty,
  unavailable,
  letterEligibilityError
} = AVAILABILITY_STATUSES;

const defaultProps = {
  letters: { },
  destination: { },
  lettersAvailability: available,
  benefitSummaryOptions: {
    benefitInfo: '',
    serviceInfo: '',
  },
  optionsAvailable: {},
  getLetterList: () => {},
  getMailingAddress: () => {},
  getBenefitSummaryOptions: () => {},
  getAddressCountries: () => {},
  getAddressStates: () => {},
  children: childElement,
};

describe('<Main>', () => {
  it('renders', () => {
    const tree = SkinDeep.shallowRender(<Main {...defaultProps}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  it('renders its children when letters are available', () => {
    const tree = SkinDeep.shallowRender(<Main {...defaultProps}/>);
    const childText = tree.subTree('span').text();
    expect(childText).to.equal(testText);
  });

  it('shows a loading spinner when awaiting response', () => {
    const props = _.merge({}, defaultProps, { lettersAvailability: awaitingResponse });
    const tree = SkinDeep.shallowRender(<Main {...props}/>);
    expect(tree.subTree('LoadingIndicator')).to.not.be.false;
  });

  it('shows a system down message for backend service error', () => {
    const props = _.merge({}, defaultProps, { lettersAvailability: backendServiceError });
    const tree = SkinDeep.shallowRender(<Main {...props}/>);
    expect(tree.subTree('#systemDownMessage')).to.not.be.false;
  });

  it('should show backend authentication error', () => {
    const props = _.merge({}, defaultProps, { lettersAvailability: backendAuthenticationError });
    const tree = SkinDeep.shallowRender(<Main {...props}/>);
    expect(tree.subTree('#recordNotFound')).to.not.be.false;
  });

  it('should show system down message for invalid address error', () => {
    const props = _.merge({}, defaultProps, { lettersAvailability: invalidAddressProperty });
    const tree = SkinDeep.shallowRender(<Main {...props}/>);
    expect(tree.subTree('#systemDownMessage')).to.not.be.false;
  });

  it('renders children for letter eligibility errors', () => {
    const props = _.merge({}, defaultProps, { lettersAvailability: letterEligibilityError });
    const tree = SkinDeep.shallowRender(<Main {...props}/>);
    const childText = tree.subTree('span').text();
    expect(childText).to.equal(testText);
  });

  it('should show letters unavailable message when service is unavailable', () => {
    const props = _.merge({}, defaultProps, { lettersAvailability: unavailable });
    const tree = SkinDeep.shallowRender(<Main {...props}/>);
    expect(tree.subTree('#lettersUnavailable')).to.not.be.false;
  });

  it('renders system down message for all unspecified errors', () => {
    const props = _.merge({}, defaultProps, { lettersAvailability: 'bogusError' });
    const tree = SkinDeep.shallowRender(<Main {...props}/>);
    expect(tree.subTree('#systemDownMessage')).to.not.be.false;
  });

  it('fetches all necessary data after mounting', () => {
    const spies = {
      getLetterList: sinon.spy(),
      getMailingAddress: sinon.spy(),
      getBenefitSummaryOptions: sinon.spy(),
      getAddressCountries: sinon.spy(),
      getAddressStates: sinon.spy(),
    };

    const props = _.merge({}, defaultProps, spies);
    const tree = SkinDeep.shallowRender(<Main {...props}/>);
    const instance = tree.getMountedInstance();
    // mounted instance doesn't call lifecycle methods automatically so...
    instance.componentDidMount();
    expect(props.getLetterList.callCount).to.equal(1);
    expect(props.getMailingAddress.callCount).to.equal(1);
    expect(props.getBenefitSummaryOptions.callCount).to.equal(1);
    expect(props.getAddressCountries.callCount).to.equal(1);
    expect(props.getAddressStates.callCount).to.equal(1);
  });
});
