# paragraph

Tome returned **4762** records.


## Missing properties in Tome:

None, _I think_. 🔍

## All `target_id`s

1. `collapsible_panel`
1. `collapsible_panel_item`
1. `spanish_translation_summary`
1. `address`
1. `alert`
1. `image`
1. `expandable_text`
1. `link_teaser`
1. `downloadable_file`
1. `list_of_link_teasers`
1. `number_callout`
1. `list`
1. `q_a`
1. `q_a_section`
1. `react_widget`
1. `situation_update`
1. `staff_profile`
1. `starred_horizontal_rule`
1. `table`
1. `health_care_local_facility_servi`
1. `wysiwyg`

## Example GraphQL response

**WARNING:** There are multiple types of `paragraph`s, here's the one that looked most similar:

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
