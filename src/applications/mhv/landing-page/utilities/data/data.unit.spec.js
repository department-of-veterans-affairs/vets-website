/* eslint-disable camelcase */
import { expect } from 'chai';
import { resolveLandingPageLinks, resolveToggleLink } from './index';
import manifest from '../../manifest.json';

const initializeFeatureToggles = ({
  mhvLinkOneEnabled = false,
  mhvLinkTwoEnabled = false,
}) => {
  return {
    // eslint-disable-next-line camelcase
    mhv_link_one_enabled: mhvLinkOneEnabled,
    // eslint-disable-next-line camelcase
    mhv_link_two_enabled: mhvLinkTwoEnabled,
  };
};

describe(manifest.appName, () => {
  describe('utilities/data', () => {
    describe('resolveToggleLink', () => {
      it('resolves to the new href when available and no toggle matches', () => {
        const link = {
          href: '/new',
          oldHref: '/old',
          text: 'This is a link',
          toggle: '',
        };

        const toggles = initializeFeatureToggles({});

        const resolvedLink = resolveToggleLink(link, toggles);

        expect(resolvedLink.href).to.equal('/new');
      });

      it('resolves to the old href if the feature toggle is off', async () => {
        const link = {
          href: '/new',
          oldHref: '/old',
          text: 'This is a link',
          toggle: 'mhv_link_one_enabled',
        };

        const toggles = initializeFeatureToggles({
          mhvLinkOneEnabled: false,
        });
        const resolvedLink = resolveToggleLink(link, toggles);

        expect(resolvedLink.href).to.equal('/old');
      });

      it('resolves to the new href if the feature toggle is on', async () => {
        const link = {
          href: '/new',
          oldHref: '/old',
          text: 'This is a link',
          toggle: 'mhv_link_one_enabled',
        };

        const toggles = initializeFeatureToggles({
          mhvLinkOneEnabled: true,
        });
        const resolvedLink = resolveToggleLink(link, toggles);

        expect(resolvedLink.href).to.equal('/new');
      });
    });
    describe('resolveLandingPageLinks', () => {
      it('includes unread message count when greater than 0', () => {
        const unreadMessageCount = 4;
        const links = resolveLandingPageLinks(
          undefined,
          { featureToggles: {} },
          unreadMessageCount,
        );

        expect(
          links.cards.some(c => c.title === `Messages [${unreadMessageCount}]`),
        ).to.be.true;
      });
    });
    it('display default header when message count is 0', () => {
      const links = resolveLandingPageLinks(
        undefined,
        { featureToggles: {} },
        0,
      );

      expect(links.cards.some(c => c.title === `Messages`)).to.be.true;
    });
    it('display default header when message count is undefined', () => {
      const links = resolveLandingPageLinks(
        undefined,
        { featureToggles: {} },
        undefined,
      );

      expect(links.cards.some(c => c.title === `Messages`)).to.be.true;
    });
  });
});
