# TODO

- Update team with status
- Organize questions into tech/business logic
- figure out logic around displaying the appointment and edge cases
- unit tests
- e2e tests
- linting in the PR
- analytics

## Questions asked

> In the v2, API, there is not longer the `type` parameter of `VA` and `CC`. How does that translate to the new API? In the current implementation this is two separate API calls that we are combining to get the results.
> Currently, We are querying the facility API for the facility data, is that still a thing we have to do in with v2? If so what is the facility id in the object?
> We are checking against various constants (e.g. appointmentStatus, appointmentKind). How are those handled in v2? Are they still the same constants?
> For Telehealth and video visits. How are those represented in the new API?
> Just to confirm, we are only showing the next appointment, regardless if how many there are
> Just to ask, do we have sample responses from v2, like actual dummy data?

## Questions to ask

> How are the timestamps formatted in the v2 vs v0?
> For community care appointments, does the facility still populate?
> It looks `kind` has changed. In `v0` it looks only used for telehealth information, but in `v2` it looks like its used for describing the type of visit. Where does the telehealth location come from in `v2`?
> What is an `AtlasLocation`?

## Assumptions to validate

- Facility data is the `location` object in the API response
- Telehealth is the only type of appointment that is considered `video`
- All the appointments are coming back in the new API, so only 1 API call is needed
- The API only returns upcoming appointments, not cancelled
