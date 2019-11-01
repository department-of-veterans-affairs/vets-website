# taxonomy_term

CMS export returned **150** records.

**This does not seem like it's used currently.**

## Missing properties in CMS export:

None. 😎

## `target_id`s:

- `administration` (e.g. `Sections`)
- `health_care_service_taxonomy` (e.g. `VHA health service taxonomy`)

## All standard key-value pairs:

- `changed`
- `default_langcode`
- `description`
- `langcode`
- `name`
- `parent`
- `path`
- `status`
- `uuid`
- `vid`
- `weight`

## All optional key-value pairs:

- target_id: `administration` (e.g. `Sections`)
  - `field_acronym` | Text (plain)
  - `field_description` | Text (plain)
  - `field_intro_text` | Text (plain, long)
  - `field_link` | Link
  - `field_email_updates_link_text` | Text (plain)
  - `field_metatags` | Meta tags
  - `field_social_media_links` | Social Media Links Field
  - `field_email_updates_url` | Text (plain)
- target_id: `health_care_service_taxonomy` (e.g. `VHA health service taxonomy`)
  - `field_commonly_treated_condition` | Text (plain)
  - `field_health_service_api_id` | Text (plain)
  - `field_owner` | Entity reference
  - `field_also_known_as` | Text (plain)
  - `field_vha_healthservice_stopcode` | Number (integer)

## Example CMS export data

```json
{
    "uuid": [
        {
            "value": "595532fa-2412-40f7-88ab-107fd9fa8ebb"
        }
    ],
    "langcode": [
        {
            "value": "en"
        }
    ],
    "vid": [
        {
            "target_id": "administration",
            "target_type": "taxonomy_vocabulary",
            "target_uuid": "645055c5-e567-4683-b6db-459ce04522ce"
        }
    ],
    "status": [
        {
            "value": true
        }
    ],
    "name": [
        {
            "value": "VISN 17"
        }
    ],
    "description": [
        {
            "value": null,
            "format": null
        }
    ],
    "weight": [
        {
            "value": 12
        }
    ],
    "parent": [
        {
            "target_type": "taxonomy_term",
            "target_uuid": "a9526e03-dda4-4dcc-b928-fcc5e56f4e5f"
        }
    ],
    "changed": [
        {
            "value": "2019-09-24T18:02:18+00:00",
            "format": "Y-m-d\\TH:i:sP"
        }
    ],
    "default_langcode": [
        {
            "value": true
        }
    ],
    "path": [
        {
            "alias": "\/section\/veterans-health-administration\/visn-17",
            "langcode": "en",
            "pathauto": 1
        }
    ],
    "field_acronym": [],
    "field_description": [
        {
            "value": "VA Heart of Texas Healthcare System, serving Texas"
        }
    ],
    "field_email_updates_link_text": [],
    "field_email_updates_url": [],
    "field_intro_text": [],
    "field_link": [],
    "field_metatags": [],
    "field_social_media_links": [
        {
            "platform": null,
            "value": null,
            "platform_values": {
                "facebook": {
                    "value": ""
                },
                "instagram": {
                    "value": ""
                },
                "linkedin": {
                    "value": ""
                },
                "twitter": {
                    "value": ""
                },
                "youtube": {
                    "value": ""
                },
                "youtube_channel": {
                    "value": ""
                }
            }
        }
    ]
}
```


## Example GraphQL response

**[Unable to locate...](../../../../../../.cache/localhost/drupal/pages.json)**
