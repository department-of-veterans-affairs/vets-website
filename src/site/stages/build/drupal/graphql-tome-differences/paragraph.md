# paragraph

Tome returned **4762** records.

## Missing properties in Tome:

None. 😎

## All standard key-value pairs:

- `behavior_settings`
- `created`
- `default_langcode`
- `field_link_summary`
- `field_link`
- `langcode`
- `revision_translation_affected`
- `status`
- `type`
- `uuid`

## All optional key-value pairs:

- target_id: `collapsible_panel` (e.g. `Accordion group`)
  - `field_collapsible_panel_bordered` | Boolean
  - `field_collapsible_panel_expand` | Boolean
  - `field_collapsible_panel_multi` | Boolean
  - `field_va_paragraphs` | Entity reference revisions
- target_id: `collapsible_panel_item` (e.g. `Accordion Item`)
  - `field_title` | Text (plain)
  - `field_va_paragraphs` | Entity reference revisions
  - `field_wysiwyg` | Text (formatted, long)
- target_id: `spanish_translation_summary` (e.g. `Additional information`)
  - `field_text_expander` | Text (plain)
  - `field_wysiwyg` | Text (formatted, long)
- target_id: `address` (e.g. `Address`)
  - `field_address` | Address
- target_id: `alert` (e.g. `Alert`)
  - `field_alert_block_reference` | Entity reference
  - `field_alert_heading` | Text (plain)
  - `field_alert_type` | List (text)
  - `field_va_paragraphs` | Entity reference revisions
- target_id: `media` (e.g. `Embedded image`)
  - `field_allow_clicks_on_this_image` | Boolean
  - `field_markup` | Markup
  - `field_media` | Entity reference
- target_id: `expandable_text` (e.g. `Expandable Text`)
  - `field_text_expander` | Text (plain)
  - `field_wysiwyg` | Text (formatted, long)
- target_id: `link_teaser` (e.g. `Link teaser`)
  - `field_link` | Link
  - `field_link_summary` | Text (plain)
- target_id: `downloadable_file` (e.g. `Link to file or video`)
  - `field_markup` | Markup
  - `field_media` | Entity reference
  - `field_title` | Text (plain)
- target_id: `list_of_link_teasers` (e.g. `List of link teasers`)
  - `field_title`	Text (plain)
  - `field_va_paragraphs`	Entity reference revisions
- target_id: `number_callout` (e.g. `Number callout`)
  - `field_short_phrase_with_a_number` | Text (plain)
  - `field_wysiwyg` | Text (formatted, long)
- target_id: `process` (e.g. `Process list`)
  - `field_steps` | Text (formatted, long)
- target_id: `q_a` (e.g. `Q&A`)
  - `field_answer` | Entity reference revisions
  - `field_question` | Text (plain)
- target_id: `q_a_section` (e.g. `Q&A Section`)
  - `field_accordion_display` | Boolean
  - `field_questions` | Entity reference revisions
  - `field_section_header` | Text (plain)
  - `field_section_intro` | Text (plain, long)
- target_id: `react_widget` (e.g. `React Widget`)
  - `field_button_format` | Boolean
  - `field_cta_widget` | Boolean
  - `field_default_link` | Link
  - `field_error_message` | Text (formatted)
  - `field_loading_message` | Text (plain)
  - `field_timeout` | Number (integer)
  - `field_widget_type` | Text (plain)
- target_id: `situation_update` (e.g. `Situation update`)
  - `field_date_and_time` | Date
  - `field_send_email_to_subscribers` | Boolean
  - `field_wysiwyg` | Text (formatted, long)
- target_id: `staff_profile` (e.g. `Staff profile`)
  - `field_staff_profile` | Entity reference
- target_id: `table` (e.g. `Table`)
  - `field_table` | Table Field
- target_id: `health_care_local_facility_servi` (e.g. `VAMC facility service (non-healthcare service)`)
  - `field_title` | Text (plain)
- target_id: `wysiwyg` (e.g. `WYSIWYG`)
  - `field_wysiwyg` | Text (formatted, long)

## Example Tome data

```json
{
    "uuid": [
        {
            "value": "0a2be6fb-55f2-4dd5-8a26-6c795acd6c5d"
        }
    ],
    "langcode": [
        {
            "value": "en"
        }
    ],
    "type": [
        {
            "target_id": "link_teaser",
            "target_type": "paragraphs_type",
            "target_uuid": "072db7a4-476e-41a6-ab49-c44184281451"
        }
    ],
    "status": [
        {
            "value": true
        }
    ],
    "created": [
        {
            "value": "2019-03-19T21:59:05+00:00",
            "format": "Y-m-d\\TH:i:sP"
        }
    ],
    "behavior_settings": [
        {
            "value": []
        }
    ],
    "default_langcode": [
        {
            "value": true
        }
    ],
    "revision_translation_affected": [
        {
            "value": true
        }
    ],
    "field_link": [
        {
            "uri": "https:\/\/www.va.gov\/HEALTH\/patientadvocate\/",
            "title": "VA's patient advocacy program",
            "options": []
        }
    ],
    "field_link_summary": [
        {
            "value": "Learn more about how patient advocates support Veterans at VA and what the process of working with one is like."
        }
    ]
}
```

## Example GraphQL response

```json
{
  "entity": {
    "fieldLink": {
      "url": {
        "path": "https://www.va.gov/HEALTH/patientadvocate/"
      },
      "title": "VA's patient advocacy program",
      "options": []
    },
    "fieldLinkSummary": "Learn more about how patient advocates support Veterans at VA and what the process of working with one is like."
  }
},
```
