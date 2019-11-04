# node

CMS export returned **774** records.

## Missing properties in CMS export:

1. `"entityId": "1000",`
1. We might be missing `entityUrl.breadcrumb` (found in the GraphQL response), it's not clear how that's currently derived.
1. We might be missing `entityMetatags`, it's not clear how they are currently derived.

## `target_id`s:

- `documentation_page`
- `event_listing`
- `event`
- `full_width_banner_alert` (e.g. `VAMC system banner alert with situational updates`)
- `health_care_local_facility` (e.g. `VAMC facility`)
- `health_care_local_health_service` (e.g. `VAMC facility health service`)
- `health_care_region_detail_page`
- `health_care_region_page` (e.g. `VAMC system`)
- `landing_page`
- `news_story`
- `office`
- `outreach_asset` (e.g. `Publication`)
- `page`
- `person_profile` (e.g. `Staff profile`)
- `press_release`
- `publication_listing`
- `regional_health_care_service_des` (e.g. `VAMC system health service`)
- `support_service`
- `vamc_operating_status_and_alerts` (e.g. `VAMC system operating status`)

## All standard key-value pairs:

- `changed`
- `created`
- `default_langcode`
- `langcode`
- `menu_link`
- `moderation_state`
- `path`
- `promote`
- `revision_log`
- `revision_timestamp`
- `revision_translation_affected`
- `revision_uid`
- `status`
- `sticky`
- `title`
- `type`
- `uid`
- `uuid`

## All optional key-value pairs:

- target_id: `health_care_region_detail_page`
  - `field_administration` | Entity reference
  - `field_content_block` | Entity reference revisions
  - `field_description` | Text (plain)
  - `field_intro_text` | Text (plain, long)
  - `field_meta_tags` | Meta tags
  - `field_meta_title` | Text (plain)
  - `field_office` | Entity reference
  - `field_related_links` | Entity reference revisions
- target_id: `documentation_page`
  - `field_content_block` | Entity reference revisions
- target_id: `event`
  - `field_additional_information_abo` | Text (formatted, long)
  - `field_address` | Address
  - `field_administration` | Entity reference
  - `field_body` | Text (formatted, long)
  - `field_date` | Date range
  - `field_description` | Text (plain)
  - `field_event_cost` | Text (plain)
  - `field_event_cta` | List (text)
  - `field_event_registrationrequired` | Boolean
  - `field_facility_location` | Entity reference
  - `field_featured` | Boolean
  - `field_link` | Link
  - `field_location_humanreadable` | Text (plain)
  - `field_location_type` | List (text)
  - `field_media` | Entity reference
  - `field_meta_tags` | Meta tags
  - `field_office` | Entity reference
  - `field_order` | List (integer)
  - `field_url_of_an_online_event` | Link
- target_id: `event_listing`
  - `field_administration` | Entity reference
  - `field_description` | Text (plain)
  - `field_intro_text` | Text (plain, long)
  - `field_meta_tags` | Meta tags
  - `field_meta_title` | Text (plain)
  - `field_office` | Entity reference
- target_id: `landing_page`
  - `field_administration`
  - `field_alert`
  - `field_description`
  - `field_home_page_hub_label`
  - `field_intro_text`
  - `field_links`
  - `field_meta_tags`
  - `field_meta_title`
  - `field_page_last_built`
  - `field_plainlanguage_date`
  - `field_promo`
  - `field_related_links`
  - `field_spokes`
  - `field_support_services`
  - `field_teaser_text`
  - `field_title_icon`
- target_id: `office`
  - `field_administration` | Entity reference
  - `field_body` | Text (formatted, long)
  - `field_description` | Text (plain)
  - `field_meta_tags` | Meta tags
  - `field_meta_title` | Text (plain)
- target_id: `outreach_asset` (e.g. `Publication`)
  - `field_administration` | Entity reference
  - `field_administration` | Entity reference
  - `field_benefits` | List (text)
  - `field_description` | Text (plain)
  - `field_description` | Text (plain)
  - `field_format` | List (text)
  - `field_intro_text` | Text (plain, long)
  - `field_media` | Entity reference
  - `field_meta_tags` | Meta tags
  - `field_meta_tags` | Meta tags
  - `field_meta_title` | Text (plain)
  - `field_office` | Entity reference
  - `field_office` | Entity reference
- target_id: `page`
  - `field_administration`
  - `field_alert`
  - `field_content_block`
  - `field_description`
  - `field_featured_content`
  - `field_intro_text`
  - `field_meta_tags`
  - `field_meta_title`
  - `field_page_last_built`
  - `field_plainlanguage_date`
  - `field_related_links`
