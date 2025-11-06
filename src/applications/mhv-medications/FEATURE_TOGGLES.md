# Feature Toggles: MHV Medications

## Report for 20251105

- [vets-api | flipper (staging)](https://staging-api.va.gov/flipper/features)
- [vets-api | flipper (production)](https://api.va.gov/flipper/features)

Name | staging | production
---- | ------- | ----------
`mhvMedicationsDisplayAllergies`    | `true` | `true` |
`mhv_medications_display_allergies` | `true` | `true` |
`mhvMedicationsDisplayDocumentationContent`     | `true` | `true` |
`mhv_medications_display_documentation_content` | `true` | `true` |
`mhvMedicationsDisplayPendingMeds`     | `true` | `false` |
`mhv_medications_display_pending_meds` | `true` | `false` |
`mhvMedicationsDisplayRefillProgress`     | `true` | `true` |
`mhv_medications_display_refill_progress` | `true` | `true` |
`mhvMedicationsPartialFillContent`     | `true` | `false` |
`mhv_medications_partial_fill_content` | `true` | `false` |
`mhvMedicationsDontIncrementIpeCount`      | `true` | `false` |
`mhv_medications_dont_increment_ipe_count` | `true` | `false` |
`mhvBypassDowntimeNotification`    | `1 actor` | `false` |
`mhv_bypass_downtime_notification` | `1 actor` | `false` |
`mhvMedicationsDisplayNewCernerFacilityAlert`       | `1 actor` | `n/a` |
`mhv_medications_display_new_cerner_facility_alert` | `1 actor` | `n/a` |


### `mhv_medications_display_pending_meds`

Show/hide Print-only content. [source](https://github.com/department-of-veterans-affairs/vets-website/blob/mhv-medications-changelog-oct/src/applications/mhv-medications/components/PrescriptionDetails/PrescriptionPrintOnly.jsx#L170-L177)

```jsx
{!showPendingMedsContent && (
  <p>
    <strong>
      Request refills by this prescription expiration date:
    </strong>{' '}
    {dateFormat(rx.expirationDate, DATETIME_FORMATS.longMonthDate)}
  </p>
)}
```

### `mhv_medications_partial_fill_content`

Show/hide partial fill information in refill history. [source](https://github.com/department-of-veterans-affairs/vets-website/blob/mhv-medications-changelog-oct/src/applications/mhv-medications/components/PrescriptionDetails/VaPrescription.jsx#L441-L555)


### `mhv_medications_dont_increment_ipe_count`

Enable/disable counting times IPE has been hidden. [source](https://github.com/department-of-veterans-affairs/vets-website/blob/mhv-medications-changelog-oct/src/applications/mhv-medications/components/MedicationsList/InProductionEducationFiltering.jsx)

### Slated for removal

- [ ] `mhv_medications_display_filter` `mhvMedicationsDisplayFilter`
- [ ] `mhv_medications_display_grouping` `mhvMedicationsDisplayGrouping`
- [ ] `mhv_medications_display_refill_content` `mhvMedicationsDisplayRefillContent`
- [ ] `mhv_medications_new_policy` `mhvMedicationsNewPolicy`
- [ ] `mhv_medications_remove_landing_page` `mhvMedicationsRemoveLandingPage`
- [ ] `mhv_medications_show_ipe_content` `mhvMedicationsShowIpeContent`
- [ ] `mhv_medications_to_va_gov_release` `mhvMedicationsToVaGovRelease`
