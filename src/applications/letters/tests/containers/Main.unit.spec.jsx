import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom-v5-compat';

import { Main } from '../../containers/Main';
import { AVAILABILITY_STATUSES } from '../../utils/constants';

const TestComponent = () => <div data-testid="children" />;

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
    const screen = render(
      <MemoryRouter>
        <Routes>
          <Route element={<Main {...props} />}>
            <Route path="/" element={<TestComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('children')).to.exist;
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
    const screen = render(
      <MemoryRouter>
        <Routes>
          <Route element={<Main {...props} />}>
            <Route path="/" element={<TestComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('children')).to.exist;
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
