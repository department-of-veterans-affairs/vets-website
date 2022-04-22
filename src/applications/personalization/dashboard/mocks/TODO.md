# TODO

- Organize questions into tech/business logic
- figure out logic around displaying the appointment and edge cases
- unit tests
- e2e tests
- linting in the PR
- analytics
to confirm: Its only show the next appointment

Questions:
> In the v2, API, there is not longer the `type` parameter of `VA` and `CC`. How does that translate to the new API? In the current implementation this is two separate API calls that we are combining to get the results.
> Currently, We are querying the facility API for the facility data, is that still a thing we have to do in with v2? If so what is the facility id in the object?
> We are checking against various constants (e.g. appointmentStatus, appointmentKind). How are those handled in v2? Are they still the same constants?
> For Telehealth and video visits. How are those represented in the new API?
> Just to confirm, we are only showing the next appointment, regardless if how many there are
> Just to ask, do we have sample responses from v2, like actual dummy data?
> How are the timestamps formatted in the v2 vs v0?
