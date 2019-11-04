# file

CMS export returned **606** records.

## Missing properties in CMS export:

`"url": "https://dev.cms.va.gov/sites/default/files/styles/large/public/video_thumbnails/qRYoUL6BNdc.jpg?itok=mutTJ3Cb"`

We have the URL above, we just don't have the query param `?itok=mutTJ3Cb` and it's not certain if that's different or the same for each public video thumbnail.

If it's different, then we are missing it in the CMS export data.

## `target_id`s:

None.

## All standard key-value pairs:

- `changed`
- `created`
- `filemime`
- `filename`
- `filesize`
- `langcode`
- `status`
- `uid`
- `uri`
- `uuid`

## All optional key-value pairs:

None.

## Example CMS export data

```json
{
    "uuid": [
        {
            "value": "0a3713c8-3533-4676-a894-c79ace11ea53"
        }
    ],
    "langcode": [
        {
            "value": "en"
        }
    ],
    "uid": [
        {
            "target_type": "user",
            "target_uuid": "fd71292f-3dc7-409d-b0e8-500204cb005a"
        }
    ],
    "filename": [
        {
            "value": "qRYoUL6BNdc.jpg"
        }
    ],
    "uri": [
        {
            "value": "public:\/\/video_thumbnails\/qRYoUL6BNdc.jpg"
        }
    ],
    "filemime": [
        {
            "value": "image\/jpeg"
        }
    ],
    "filesize": [
        {
            "value": 93797
        }
    ],
    "status": [
        {
            "value": true
        }
    ],
    "created": [
        {
            "value": "2019-06-14T13:26:19+00:00",
            "format": "Y-m-d\\TH:i:sP"
        }
    ],
    "changed": [
        {
            "value": "2019-06-14T13:26:19+00:00",
            "format": "Y-m-d\\TH:i:sP"
        }
    ]
}
```

## Example GraphQL response

```json
{
  "entity": {
    "entityBundle": "video",
    "fieldMediaVideoEmbedField": "https://www.youtube.com/watch?time_continue=1&v=qRYoUL6BNdc",
    "thumbnail": {
      "derivative": {
        "url": "https://dev.cms.va.gov/sites/default/files/styles/large/public/video_thumbnails/qRYoUL6BNdc.jpg?itok=mutTJ3Cb"
      }
    }
  }
}
```
