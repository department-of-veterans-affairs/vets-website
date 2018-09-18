import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { RateLimiter } from '../RateLimiter';

describe('<RateLimiter>', () => {

  test('should display limited content when under threshold', (done) => {
    window.sessionStorage.setItem('app_rateLimitDisabled', false);
    window.settings = {
      app: {
        rateLimitAuthed: 0,
        rateLimitUnauthed: 0
      }
    };

    const state = {
      user: {
        profile: {
          loading: true
        },
        login: {
          currentlyLoggedIn: false
        }
      }
    };
    const tree = mount(
      <RateLimiter
        id="app"
        state={state}
        renderLimitedContent={() => <div>Limited content</div>}>
        <div>Real content</div>
      </RateLimiter>
    );

    process.nextTick(() => {
      tree.update();
      expect(tree.state('rateLimitDisabled')).to.be.false;
      // expect(sessionStorage.setItem.called).to.be.false;  HACK: cannot mock session storage (https://github.com/facebook/jest/issues/6798)
      expect(tree.text()).to.contain('Limited content');
      done();
    });

  });
  test('should display loading indicator when waiting for profile', () => {
    window.settings = {
      app: {
        rateLimitAuthed: 0,
        rateLimitUnauthed: 0
      }
    };

    const state = {
      user: {
        profile: {
          loading: true
        },
        login: {
          currentlyLoggedIn: false
        }
      }
    };

    const tree = mount(
      <RateLimiter
        id="app"
        state={state}
        waitForProfile
        renderLimitedContent={() => <div>Limited content</div>}>
        <div>Real content</div>
      </RateLimiter>
    );

    expect(tree.find('LoadingIndicator').exists()).to.be.true;
    // expect(window.sessionStorage.setItem.called).to.be.false; HACK: cannot mock session storage (https://github.com/facebook/jest/issues/6798)
  });
  test('should display real content when over threshold', () => {
    window.settings = {
      app: {
        rateLimitAuthed: 1,
        rateLimitUnauthed: 1
      }
    };

    const state = {
      user: {
        profile: {
          loading: true
        },
        login: {
          currentlyLoggedIn: false
        }
      }
    };

    const tree = mount(
      <RateLimiter
        id="app"
        state={state}
        renderLimitedContent={() => <div>Limited content</div>}>
        <div>Real content</div>
      </RateLimiter>
    );

    expect(tree.text()).to.contain('Real content');
    // expect(window.sessionStorage.setItem.called).to.be.true; HACK: cannot mock session storage (https://github.com/facebook/jest/issues/6798)
  });
  test('should display real content when bypassLimit returns true', () => {
    window.settings = {
      app: {
        rateLimitAuthed: 0,
        rateLimitUnauthed: 0
      }
    };

    const state = {
      user: {
        profile: {
          loading: true
        },
        login: {
          currentlyLoggedIn: false
        }
      }
    };

    const tree = mount(
      <RateLimiter
        id="app"
        state={state}
        bypassLimit={() => true}
        renderLimitedContent={() => <div>Limited content</div>}>
        <div>Real content</div>
      </RateLimiter>
    );

    expect(tree.text()).to.contain('Real content');
  });
  test(
    'should display real content when disabled through session storage',
    (done) => {
      window.sessionStorage.setItem('app_rateLimitDisabled', 'true');
      window.settings = {
        app: {
          rateLimitAuthed: 0,
          rateLimitUnauthed: 0
        }
      };

      const state = {
        user: {
          profile: {
            loading: true
          },
          login: {
            currentlyLoggedIn: false
          }
        }
      };

      const tree = mount(
        <RateLimiter
          id="app"
          state={state}
          bypassLimit={() => false}
          renderLimitedContent={() => <div>Limited content</div>}>
          <div>Real content</div>
        </RateLimiter>
      );
      process.nextTick(() => {

        tree.update();
        expect(tree.text()).to.contain('Real content');
        done();
      });
    }
  );
  beforeEach(() => {
    window.sessionStorage.clear();
  });
  afterEach(() => {
    window.sessionStorage.clear();
    delete window.settings;
  });
});
