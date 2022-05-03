# TODO

- figure out logic around displaying the appointment and edge cases
- unit tests
- analytics

## Assumptions to validate

- Facility data is the `location` object in the API response
- Telehealth is the only type of appointment that is considered `video`, and is determined by the `kind` attribute
- We are always should *just* the next appointment
- CC and VA come back in the API call

## VOAS techinal questions

- What is an `AtlasLocation`? In `v0` we used the  `attributes.vvsAppointments[X].tasInfo` to determine if an appointment was an `AtlasLocation`
