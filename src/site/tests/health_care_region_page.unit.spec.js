import { expect } from 'chai';
import { getLayout, makeOptions, parseFixture, renderHTML } from './support';

const layout = (() => {
  const layoutPath =
    'src/site/tests/temp_layouts/health_care_region_page.drupal.liquid';
  return getLayout(layoutPath);
})();

const options = makeOptions([
  // 'src/site/includes/header.html', // has include
  'src/site/includes/alerts.drupal.liquid',
  'src/site/includes/preview-edit.drupal.liquid',
  'src/site/includes/breadcrumbs.drupal.liquid',
  'src/site/navigation/facility_sidebar_nav.drupal.liquid',
  'src/site/facilities/main_buttons.drupal.liquid',
  // 'src/site/includes/facilityListing.drupal.liquid', // has include
  'src/site/paragraphs/list_of_link_teasers_facility.drupal.liquid',
  'src/site/teasers/news_story.drupal.liquid',
  // 'src/site/teasers/event.drupal.liquid', // has include
  'src/site/facilities/facility_social_links.drupal.liquid',
  // 'src/site/includes/footer.html', // has include
  // 'src/site/includes/debug.drupal.liquid',
]);

describe('intro', () => {
  describe('no fieldTitleIcon', () => {
    const data = parseFixture('health_care_region_page');

    it('renders elements with expected values', async () => {
      const container = await renderHTML(layout, data, options);
      expect(container.querySelector('h1').innerHTML).to.equal(data.title);
      expect(container.querySelector('p').innerHTML).to.equal(
        data.fieldIntroText,
      );
      expect(
        container.querySelector('i.icon-large.white.hub-icon-foo'),
      ).to.equal(null);
    });
  });
});