- target_id: `press_release`
  - `field_address` | Address
  - `field_administration` | Entity reference
  - `field_intro_text` | Text (plain, long)
  - `field_meta_tags` | Meta tags
  - `field_office` | Entity reference
  - `field_pdf_version` | Entity reference
  - `field_press_release_contact` | Entity reference
  - `field_press_release_downloads` | Entity reference
  - `field_press_release_fulltext` | Text (formatted, long)
  - `field_release_date` | Date
- target_id: `publication_listing`
  - `field_administration`
  - `field_description`
  - `field_intro_text`
  - `field_meta_tags`
  - `field_meta_title`
  - `field_office`
- target_id: `person_profile` (e.g. `Staff profile`)
  - `field_administration` | Entity reference
  - `field_body` | Text (formatted, long)
  - `field_complete_biography` | File
  - `field_description` | Text (plain)
  - `field_email_address` | Email
  - `field_intro_text` | Text (plain, long)
  - `field_last_name` | Text (plain)
  - `field_media` | Entity reference
  - `field_meta_tags` | Meta tags
  - `field_name_first` | Text (plain)
  - `field_office` | Entity reference
  - `field_phone_number` | Telephone number
  - `field_photo_allow_hires_download` | Boolean
  - `field_suffix` | Text (plain)
- target_id: `news_story`
  - `field_administration` | Entity reference
  - `field_author` | Entity reference
  - `field_featured` | Boolean
  - `field_full_story` | Text (formatted, long)
  - `field_image_caption` | Text (plain, long)
  - `field_intro_text` | Text (plain, long)
  - `field_media` | Entity reference
  - `field_meta_tags` | Meta tags
  - `field_office` | Entity reference
  - `field_order` | List (integer)
- target_id: `support_service`
  - `field_administration` | Entity reference
  - `field_link` | Link
  - `field_office` | Entity reference
  - `field_page_last_built` | Date
  - `field_phone_number` | Telephone number
- target_id: `health_care_region_page` (e.g. `VAMC system`)
  - `field_administration` | Entity reference
  - `field_appointments_online` | Boolean
  - `field_clinical_health_care_servi` | Text (formatted, long)
  - `field_clinical_health_services` | Entity reference
  - `field_description` | Text (plain)
  - `field_email_subscription_links` | Link
  - `field_email_subscription` | Link
  - `field_facebook` | Link
  - `field_featured_content_healthser` | Entity reference revisions
  - `field_flickr` | Link
  - `field_instagram` | Link
  - `field_intro_text_events_page` | Text (formatted, long)
  - `field_intro_text_leadership` | Text (plain, long)
  - `field_intro_text_news_stories` | Text (formatted, long)
  - `field_intro_text_press_releases` | Text (plain, long)
  - `field_intro_text` | Text (plain, long)
  - `field_leadership` | Entity reference
  - `field_link_facility_emerg_list` | Link
  - `field_link_facility_news_list` | Link
  - `field_links` | Link
  - `field_locations_intro_blurb` | Text (formatted, long)
  - `field_media` | Entity reference
  - `field_meta_tags` | Meta tags
  - `field_meta_title` | Text (plain)
  - `field_nickname_for_this_facility` | Text (plain)
  - `field_operating_status` | Link
  - `field_other_va_locations` | Text (plain)
  - `field_press_release_blurb` | Text (formatted, long)
  - `field_related_links` | Entity reference revisions
  - `field_sign_up_for_emergency_emai` | Link
  - `field_twitter` | Link
- target_id: `full_width_banner_alert` (e.g. `VAMC system banner alert with situational updates`)
  - `field_administration` | Entity reference
  - `field_alert_dismissable` | Boolean
  - `field_alert_email_updates_button` | Boolean
  - `field_alert_find_facilities_cta` | Boolean
  - `field_alert_inheritance_subpages` | Boolean
  - `field_alert_operating_status_cta` | Boolean
  - `field_alert_type` | List (text)
  - `field_banner_alert_situationinfo` | Text (formatted, long)
  - `field_banner_alert_vamcs` | Entity reference
  - `field_body` | Text (formatted, long)
  - `field_operating_status_sendemail` | Boolean
  - `field_situation_updates` | Entity reference revisions
