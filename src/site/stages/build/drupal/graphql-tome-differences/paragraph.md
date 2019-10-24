# paragraph

Tome returned **4762** records.


## Missing properties in Tome:

1.

## Example GraphQL response

**WARNING:** There are multiple types of `paragraph`s, here's a few:

```json
{
  "entity": {
    "entityType": "paragraph",
    "entityBundle": "wysiwyg",
    "fieldWysiwyg": {
      "processed": "<h2>Care we provide at VA Pittsburgh</h2>\n\n<p>Our patient advocates work hard to make sure you receive the best possible care. They offer help with:</p>\n\n<ul><li>Patient concerns with the care team</li>\n\t<li>Advocating for patient and family rights</li>\n\t<li>Specialist advocacy for Former Prisoners of War, Minority Veterans, and OEF/OIF/OND transitioning Veterans</li>\n</ul>"
    }
  }
}
```

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
