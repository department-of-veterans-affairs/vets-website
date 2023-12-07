import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import { Main } from '../../containers/Main';
import { AVAILABILITY_STATUSES } from '../../utils/constants';

/**
 * Define a simple child element for our component to render in tests. This
 * gets passed in on props.children per defaultProps below. We'll use the
 * testText to assert against as needed
 */
const testText = 'test child element';
const childElement = <span>{testText}</span>;

// Destructure AVAILABILITY_STATUSES object for easier access
const {
  awaitingResponse,
  available,
  backendServiceError,
  backendAuthenticationError,
  unavailable,
  letterEligibilityError,
} = AVAILABILITY_STATUSES;

const defaultProps = {
  letters: {},
  destination: {},
  lettersAvailability: awaitingResponse,
  benefitSummaryOptions: {
    benefitInfo: '',
    serviceInfo: '',
  },
  optionsAvailable: {},
  getLetterListAndBSLOptions: () => {},
  children: childElement,
};

describe('<Main>', () => {
  it('renders', () => {
    const tree = SkinDeep.shallowRender(<Main {...defaultProps} />);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  it('shows a loading spinner when awaiting response', () => {
    const tree = SkinDeep.shallowRender(<Main {...defaultProps} />);
    expect(tree.subTree('va-loading-indicator')).to.not.be.false;
  });

  it('renders its children when letters are available', () => {
    const props = { ...defaultProps, lettersAvailability: available };
    const tree = SkinDeep.shallowRender(<Main {...props} />);
    const childText = tree.subTree('span').text();
    expect(childText).to.equal(testText);
  });

  it('shows a system down message for backend service error', () => {
    const props = { ...defaultProps, lettersAvailability: backendServiceError };
    const tree = SkinDeep.shallowRender(<Main {...props} />);
    expect(tree.subTree('#systemDownMessage')).to.not.be.false;
  });

  it('should show backend authentication error', () => {
    const props = {
      ...defaultProps,
      lettersAvailability: backendAuthenticationError,
    };
    const tree = SkinDeep.shallowRender(<Main {...props} />);
    expect(tree.subTree('#records-not-found')).to.not.be.false;
  });

  it('renders children for letter eligibility errors', () => {
    const props = {
      ...defaultProps,
      lettersAvailability: letterEligibilityError,
    };
    const tree = SkinDeep.shallowRender(<Main {...props} />);
    const childText = tree.subTree('span').text();
    expect(childText).to.equal(testText);
  });

  it('should show system down message when service is unavailable', () => {
    const props = { ...defaultProps, lettersAvailability: unavailable };
    const tree = SkinDeep.shallowRender(<Main {...props} />);
    expect(tree.subTree('#systemDownMessage')).to.not.be.false;
  });

  it('renders system down message for all unspecified errors', () => {
    const props = { ...defaultProps, lettersAvailability: 'bogusError' };
    const tree = SkinDeep.shallowRender(<Main {...props} />);
    expect(tree.subTree('#systemDownMessage')).to.not.be.false;
  });

  it('fetches all necessary data after mounting', () => {
    const spies = {
      getLetterListAndBSLOptions: sinon.spy(),
    };

    const props = { ...defaultProps, ...spies };
    const tree = SkinDeep.shallowRender(<Main {...props} />);
    const instance = tree.getMountedInstance();
    // mounted instance doesn't call lifecycle methods automatically so...
    instance.componentDidMount();
    expect(props.getLetterListAndBSLOptions.callCount).to.equal(1);
  });
});
