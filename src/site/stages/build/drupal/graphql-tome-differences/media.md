# media

Tome returned **539** records.

## Missing properties in Tome:

None. 😎

## All standard key-value pairs:

- `bundle`
- `changed`
- `created`
- `default_langcode`
- `field_document`
- `field_media_in_library`
- `field_media_submission_guideline`
- `field_owner`
- `langcode`
- `moderation_state`
- `name`
- `path`
- `revision_created`
- `revision_log_message`
- `revision_translation_affected`
- `revision_user`
- `status`
- `thumbnail`
- `uid`
- `uuid`

## All optional key-value pairs:

- target_id: `document`
  - `field_document` | File
  - `field_media_submission_guideline` | Markup
  - `field_owner` | Entity reference
  - `field_media_in_library` | Boolean
- target_id: `image`
  - `image` |	Image
  - `field_media_submission_guideline` |	Markup
  - `field_owner` |	Entity reference
  - `field_media_in_library` |	Boolean
- target_id: `video`
  - `field_media_submission_guideline` |	Markup
  - `field_owner` |	Entity reference
  - `field_media_in_library` |	Boolean
  - `field_media_video_embed_field` |	Video Embed

## Example Tome data

```json
{
    "uuid": [
        {
            "value": "50b14aec-b58e-4b8b-9fcf-662664d0b9f5"
        }
    ],
    "langcode": [
        {
            "value": "en"
        }
    ],
    "bundle": [
        {
            "target_id": "document",
            "target_type": "media_type",
            "target_uuid": "584b28c1-b73f-43c8-b1e9-02c86ac63d49"
        }
    ],
    "revision_created": [
        {
            "value": "2019-08-06T15:10:14+00:00",
            "format": "Y-m-d\\TH:i:sP"
        }
    ],
    "revision_user": [],
    "revision_log_message": [],
    "status": [
        {
            "value": true
        }
    ],
    "name": [
        {
            "value": "rsec-3checklist_for_continuing_review-_9-21-2009.docx"
        }
    ],
    "thumbnail": [
        {
            "alt": "",
            "title": null,
            "width": null,
            "height": null,
            "target_type": "file",
            "target_uuid": "bd3b1fc6-cb65-4def-9c2e-21cca6aa48d1"
        }
    ],
    "uid": [
        {
            "target_type": "user",
            "target_uuid": "8bea8773-6a06-4afd-99b5-1dfa7a2192ea"
        }
    ],
    "created": [
        {
            "value": "2019-08-06T15:10:14+00:00",
            "format": "Y-m-d\\TH:i:sP"
        }
    ],
    "changed": [
        {
            "value": "2019-08-21T00:57:12+00:00",
            "format": "Y-m-d\\TH:i:sP"
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
    "moderation_state": [],
    "path": [
        {
            "alias": "\/media\/document\/448",
            "langcode": "en",
            "pathauto": 1
        }
    ],
    "field_document": [
        {
            "display": null,
            "description": null,
            "target_type": "file",
            "target_uuid": "518de57b-ac63-4c6f-ac29-0de0e8ceae45"
        }
    ],
    "field_media_in_library": [
        {
            "value": true
        }
    ],
    "field_media_submission_guideline": [],
    "field_owner": [
        {
            "target_type": "taxonomy_term",
            "target_uuid": "87832236-1e54-4ce3-8141-8dec27c8a9a7"
        }
    ]
}
```

## Example GraphQL response

```json
{
  "entity": {
    "filename": "rsec-3checklist_for_continuing_review-_9-21-2009.docx",
    "url": "https://dev.cms.va.gov/sites/default/files/2019-08/rsec-3checklist_for_continuing_review-_9-21-2009.docx"
  }
}
```
