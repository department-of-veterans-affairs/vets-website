import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import { Main } from '../../../src/js/letters/containers/Main';

const defaultProps = {
  letters: { },
  destination: { },
  lettersAvailability: 'available',
  benefitSummaryOptions: {
    benefitInfo: '',
    serviceInfo: '',
  },
  optionsAvailable: {},
  getLetterList: () => {},
  getMailingAddress: () => {},
  getBenefitSummaryOptions: () => {},
  getAddressCountries: () => {},
  getAddressStates: () => {}
};

const testText = 'test child element';
const children = (<span>{testText}</span>);

describe('<Main>', () => {
  it('renders', () => {
    const tree = SkinDeep.shallowRender(<Main {...defaultProps}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  it('renders its children when letters are available', () => {
    const props = { ...defaultProps, children };
    const tree = SkinDeep.shallowRender(<Main {...props}/>);
    const childText = tree.subTree('span').text();
    expect(childText).to.equal(testText);
  });

  it('shows a loading spinner when awaiting response', () => {
    const props = { ...defaultProps, lettersAvailability: 'awaitingResponse' };
    const tree = SkinDeep.shallowRender(<Main {...props}/>);
    expect(tree.subTree('LoadingIndicator')).to.be.ok;
  });

  it('shows a system down message for backend service error', () => {
    const props = { ...defaultProps, lettersAvailability: 'backendServiceError' };
    const tree = SkinDeep.shallowRender(<Main {...props}/>);
    expect(tree.subTree('#systemDownMessage')).to.be.ok;
  });

  it('should show backend authentication error', () => {
    const props = { ...defaultProps, lettersAvailability: 'backendAuthenticationError' };
    const tree = SkinDeep.shallowRender(<Main {...props}/>);
    expect(tree.subTree('#recordNotFound')).to.be.ok;
  });

  it('should show system down message for invalid address error', () => {
    const props = { ...defaultProps, lettersAvailability: 'invalidAddressProperty' };
    const tree = SkinDeep.shallowRender(<Main {...props}/>);
    expect(tree.subTree('#systemDownMessage')).to.be.ok;
  });

  it('renders children for letter eligibility errors', () => {
    const props = { ...defaultProps, lettersAvailability: 'letterEligibilityError', children };
    const tree = SkinDeep.shallowRender(<Main {...props}/>);
    const childText = tree.subTree('span').text();
    expect(childText).to.equal(testText);
  });

  it('should show letters unavailable message when service is unavailable', () => {
    const props = { ...defaultProps, lettersAvailability: 'unavailable' };
    const tree = SkinDeep.shallowRender(<Main {...props}/>);
    expect(tree.subTree('#lettersUnavailable')).to.be.ok;
  });

  it('renders system down message for all unspecified errors', () => {
    const props = { ...defaultProps, lettersAvailability: 'bogusError' };
    const tree = SkinDeep.shallowRender(<Main {...props}/>);
    expect(tree.subTree('#systemDownMessage')).to.be.ok;
  });

  it('fetches letter data after mounting', () => {
    const props = { ...defaultProps, getLetterList: sinon.spy() };
    const tree = SkinDeep.shallowRender(<Main {...props}/>);
    const instance = tree.getMountedInstance();
    // mounted instance doesn't call lifecycle methods automatically so...
    instance.componentDidMount();
    expect(instance.props.getLetterList.callCount).to.equal(1);
  });

  it('fetches mailing address after mounting', () => {
    const props = { ...defaultProps, getMailingAddress: sinon.spy() };
    const tree = SkinDeep.shallowRender(<Main {...props}/>);
    const instance = tree.getMountedInstance();
    instance.componentDidMount();
    expect(props.getMailingAddress.callCount).to.equal(1);
  });

  it('fetches benefit summary options after mounting', () => {
    const props = { ...defaultProps, getBenefitSummaryOptions: sinon.spy() };
    const tree = SkinDeep.shallowRender(<Main {...props}/>);
    const instance = tree.getMountedInstance();
    instance.componentDidMount();
    expect(props.getBenefitSummaryOptions.callCount).to.equal(1);
  });

  it('fetches country list after mounting', () => {
    const props = { ...defaultProps, getAddressCountries: sinon.spy() };
    const tree = SkinDeep.shallowRender(<Main {...props}/>);
    const instance = tree.getMountedInstance();
    instance.componentDidMount();
    expect(props.getAddressCountries.callCount).to.equal(1);
  });

  it('fetches state list after mounting', () => {
    const props = { ...defaultProps, getAddressStates: sinon.spy() };
    const tree = SkinDeep.shallowRender(<Main {...props}/>);
    const instance = tree.getMountedInstance();
    instance.componentDidMount();
    expect(props.getAddressStates.callCount).to.equal(1);
  });
});
