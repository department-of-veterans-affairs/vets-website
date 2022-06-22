// 3rd-party imports
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

// 1st-party imports
import * as isBrowser from '~/platform/site-wide/helpers/detection/is-browser';
import * as useOnLoadedHook from '~/platform/site-wide/hooks/events/use-on-loaded';
import { Header } from '.';

describe('Header <Header>', () => {
  const renderHeader = () => shallow(<Header showMegaMenu showNavLogin />);
  const stubIsBrowserIE = () => sinon.stub(isBrowser, 'isBrowserIE');
  const stubUseOnLoadedHook = () => sinon.stub(useOnLoadedHook, 'useOnLoaded');

  // Stubs
  let isBrowserIEStub;
  let useOnLoadedHookStub;
  // Component Wrapper
  let wrapper;

  beforeEach(() => {
    // Set up.
    wrapper = renderHeader();
  });

  it('renders content', () => {
    // Assertions.
    expect(wrapper.find('OfficialGovtWebsite')).to.have.lengthOf(1);
    expect(wrapper.find('VeteranCrisisLine')).to.have.lengthOf(1);
    expect(wrapper.find('Connect(LogoRow)')).to.have.lengthOf(1);
    expect(wrapper.find('Connect(Menu)')).to.have.lengthOf(1);
  });

  describe('IE Deprecation Notice should render', () => {
    before(() => {
      isBrowserIEStub = stubIsBrowserIE();
      useOnLoadedHookStub = stubUseOnLoadedHook();

      isBrowserIEStub.returns(true);
      useOnLoadedHookStub.returns(true);
    });

    it('when using IE', () => {
      expect(wrapper.find('va-banner')).to.have.lengthOf(1);
    });

    afterEach(() => {
      isBrowserIEStub.restore();
      useOnLoadedHookStub.restore();
    });
  });

  describe('IE Deprecation Notice should not render', () => {
    before(() => {
      useOnLoadedHookStub = stubUseOnLoadedHook();
      useOnLoadedHookStub.returns(true);
    });

    it('when using a modern browser', () => {
      expect(wrapper.find('va-banner')).to.have.lengthOf(0);
    });

    afterEach(() => {
      useOnLoadedHookStub.restore();
    });
  });

  afterEach(() => {
    // Clean up.
    wrapper.unmount();
  });
});
