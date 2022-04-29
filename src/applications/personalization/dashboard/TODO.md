# TODO

- Organize questions into tech/business logic
- figure out logic around displaying the appointment and edge cases
- unit tests
- e2e tests
- linting in the PR
- analytics

## Assumptions to validate

- Facility data is the `location` object in the API response
- Telehealth is the only type of appointment that is considered `video`
- We are always should *just* the next appointment

## VOAS techinal questions

- What is an `AtlasLocation`? In `v0` we used the  `attributes.vvsAppointments[X].tasInfo` to determine if an appointment was an `AtlasLocation`

## Answers

- `CC` And `VA` are in the `kind` field.
    clinic - A clinic (in-person) appointment
    cc - A community-care appointment
    telehealth - A virtual appointment
    phone - A phone appointment
- `kind` also does telehealth distinction.
- We can include the facility in the APi request and get the correct data.
- We are going to be filtering out cancelled appointments., What other types of appoointments should we be filtering out?
  - options:  `proposed`, `cancelled`, `pending`, `booked`, `arrived`, `noshow`, `fulfilled`
