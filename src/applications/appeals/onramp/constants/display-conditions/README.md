# Display Conditions

**Note**
- Refer to all files in this directory (other than `index.js`) for real examples.
- See [this Mural](https://app.mural.co/t/departmentofveteransaffairs9999/m/departmentofveteransaffairs9999/1736350333305/034f554056e15ace373c35a8b9655134d4ccafe0) for a visual diagram of the display conditions for the Decision Reviews Onramp Tool.
- `Q_1_1_CLAIM_DECISION` is the first question in the flow. The answer to this question controls the display of every other question after it. It has empty display conditions (`{}`) because it always shows first.
- All examples below are for demonstration only and may not represent accurate display conditions for the Decision Reviews Onramp Tool.

## Simple Display Conditions (Questions)

```
Q_1_1A_SUBMITTED_526: {
  Q_1_1_CLAIM_DECISION: NO,
}
```

The above means that `Q_1_1A_SUBMITTED_526` will display if "No" is selected
for `Q_1_1_CLAIM_DECISION`.

More Notes:
- `Q_1_1A_SUBMITTED_526` is a `SHORT_NAME` representing a question.
- All questions within `Q_1_1A_SUBMITTED_526`'s object control display of `Q_1_1A_SUBMITTED_526`.
- For brevity, the display conditions only care about the `value` of the radio response, not the full text.

For example, say a question's responses are:

- "Yes - VA decided this condition is service-connected"
- "No - VA denied service connection for this condition"

Behind the scenes, we'll track simply "Yes" or "No" as the answer to this question depending on what the
user selected rather than the full answer text.

## More Complex Display Conditions (Questions)

```
Q_2_H_2B_JUDGE_HEARING: {
  Q_1_1_CLAIM_DECISION: YES,
  Q_1_2_CLAIM_DECISION: YES,
  Q_1_3_CLAIM_CONTESTED: NO,
  Q_2_0_CLAIM_TYPE: HLR,
  Q_2_H_1_EXISTING_BOARD_APPEAL: NO,
  Q_2_H_2_NEW_EVIDENCE: NO,
}
```

The above means that `Q_2_H_2B_JUDGE_HEARING` will display if every question inside its object
has a response, and that response matches the required response.
In this example, all of the below conditions must be true:

1. `Q_1_1_CLAIM_DECISION` is answered "Yes"
2. `Q_1_2_CLAIM_DECISION` is answered "Yes"
3. `Q_1_3_CLAIM_CONTESTED` is answered "No"
4. `Q_2_0_CLAIM_TYPE` is answered "HLR"
5. `Q_2_H_1_EXISTING_BOARD_APPEAL` is answered "No"
6. `Q_2_H_2_NEW_EVIDENCE` is answered "No"

## Repetition and DRY Code

It is expected that the same condition (e.g. key:value pair) is repeated across subsequent questions. Because this app is low-complexity, this type of repetition improves human-readability and troubleshooting while not greatly impacting performance of the application. It allows us to adjust the order of questions and add or remove questions with high confidence.

## Display Conditions (Review Screens)

TODO