- target_id: `health_care_local_facility` (e.g. `VAMC facility`)
  - `field_address` | Address
  - `field_administration` | Entity reference
  - `field_description` | Text (plain)
  - `field_email_subscription` | Link
  - `field_facebook` | Link
  - `field_facility_hours` | Table Field
  - `field_facility_locator_api_id` | Text (plain)
  - `field_flickr` | Link
  - `field_instagram` | Link
  - `field_intro_text` | Text (plain, long)
  - `field_local_health_care_service_` | Entity reference
  - `field_location_services` | Entity reference revisions
  - `field_main_location` | Boolean
  - `field_media` | Entity reference
  - `field_mental_health_phone` | Telephone number
  - `field_meta_tags` | Meta tags
  - `field_meta_title` | Text (plain)
  - `field_nickname_for_this_facility` | Text (plain)
  - `field_operating_status_facility` | List (text)
  - `field_operating_status_more_info` | Text (plain, long)
  - `field_phone_number` | Telephone number
  - `field_region_page` | Entity reference
  - `field_twitter` | Link
- target_id: `health_care_local_health_service` (e.g. `VAMC facility health service`)
  - `field_administration` | Entity reference
  - `field_body` | Text (formatted, long)
  - `field_facility_location` | Entity reference
  - `field_regional_health_service` | Entity reference
- target_id: `regional_health_care_service_des` (e.g. `VAMC system health service`)
  - `field_administration` | Entity reference
  - `field_body` | Text (formatted, long)
  - `field_local_health_care_service_` | Entity reference
  - `field_region_page` | Entity reference
  - `field_service_name_and_descripti` | Entity reference
- target_id: `vamc_operating_status_and_alerts` (e.g. `VAMC system operating status`)
  - `field_administration` | Entity reference
  - `field_banner_alert` | Entity reference
  - `field_facility_operating_status` | Entity reference
  - `field_links` | Link
  - `field_meta_tags` | Meta tags
  - `field_office` | Entity reference
  - `field_operating_status_emerg_inf` | Text (formatted, long)

## Example CMS export data

```json
{
    "uuid": [
        {
            "value": "38db8c1d-2940-436c-b23a-44bc8ea00278"
        }
    ],
    "langcode": [
        {
            "value": "en"
        }
    ],
    "type": [
        {
            "target_id": "person_profile",
            "target_type": "node_type",
            "target_uuid": "89b07673-7fd5-4292-8fba-58cc10c4e3ec"
        }
    ],
    "revision_timestamp": [
        {
            "value": "2019-09-23T22:22:17+00:00",
            "format": "Y-m-d\\TH:i:sP"
        }
    ],
    "revision_uid": [
        {
            "target_type": "user",
            "target_uuid": "8d4a7bed-f4ba-499f-afd4-8e1cbeadfc4a"
        }
    ],
    "revision_log": [],
    "status": [
        {
            "value": true
        }
    ],
    "title": [
        {
            "value": "Ramon Rivera"
        }
    ],
    "uid": [
        {
            "target_type": "user",
            "target_uuid": "8d4a7bed-f4ba-499f-afd4-8e1cbeadfc4a"
        }
    ],
    "created": [
        {
            "value": "2019-09-23T22:16:47+00:00",
            "format": "Y-m-d\\TH:i:sP"
        }
    ],
    "changed": [
        {
            "value": "2019-09-23T22:22:17+00:00",
            "format": "Y-m-d\\TH:i:sP"
        }
    ],
    "promote": [
        {
            "value": false
        }
    ],
    "sticky": [
        {
            "value": false
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
    "path": [
        {
            "alias": "\/pittsburgh-health-care\/staff-profiles\/ramon-rivera",
            "langcode": "en",
            "pathauto": 1
        }
    ],
    "menu_link": [],
    "field_administration": [
        {
            "target_type": "taxonomy_term",
            "target_uuid": "87832236-1e54-4ce3-8141-8dec27c8a9a7"
        }
    ],
    "field_body": [],
    "field_complete_biography": [],
    "field_description": [
        {
            "value": "Suicide Prevention Case Manager"
        }
    ],
    "field_email_address": [],
    "field_intro_text": [],
    "field_last_name": [
        {
            "value": "Rivera"
        }
    ],
    "field_media": [],
    "field_meta_tags": [],
    "field_name_first": [
        {
            "value": "Ramon"
        }
    ],
    "field_office": [
        {
            "target_type": "node",
            "target_uuid": "2bddb1a7-6fb1-4503-838d-9c2fcb51c46a"
        }
    ],
    "field_phone_number": [
        {
            "value": "412-360-6515"
        }
    ],
    "field_photo_allow_hires_download": [
        {
            "value": false
        }
    ],
    "field_suffix": [
        {
            "value": "LSW"
        }
    ]
}
```

## Example GraphQL response

