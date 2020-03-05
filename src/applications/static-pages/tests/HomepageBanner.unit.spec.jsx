import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import yaml from 'js-yaml';

import HomepageBanner from '../homepage-banner/HomepageBanner';

function setupResponse(config) {
  const defaults = {
    visible: true,
    type: 'warning',
    title: 'Unit test',
    content: 'Some HTML',
  };

  const configYml = yaml.safeDump(Object.assign(defaults, config));

  const response = {
    text() {
      return configYml;
    },
  };

  mockFetch(response);
}

describe('<HomepageBanner/>', () => {
  afterEach(() => {
    resetFetch();
  });

  it('should fetch and render from YML', done => {
    setupResponse({ content: 'My unit test' });

    const tree = shallow(<HomepageBanner />);

    expect(tree.html()).to.be.null;

    setTimeout(() => {
      expect(tree.html()).to.contain('My unit test');
      tree.unmount();
      done();
    }, 0);
  });

  it('should not render when visibility is false in YML', done => {
    setupResponse({ visible: false });

    const tree = shallow(<HomepageBanner />);

    expect(tree.html()).to.be.null;

    setTimeout(() => {
      expect(tree.html()).to.be.null;
      tree.unmount();
      done();
    }, 0);
  });

  it('should dismiss the banner and persist as closed after the close button is clicked', done => {
    setupResponse();

    const tree = shallow(<HomepageBanner />);

    expect(tree.html()).to.be.null;

    setTimeout(() => {
      expect(tree.html()).to.not.be.null;

      tree
        .find('AlertBox')
        .dive()
        .find('button')
        .simulate('click');

      expect(tree.html()).to.be.null;
      tree.unmount();

      // Create a fresh tree to ensure dismiss is persisted across reloads.
      const reloadedTree = shallow(<HomepageBanner />);
      setTimeout(() => {
        expect(reloadedTree.html()).to.be.null;

        setupResponse({
          title: 'A new banner',
        });

        // Do another reload but with a new banner title to ensure new banners
        // will require a fresh click to dismiss it.
        const reloadedTreeWithNewConfig = shallow(<HomepageBanner />);
        setTimeout(() => {
          expect(reloadedTreeWithNewConfig.html()).to.contain('A new banner');
          done();
        }, 0);
      }, 0);
    }, 0);
  });

  it('sanitizes HTML', done => {
    setupResponse({
      content:
        '<a href="/health-care">Testing</a> <script>alert("hey")</script>',
    });

    const tree = shallow(<HomepageBanner />);

    expect(tree.html()).to.be.null;

    setTimeout(() => {
      expect(tree.html()).to.not.contain('script');
      expect(tree.html()).to.contain('href="/health-care"');
      tree.unmount();
      done();
    }, 0);
  });
});
