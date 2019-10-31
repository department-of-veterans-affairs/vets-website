# block_content

CMS export returned **28** records.

## Missing properties in CMS export:

None. 😎

## `target_id`s:

- `alert`
- `promo`

## All standard key-value pairs:
- `changed`
- `default_langcode`
- `info`
- `langcode`
- `moderation_state`
- `reusable`
- `revision_created`
- `revision_log`
- `revision_translation_affected`
- `revision_user`
- `status`
- `type`
- `uuid`

## All optional key-value pairs:

- target_id: `alert`
  - `field_alert_content` | Entity reference revisions
  - `field_alert_dismissable` | Boolean
  - `field_alert_title` | Text (plain)
  - `field_alert_type` | List (text)
  - `field_is_this_a_header_alert_` | List (text)
  - `field_owner` | Entity reference
  - `field_alert_frequency` | List (text)
  - `field_reusability` | List (text)
  - `field_node_reference` | Entity reference
- target_id: `promo`
  - `field_image` | Entity reference
  - `field_instructions` | Markup
  - `field_promo_link` | Entity reference revisions
  - `field_owner` | Entity reference

## Example CMS export data

```json
{
    "uuid": [
        {
            "value": "4a9807dc-7656-4792-b5f9-1a0a80eb2424"
        }
    ],
    "langcode": [
        {
            "value": "en"
        }
    ],
    "type": [
        {
            "target_id": "promo",
            "target_type": "block_content_type",
            "target_uuid": "0a87c177-4b3c-4cf5-bcae-1f0c432da52b"
        }
    ],
    "revision_created": [
        {
            "value": "2019-06-04T20:02:48+00:00",
            "format": "Y-m-d\\TH:i:sP"
        }
    ],
    "revision_user": [
        {
            "target_type": "user",
            "target_uuid": "c0745381-8e20-40da-9540-5a7d2eee1b35"
        }
    ],
    "revision_log": [],
    "status": [
        {
            "value": true
        }
    ],
    "info": [
        {
            "value": "Confirm your VA benefit status"
        }
    ],
    "changed": [
        {
            "value": "2019-06-04T20:02:48+00:00",
            "format": "Y-m-d\\TH:i:sP"
        }
    ],
    "reusable": [
        {
            "value": true
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
    "moderation_state": [
        {
            "value": "published"
        }
    ],
    "field_image": [
        {
            "target_type": "media",
            "target_uuid": "84efa2f5-9d94-4d54-8fc7-9c9d43021e76"
        }
    ],
    "field_instructions": [],
    "field_owner": [
        {
            "target_type": "taxonomy_term",
            "target_uuid": "cf0807aa-0b82-45cb-9c66-6bedae9555f2"
        }
    ],
    "field_promo_link": [
        {
            "target_type": "paragraph",
            "target_uuid": "69620159-bb03-45bc-915e-35147050d1d8"
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
        "path": "/records/download-va-letters"
      },
      "title": "Confirm your VA benefit status",
      "options": []
    },
    "fieldLinkSummary": "Download letters like your eligibility or award letter for certain benefits."
  }
}
```