```json
{
  "entityBundle": "person_profile",
  "entityId": "1000",
  "entityPublished": true,
  "title": "Ramon Rivera",
  "entityUrl": {
    "breadcrumb": [
      {
        "url": {
          "path": "/",
          "routed": true
        },
        "text": "Home"
      },
      {
        "url": {
          "path": "/pittsburgh-health-care",
          "routed": true
        },
        "text": "VA Pittsburgh health care"
      }
    ],
    "path": "/pittsburgh-health-care/staff-profiles/ramon-rivera"
  },
  "entityMetatags": [
    {
      "__typename": "MetaValue",
      "key": "title",
      "value": "Ramon Rivera | VA Pittsburgh health care | Veterans Affairs"
    },
    {
      "__typename": "MetaValue",
      "key": "twitter:card",
      "value": "summary_large_image"
    },
    {
      "__typename": "MetaProperty",
      "key": "og:site_name",
      "value": "Veterans Affairs"
    },
    {
      "__typename": "MetaValue",
      "key": "twitter:title",
      "value": "Ramon Rivera | VA Pittsburgh health care | Veterans Affairs"
    },
    {
      "__typename": "MetaValue",
      "key": "twitter:site",
      "value": "@DeptVetAffairs"
    },
    {
      "__typename": "MetaProperty",
      "key": "og:title",
      "value": "Ramon Rivera | VA Pittsburgh health care | Veterans Affairs"
    }
  ],
  "fieldNameFirst": "Ramon",
  "fieldLastName": "Rivera",
  "fieldSuffix": "LSW",
  "fieldDescription": "Suicide Prevention Case Manager",
  "fieldEmailAddress": null,
  "fieldPhoneNumber": "412-360-6515",
  "fieldCompleteBiography": null,
  "fieldOffice": {
    "entity": {
      "entityLabel": "VA Pittsburgh health care",
      "entityType": "node",
      "entityBundle": "health_care_region_page",
      "entityId": "318",
      "entityPublished": true,
      "title": "VA Pittsburgh health care",
      "entityUrl": {
        "breadcrumb": [
          {
            "url": {
              "path": "/",
              "routed": true
            },
            "text": "Home"
          },
          {
            "url": {
              "path": "",
              "routed": true
            },
            "text": "VA Pittsburgh health care"
          }
        ],
        "path": "/pittsburgh-health-care"
      },
      "entityMetatags": [
        {
          "__typename": "MetaValue",
          "key": "title",
          "value": "VA Pittsburgh Health Care | Veterans Affairs"
        },
        {
          "__typename": "MetaValue",
          "key": "twitter:card",
          "value": "summary_large_image"
        },
        {
          "__typename": "MetaProperty",
          "key": "og:site_name",
          "value": "Veterans Affairs"
        },
        {
          "__typename": "MetaValue",
          "key": "twitter:description",
          "value": "Find a health facility near you at VA Pittsburgh health care, and manage your health online. Our health care teams are deeply experienced and guided by the needs of Veterans, their families, and caregivers."
        },
        {
          "__typename": "MetaValue",
          "key": "description",
          "value": "Find a health facility near you at VA Pittsburgh health care, and manage your health online. Our health care teams are deeply experienced and guided by the needs of Veterans, their families, and caregivers."
        },
        {
          "__typename": "MetaValue",
          "key": "twitter:title",
          "value": "VA Pittsburgh health care | Veterans Affairs"
        },
        {
          "__typename": "MetaValue",
          "key": "twitter:site",
          "value": "@DeptVetAffairs"
        },
        {
          "__typename": "MetaLink",
          "key": "image_src",
          "value": "https://dev.cms.va.gov/sites/default/files/2019-04/UD%20front.jpg"
        },
        {
          "__typename": "MetaProperty",
          "key": "og:title",
          "value": "VA Pittsburgh health care | Veterans Affairs"
        },
        {
          "__typename": "MetaProperty",
          "key": "og:description",
          "value": "Find a health facility near you at VA Pittsburgh health care, and manage your health online. Our health care teams are deeply experienced and guided by the needs of Veterans, their families, and caregivers."
        },
        {
          "__typename": "MetaValue",
          "key": "twitter:image",
          "value": "https://dev.cms.va.gov/sites/default/files/2019-04/UD%20front.jpg"
        },
        {
          "__typename": "MetaProperty",
          "key": "og:image",
          "value": "https://dev.cms.va.gov/sites/default/files/2019-04/UD%20front.jpg"
        }
      ],
      "fieldNicknameForThisFacility": "VA Pittsburgh"
    }
  },
  "fieldIntroText": null,
  "fieldPhotoAllowHiresDownload": false,
  "fieldMedia": null,
  "fieldBody": null,
  "changed": 1569277337
},
```
