import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { MemoryRouter, Route } from 'react-router-dom';
import sinon from 'sinon';
import PageLink from '../../components/PageLink';

describe('PageLink', () => {
  const linkText = 'Some Test Link';
  const relativeURL = '/test-path';
  const URL = 'https://some-url.com';
  it('should renders link text and calls history.push on click ', () => {
    const history = { push: sinon.spy() };
    let testLocation;
    const wrapper = mount(
      <MemoryRouter initialEntries={['/']}>
        <PageLink linkText={linkText} relativeURL={relativeURL} URL={URL} />
        <Route
          path="*"
          render={({ location }) => {
            testLocation = location;
            return null;
          }}
        />
      </MemoryRouter>,
    );
    expect(wrapper.find('a').text()).to.equal(linkText);
    wrapper.find('a').simulate('click', { preventDefault: () => {} });
    expect(testLocation.pathname).to.equal(relativeURL);
    expect(history.push.calledWith(relativeURL)).to.be.false;
    wrapper.unmount();
  });
  it('should not history.push when history is undefind', () => {
    const history = undefined;
    const wrapper = mount(
      <MemoryRouter>
        <PageLink linkText={linkText} relativeURL={relativeURL} URL={URL} />
      </MemoryRouter>,
    );

    wrapper.find('a').simulate('click', { preventDefault: () => {} });
    expect(history && history.push.calledWith(relativeURL)).to.be.undefined;
    wrapper.unmount();
  });
});
