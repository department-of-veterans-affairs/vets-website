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
});
