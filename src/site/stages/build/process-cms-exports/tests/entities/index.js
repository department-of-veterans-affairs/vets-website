module.exports = {
  /* eslint-disable camelcase */
  // block_content
  'block_content-alert': require('./block_content/alert.json'),
  'block_content-promo': require('./block_content/promo.json'),
  'block_content-consumer': require('./consumer/index.json'),
  'block_content-crop': require('./crop/index.json'),
  'block_content-entity_subqueue': require('./entity_subqueue/index.json'),
  'block_content-file': require('./file/index.json'),

  // media
  'media-document': require('./media/document.json'),
  'media-image': require('./media/image.json'),
  'media-video': require('./media/video.json'),
  'media-menu_link_content': require('./menu_link_content/index.json'),

  // node
  // documentation_page: require('./node/documentation_page.json'), // THIS IS MISSING.
  'node-event': require('./node/event.json'),
  'node-event_listing': require('./node/event_listing.json'),
  'node-full_width_banner_alert': require('./node/full_width_banner_alert.json'),
  'node-health_care_local_facility': require('./node/health_care_local_facility.json'),
  'node-health_care_local_health_service': require('./node/health_care_local_health_service.json'),
  'node-health_care_region_detail_page': require('./node/health_care_region_detail_page.json'),
  'node-health_care_region_page': require('./node/health_care_region_page.json'),
  'node-news_story': require('./node/news_story.json'),
  'node-office': require('./node/office.json'),
  'node-outreach_asset': require('./node/outreach_asset.json'),
  'node-page': require('./node/page.json'),
  'node-person_profile': require('./node/person_profile.json'),
  'node-press_release': require('./node/press_release.json'),
  'node-regional_health_care_service_des': require('./node/regional_health_care_service_des.json'),
  'node-support_service': require('./node/support_service.json'),
  'node-vamc_operating_status_and_alerts': require('./node/vamc_operating_status_and_alerts.json'),

  // paragraph
  // address: require('./paragraph/address.json'), // THIS IS MISSING.
  'paragraph-alert': require('./paragraph/alert.json'),
  'paragraph-collapsible_panel': require('./paragraph/collapsible_panel.json'),
  'paragraph-collapsible_panel_item': require('./paragraph/collapsible_panel_item.json'),
  'paragraph-downloadable_file': require('./paragraph/downloadable_file.json'),
  'paragraph-expandable_text': require('./paragraph/expandable_text.json'),
  'paragraph-health_care_local_facility_servi': require('./paragraph/health_care_local_facility_servi.json'),
  'paragraph-link_teaser': require('./paragraph/link_teaser.json'),
  'paragraph-list_of_link_teasers': require('./paragraph/list_of_link_teasers.json'),
  'paragraph-media': require('./paragraph/media.json'),
  'paragraph-number_callout': require('./paragraph/number_callout.json'),
  'paragraph-process': require('./paragraph/process.json'),
  'paragraph-q_a': require('./paragraph/q_a.json'),
  'paragraph-q_a_section': require('./paragraph/q_a_section.json'),
  'paragraph-react_widget': require('./paragraph/react_widget.json'),
  // situation_update: require('./paragraph/situation_update.json'), // THIS IS MISSING.
  'paragraph-spanish_translation_summary': require('./paragraph/spanish_translation_summary.json'),
  'paragraph-staff_profile': require('./paragraph/staff_profile.json'),
  'paragraph-table': require('./paragraph/table.json'),
  'paragraph-wysiwyg': require('./paragraph/wysiwyg.json'),
  'paragraph-redirect': require('./redirect/index.json'),
  'paragraph-section_association': require('./section_association/index.json'),

  // taxonomy_term
  'taxonomy_term-administration': require('./taxonomy_term/administration.json'),
  'taxonomy_term-health_care_service_taxonomy': require('./taxonomy_term/health_care_service_taxonomy.json'),
  'taxonomy_term-user': require('./user/index.json'),
};
