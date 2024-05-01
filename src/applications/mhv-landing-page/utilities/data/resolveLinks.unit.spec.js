/* eslint-disable camelcase */
import { expect } from 'chai';
import resolveLinks, { toggleLink } from './resolveLinks';
import manifest from '../../manifest.json';

const initializeFeatureToggles = ({
  mhvLinkOneEnabled = false,
  mhvLinkTwoEnabled = false,
}) => {
  return {
    mhv_link_one_enabled: mhvLinkOneEnabled,
    mhv_link_two_enabled: mhvLinkTwoEnabled,
  };
};

const link = {
  href: '/new',
  text: 'New text',
  oldHref: '/old',
  oldText: 'Old text',
  toggle: '',
};

describe(`${manifest.appName} -- utilities/data/resolveLinks.js`, () => {
  describe('toggleLink', () => {
    it('returns old link when no toggle matches', () => {
      const toggles = initializeFeatureToggles({});
      let result = toggleLink(link, toggles);
      expect(result.href).to.equal('/old');
      expect(result.text).to.equal('Old text');

      result = toggleLink({ ...link, toggle: null }, toggles);
      expect(result.href).to.equal('/old');
      expect(result.text).to.equal('Old text');

      result = toggleLink({ ...link, toggle: 'unknown_toggle_name' }, toggles);
      expect(result.href).to.equal('/old');
      expect(result.text).to.equal('Old text');
    });

    it('returns old link when feature toggle off', async () => {
      const toggles = initializeFeatureToggles({ mhvLinkOneEnabled: false });
      const linkWithToggle = { ...link, toggle: 'mhv_link_one_enabled' };
      const result = toggleLink(linkWithToggle, toggles);
      expect(result.href).to.equal('/old');
      expect(result.text).to.equal('Old text');
    });

    it('returns new link when feature toggle on', async () => {
      const toggles = initializeFeatureToggles({ mhvLinkOneEnabled: true });
      const linkWithToggle = { ...link, toggle: 'mhv_link_one_enabled' };
      const result = toggleLink(linkWithToggle, toggles);
      expect(result.href).to.equal('/new');
      expect(result.text).to.equal('New text');
    });

    it('returns new link when old link is not present', () => {
      const toggles = initializeFeatureToggles({});
      const result = toggleLink({ href: '/new', text: 'New text' }, toggles);
      expect(result.href).to.equal('/new');
      expect(result.text).to.equal('New text');
    });
  });

  describe('resolveLinks', () => {
    it('excludes a link when href is falsy', () => {
      const toggles = initializeFeatureToggles({});
      const links = [
        { oldHref: null, text: 'Null' },
        { href: null, text: 'Null' },
        { oldHref: '', text: 'Empty' },
        { href: '', text: 'Empty' },
      ];
      expect(resolveLinks(links, toggles).length).to.eq(0);
    });

    it('excludes the old link when feature toggle is on', () => {
      const toggles = initializeFeatureToggles({ mhvLinkOneEnabled: true });
      const links = [
        {
          oldHref: '/old',
          oldText: 'Old text',
          toggle: 'mhv_link_one_enabled',
        },
      ];
      expect(resolveLinks(links, toggles).length).to.eq(0);
    });

    it('returns the old link when feature toggle is off', () => {
      const toggles = initializeFeatureToggles({ mhvLinkOneEnabled: false });
      const links = [
        {
          oldHref: '/old',
          oldText: 'Old text',
          toggle: 'mhv_link_one_enabled',
        },
      ];
      expect(resolveLinks(links, toggles).length).to.eq(1);
    });
  });
});
