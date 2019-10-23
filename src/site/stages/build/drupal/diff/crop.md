# crop

## GraphQL

**WARNING:** Uncertain which is the data structure that matches the Tome data structure.

```json
{
  "__typename": "MetaLink",
  "key": "image_src",
  "value": "https://dev.cms.va.gov/sites/default/files/2019-09/doctor-year2019-decker-480_0.jpg"
},
```

```json
{
  "__typename": "MetaValue",
  "key": "twitter:image",
  "value": "https://dev.cms.va.gov/sites/default/files/2019-09/doctor-year2019-decker-480_0.jpg"
},
```

```json
{
  "__typename": "MetaProperty",
  "key": "og:image",
  "value": "https://dev.cms.va.gov/sites/default/files/2019-09/doctor-year2019-decker-480_0.jpg"
}
```

```json
{
  "image": {
    "alt": "Dr. Brooke Decker",
    "title": "",
    "derivative": {
      "url": "https://dev.cms.va.gov/sites/default/files/styles/2_1_medium_thumbnail/public/2019-09/doctor-year2019-decker-480_0.jpg?itok=p2xcTS8n",
      "width": 480,
      "height": 240
    }
  }
}
```

```json
{
  "derivative": {
    "url": "https://dev.cms.va.gov/sites/default/files/styles/2_1_medium_thumbnail/public/2019-09/doctor-year2019-decker-480_0.jpg?itok=p2xcTS8n",
    "width": 480,
    "height": 240
  }
}
```

## Tome

```json
{
    "uuid": [
        {
            "value": "1d1c14bc-edb7-4dfc-baf5-cf0ad1810da7"
        }
    ],
    "type": [
        {
            "target_id": "2_1",
            "target_type": "crop_type",
            "target_uuid": "48b31219-27a5-425f-acee-297d45633ff8"
        }
    ],
    "langcode": [
        {
            "value": "en"
        }
    ],
    "entity_id": [
        {
            "value": 86
        }
    ],
    "entity_type": [
        {
            "value": "file"
        }
    ],
    "uri": [
        {
            "value": "public:\/\/2019-05\/doctor-year2019-decker-480.jpg"
        }
    ],
    "height": [
        {
            "value": 240
        }
    ],
    "width": [
        {
            "value": 480
        }
    ],
    "x": [
        {
            "value": 240
        }
    ],
    "y": [
        {
            "value": 120
        }
    ],
    "revision_timestamp": [
        {
            "value": "2019-05-14T15:46:57+00:00",
            "format": "Y-m-d\\TH:i:sP"
        }
    ],
    "revision_uid": [
        {
            "target_type": "user",
            "target_uuid": "c0745381-8e20-40da-9540-5a7d2eee1b35"
        }
    ],
    "revision_log": [],
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
    "moderation_state": []
}
```

## Missing properties in Tome:

1.
