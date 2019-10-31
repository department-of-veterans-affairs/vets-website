# (GraphQL response vs. CMS export data) by entity

## Entities and their `target_id`s

- [block_content](./block_content.md)
  - `alert`
  - `promo`

- [~~consumer~~ (not used)](./consumer.md)
  - No `target_id`s.

- [crop](./crop.md)
  - No `target_id`s.

- [~~entity_subqueue~~ (not used)](./entity_subqueue.md)
  - No `target_id`s.

- [file](./file.md)
  - No `target_id`s.

- [media](./media.md)
  - `document`
  - `image`
  - `video`

- [menu_link_content](./menu_link_content.md)
  - No `target_id`s.

- [node](./node.md)
  - `health_care_region_detail_page`
  - `documentation_page`
  - `event`
  - `event_listing`
  - `press_release`
  - `office`
  - `outreach_asset` (e.g. `Publication`)
  - `person_profile` (e.g. `Staff profile`)
  - `news_story`
  - `support_service`
  - `health_care_region_page` (e.g. `VAMC system`)
  - `full_width_banner_alert` (e.g. `VAMC system banner alert with situational updates`)
  - `health_care_local_facility` (e.g. `VAMC facility`)
  - `health_care_local_health_service` (e.g. `VAMC facility health service`)
  - `regional_health_care_service_des` (e.g. `VAMC system health service`)
  - `vamc_operating_status_and_alerts` (e.g. `VAMC system operating status`)

- [paragraph](./paragraph.md)
  - `collapsible_panel` (e.g. `Accordion group`)
  - `collapsible_panel_item` (e.g. `Accordion Item`)
  - `spanish_translation_summary` (e.g. `Additional information`)
  - `address` (e.g. `Address`)
  - `alert` (e.g. `Alert`)
  - `media` (e.g. `Embedded image`)
  - `expandable_text` (e.g. `Expandable Text`)
  - `link_teaser` (e.g. `Link teaser`)
  - `downloadable_file` (e.g. `Link to file or video`)
  - `list_of_link_teasers` (e.g. `List of link teasers`)
  - `number_callout` (e.g. `Number callout`)
  - `process` (e.g. `Process list`)
  - `q_a` (e.g. `Q&A`)
  - `q_a_section` (e.g. `Q&A Section`)
  - `react_widget` (e.g. `React Widget`)
  - `situation_update` (e.g. `Situation update`)
  - `staff_profile` (e.g. `Staff profile`)
  - `table` (e.g. `Table`)
  - `health_care_local_facility_servi` (e.g. `VAMC facility service (non-healthcare service)`)
  - `wysiwyg` (e.g. `WYSIWYG`)

- [~~redirect~~ (not used)](./redirect.md)
  - No `target_id`s.

- [~~section_association~~ (not used)](./section_association.md)
  - No `target_id`s.

- [~~taxonomy_term~~ (not used)](./taxonomy_term.md)
  - `administration` (e.g. `Sections`)
  - `health_care_service_taxonomy` (e.g. `VHA health service taxonomy`)

- [~~user~~ (not used)](./user.md)
  - No `target_id`s.

## Terminology

- `Content type` [mentioned in the CMS](https://docs.google.com/spreadsheets/d/1vL8rqLqcEVfESnJJK_GWQ7nf3BPe4SSevYYblisBTOI/edit#gid=943298572) equates to a `node` entity.
- Most key-value pairs on entities that start with `field_` are **matched to a specific `target_id`** and/or are **optional**.

## Assumptions

- Each entity included in the CMS export **always** has the same key-value pairs for that particular entity.
  - This is `invalid`. Many of the entities have various `target_id`s and each `target_id` typically has unique key-value pairs. This is now outlined in each entity's markdown file.
