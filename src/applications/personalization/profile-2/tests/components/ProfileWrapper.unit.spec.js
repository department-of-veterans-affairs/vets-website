// import React from 'react';
// import { shallow } from 'enzyme';
import { expect } from 'chai';
// import sinon from 'sinon';

// import backendServices from 'platform/user/profile/constants/backendServices';
// import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';

import {
  // ProfileWrapper,
  mapStateToProps,
} from '../../components/ProfileWrapper';

// These component tests are all throwing `Invariant Violation: Invalid hook
// call` errors so they are disabled for now.

// describe('ProfileWrapper', () => {
//   let wrapper;
//   const fetchMilitaryInfoSpy = sinon.spy();
//   const fetchFullNameSpy = sinon.spy();

//   beforeEach(() => {
//     const defaultProps = {
//       user: {},
//       showLoader: false,
//       fetchFullName: fetchFullNameSpy,
//       fetchMilitaryInformation: fetchMilitaryInfoSpy,
//     };

//     wrapper = shallow(<ProfileWrapper {...defaultProps} />);
//   });

//   afterEach(() => {
//     wrapper.unmount();
//   });

//   it('renders a RequiredLoginView component that requires the USER_PROFILE', () => {
//     expect(wrapper.type()).to.equal(RequiredLoginView);
//     expect(wrapper.prop('serviceRequired')).to.equal(
//       backendServices.USER_PROFILE,
//     );
//   });
//   it('should render a spinner if it is loading data', () => {
//     wrapper.setProps({ showLoader: true });
//     const loader = wrapper.find('LoadingIndicator');
//     expect(loader.length).to.equal(1);
//   });
//   it('loads the military information data when it mounts', () => {
//     expect(fetchMilitaryInfoSpy.called).to.be.true;
//   });
//   it('loads the full name data when it mounts', () => {
//     expect(fetchFullNameSpy.called).to.be.true;
//   });
// });

describe('mapStateToProps', () => {
  it('returns an object with the correct keys', () => {
    const state = {};
    const props = mapStateToProps(state);
    const expectedKeys = ['user', 'showLoader'];
    expect(Object.keys(props)).to.deep.equal(expectedKeys);
  });
});
