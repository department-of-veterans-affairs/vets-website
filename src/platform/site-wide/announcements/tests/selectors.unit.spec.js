import { expect } from 'chai';
import * as selectors from '../selectors';

describe('selectAnnouncement', () => {
  let state = null;
  let config = null;

  beforeEach(() => {
    state = {
      announcements: {
        isInitialized: true,
        dismissed: [],
      },
    };

    config = {
      announcements: [
        {
          name: 'dummy1',
          paths: /^(\/some-route-1\/)$/,
        },
        {
          name: 'dummy2',
          paths: /^(\/some-route-2\/)$/,
        },
        {
          name: 'dummy3',
          paths: /^(\/some-route-3\/)$/,
        },
        {
          name: 'dummy4',
          paths: /^(\/some-route-4\/)$/,
        },
        {
          name: 'dummy5',
          paths: /^(\/some-route-5\/)$/,
        },
        {
          name: 'disabled dummy6',
          paths: /^(\/some-route-6\/)$/,
          disabled: true,
        },
        {
          name: 'dummy6',
          paths: /^(\/some-route-6\/)$/,
        },
      ],
    };
  });

  it('returns undefined when there is no announcement', () => {
    const emptyConfig = {
      announcements: [],
    };

    let result = selectors.selectAnnouncement(state, emptyConfig, '/dummy');
    expect(result).to.be.undefined;

    result = selectors.selectAnnouncement(state, config, '/not-a-match');
    expect(result).to.be.undefined;
  });

  it('selects an announcement based on path and configuration', () => {
    const result = selectors.selectAnnouncement(
      state,
      config,
      '/some-route-3/',
    );
    expect(result.name).to.be.equal('dummy3');
  });

  it('returns null when a matched annoucement has been dismissed', () => {
    state.announcements.dismissed.push('dummy3');
    const result = selectors.selectAnnouncement(
      state,
      config,
      '/some-route-3/',
    );
    expect(result).to.be.null;
  });

  it('bypasses disabled announcements and looks instead for the next match', () => {
    const result = selectors.selectAnnouncement(
      state,
      config,
      '/some-route-6/',
    );
    expect(result.name).to.be.equal(
      'dummy6',
      '"disabled dummy6" preceded "dummy6" but was ignored because of the disabled flag.',
    );
  });
});
