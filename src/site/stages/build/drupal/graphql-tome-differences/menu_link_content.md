# menu_link_content

Tome returned **786** records.

## Missing properties in Tome:

1. `"url": { "path": "/burials-memorials/plan-a-burial" },`
1. The whole `links` key-value pair and its nested properties.

**WARNING:** The above missing properties makes me think that the **Example GraphQL response below may not be a match for the Example Tome data.**

## All standard key-value pairs:

- `bundle`
- `changed`
- `default_langcode`
- `description`
- `enabled`
- `expanded`
- `external`
- `langcode`
- `link`
- `menu_name`
- `parent`
- `rediscover`
- `title`
- `uuid`
- `view_mode`
- `weight`

## All optional key-value pairs:

None.

## Example Tome data

```json
{
    "uuid": [
        {
            "value": "14dc2b61-06dd-4aa1-a993-c9603580ca70"
        }
    ],
    "langcode": [
        {
            "value": "en"
        }
    ],
    "bundle": [
        {
            "target_id": "burials-and-memorials-benef",
            "target_type": "menu",
            "target_uuid": "2b0c3469-f520-4aed-8a33-78154d602eb0"
        }
    ],
    "enabled": [
        {
            "value": true
        }
    ],
    "title": [
        {
            "value": "Schedule a burial"
        }
    ],
    "description": [],
    "menu_name": [
        {
            "value": "burials-and-memorials-benef"
        }
    ],
    "link": [
        {
            "uri": "entity:node\/861",
            "title": "",
            "options": []
        }
    ],
    "external": [
        {
            "value": false
        }
    ],
    "rediscover": [
        {
            "value": false
        }
    ],
    "weight": [
        {
            "value": -50
        }
    ],
    "expanded": [
        {
            "value": false
        }
    ],
    "parent": [
        {
            "value": "menu_link_content:74f0c687-1fe7-4a90-bb4c-20b8c9fa2dd8"
        }
    ],
    "changed": [
        {
            "value": "2019-09-06T14:51:44+00:00",
            "format": "Y-m-d\\TH:i:sP"
        }
    ],
    "default_langcode": [
        {
            "value": true
        }
    ],
    "view_mode": [
        {
            "value": "default"
        }
    ]
}
```

## Example GraphQL response

```json
{
  "label": "Schedule a burial",
  "expanded": false,
  "description": null,
  "url": {
    "path": "/burials-memorials/plan-a-burial"
  },
  "links": [
    {
      "label": "Military funeral honors",
      "expanded": false,
      "description": null,
      "url": {
        "path": "https://www.cem.va.gov/CEM/military_funeral_honors.asp"
      },
      "links": []
    }
  ]
},
```
