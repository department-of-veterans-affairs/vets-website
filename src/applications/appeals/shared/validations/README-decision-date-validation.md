# Decision Date Validation Criteria

Contestable issues pulled from the API or entered manually are not eligible for selection/submission
unless they have decision dates **in the past** according to server (UTC) time **and** local time.

Because our users are worldwide, their local time can be vastly different from UTC time. We also have
to consider the international dateline, e.g. where in the world is it midnight or later the next calendar day?

Important considerations:
1. Sometimes a user's timezone crosses the international dateline, and the user and the server are on two different calendar days according to their time.
2. Even if it is the next day in UTC after the decision date, if it is still the same day as the decision date in local time, the issue is not eligible.
3. Even if it is the next day in local time after the decision date, if it is still the same day as the decision date in UTC time, the issue is not eligible.

## Examples

Notes:
- Error messaging to the user will display in their local timezone
- Timezones assigned to example `User time` are just for demonstration.

### Veteran's local time is **behind** UTC by 11 hours

#### Veteran & server are on two different days

- User time: Jan 9 @ 1pm EST
- UTC time: Jan 10 @ 12am

| :calendar: Decision date | Eligible :white_check_mark: / :no_entry_sign: | :question: Reasoning | :clock1: Eligibility |
| --- | --- | --- | --- |
| Jan 9 | :no_entry_sign: | The decision date is not the previous day or earlier in **local** time. | Eligible on Jan 10 @ 12am local (Jan 10 @ 11am UTC) |
| Jan 10 | :no_entry_sign: | The decision date is not the previous day or earlier in **UTC** time. | Eligible on Jan 11 @ 12am local (Jan 11 @ 11am UTC) |
|  Jan 11 | :no_entry_sign: | The decision date is not the previous day or earlier in **UTC or local** time. | Eligible on Jan 12 @ 12am local (Jan 12 @ 11am UTC) |

#### Veteran & server are on the same day

- User time: Jan 9 @ 6am EST
- UTC time: Jan 9 @ 5pm

| :calendar: Decision date | Eligible :white_check_mark: / :no_entry_sign: | :question: Reasoning | :clock1: Eligibility |
| --- | --- | --- | --- |
| Jan 9 | :no_entry_sign: | The decision date is not the previous day or earlier in **UTC or local** time. | Eligible on Jan 10 @ 12am local (Jan 10 @ 11am UTC) |
| Jan 10 | :no_entry_sign: | The decision date is not the previous day or earlier in **UTC or local** time. | Eligible on Jan 11 @ 12am local (Jan 11 @ 11am UTC) |

### Veteran's local time is **ahead** of UTC by 10 hours

#### Veteran & server are on two different days

- User time: Jan 9 @ 9am EST
- UTC time: Jan 8 @ 11pm

| :calendar: Decision date | Eligible :white_check_mark: / :no_entry_sign: | :question: Reasoning | :clock1: Eligibility |
| --- | --- | --- | --- | --- |
| Jan 9 | :no_entry_sign: | The decision date is not the previous day or earlier in **UTC or local** time | Eligible on Jan 10 @ 10am local (Jan 10 @ 12am UTC) |
| Jan 8 | :no_entry_sign: | The decision date is not the previous day or earlier in **UTC** time. | Eligible on Jan 9 @ 10am local (Jan 9 @ 12am UTC) |
| Jan 10 | :no_entry_sign: | The decision date is not the previous day or earlier in **UTC or local** time. | Eligible on Jan 11 @ 10am local (Jan 11 @ 12am UTC) |

#### Veteran & server are on the same day

- User time: Jan 9 @ 11am EST
- UTC time: Jan 9 @ 1am

| :calendar: Decision date | Eligible :white_check_mark: / :no_entry_sign: | :question: Reasoning | :clock1: Eligibility |
| --- | --- | --- | --- | --- |
| Jan 9 | :no_entry_sign: | The decision date is not the previous day or earlier in **UTC or local** time. | Eligible on Jan 10 @ 10am local (Jan 10 @ 12am UTC) |
| Jan 10 | :no_entry_sign: | The decision date is not the previous day or earlier in **UTC or local** time. | Eligible on Jan 11 @ 10am local (Jan 11 @ 12am UTC) |