import React from 'react';

import { expect } from 'chai';
import { shallow } from 'enzyme';
import { spy } from 'sinon';

import createCommonStore from '../../../../../platform/startup/store';
import PrestartWrapper from '../../components/PrestartWrapper';

import { PRESTART_STATUSES } from '../../actions';
import reducer from '../../reducer';

const setPrestartStatus = spy();
const resetPrestartStatus = spy();
const defaultProps = {
  store: createCommonStore(reducer),
  setPrestartStatus,
  resetPrestartStatus,
  formConfig: { formId: '21P-526EZ' },
  savedForms: [],
  location: { pathname: 'introduction' }
};
const WrappedContent = () => <div>Wrapped Content</div>;

describe('PrestartWrapper', () => {

  const shallowWrapper = shallow(
    <PrestartWrapper {...defaultProps}/>
  );
  const mountedWrapper = shallow(
    <PrestartWrapper {...defaultProps}/>
  );

  it('render wrapped content', () => {
    expect(() => shallowWrapper.find(WrappedContent)).to.exist;
  });
  it('render loading message', () => {
    shallowWrapper.setProps({ prestartStatus: PRESTART_STATUSES.pending });
    expect(() => shallowWrapper.find('LoadingIndicator')).to.exist;
  });
  it('render error message', () => {
    shallowWrapper.setProps({ prestartStatus: PRESTART_STATUSES.notRetrievedNew });
    expect(() => shallowWrapper.find('LoadingIndicator')).to.exist;
  });
  it('set prestart status when form is entered', () => {
    mountedWrapper.instance().componentWillReceiveProps({
      location: { pathname: 'form-page' }
    });
    expect(setPrestartStatus.called).to.be.true;
  });
  // it('reset prestart status when form is exited', () => {
  //   shallowWrapper.setProps({
  //     location: { pathname: 'form-page' }
  //   });
  //   shallowWrapper.setProps({
  //     location: { pathname: 'introduction' }
  //   });
  //   expect(resetPrestartStatus.called).to.be.true;
  // });
  // it('reset display when the form is navigated through', () => {
  //   shallowWrapper.setProps({
  //     location: { pathname: 'form-page' }
  //   });
  //   shallowWrapper.setProps({
  //     location: { pathname: 'introduction' }
  //   });
  //   expect(resetPrestartStatus.called).to.be.true;
  // });
});
