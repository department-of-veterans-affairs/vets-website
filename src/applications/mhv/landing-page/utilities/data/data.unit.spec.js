/* eslint-disable camelcase */
import { expect } from 'chai';
import { countUnreadMessages, resolveToggleLink } from './index';
import manifest from '../../manifest.json';
import {
  allFoldersWithUnreadMessages,
  oneFolderWithUnreadMessages,
} from '../../api/mocks/folders';

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
    describe('countUnreadMessages', () => {
      it('should return correct count for multiple folders', () => {
        const count = countUnreadMessages(allFoldersWithUnreadMessages);

        expect(count).to.equal(29);
      });

      it('should return correct count for single folder', () => {
        const count = countUnreadMessages(oneFolderWithUnreadMessages);

        expect(count).to.equal(68);
      });

      it('should return 0 if undefined', () => {
        const count = countUnreadMessages();

        expect(count).to.equal(0);
      });
    });
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
  });
});
