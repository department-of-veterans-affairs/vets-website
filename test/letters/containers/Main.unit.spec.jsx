import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import _ from 'lodash';

import { Main } from '../../../src/js/letters/containers/Main';

const defaultProps = {
  lettersAvailability: 'available',
  letters: { }
};

describe('<Main>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<Main {...defaultProps}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  it('should not show loading spinner when letters are available', () => {
    const props = _.merge({}, defaultProps, { lettersAvailability: 'available' });
    const tree = SkinDeep.shallowRender(<Main {...props}/>);
    expect(tree.subTree('LoadingIndicator')).to.be.false;
  });

  it('should show loading spinner when waiting for response', () => {
    const props = _.merge({}, defaultProps, { lettersAvailability: 'awaitingResponse' });
    const tree = SkinDeep.shallowRender(<Main {...props}/>);
    expect(tree.subTree('LoadingIndicator')).to.be.ok;
  });

  it('should show system down message for backend service error', () => {
    const props = _.merge({}, defaultProps, { lettersAvailability: 'backendServiceError' });
    const tree = SkinDeep.shallowRender(<Main {...props}/>);
    expect(tree.subTree('#systemDownMessage')).to.be.ok;
  });

  it('should show backend authentication error', () => {
    const props = _.merge({}, defaultProps, { lettersAvailability: 'backendAuthenticationError' });
    const tree = SkinDeep.shallowRender(<Main {...props}/>);
    expect(tree.subTree('#recordNotFound')).to.be.ok;
  });

  it('should show system down message for invalid address error', () => {
    const props = _.merge({}, defaultProps, { lettersAvailability: 'invalidAddressProperty' });
    const tree = SkinDeep.shallowRender(<Main {...props}/>);
    expect(tree.subTree('#systemDownMessage')).to.be.ok;
  });

  it('should show letters unavailable message when service is unavailable', () => {
    const props = _.merge({}, defaultProps, { lettersAvailability: 'unavailable' });
    const tree = SkinDeep.shallowRender(<Main {...props}/>);
    expect(tree.subTree('#lettersUnavailable')).to.be.ok;
  });
});
