# Display Conditions

**Note**
- Refer to all files in this directory (other than `index.js`) for real examples.
- See [this Mural](https://app.mural.co/t/departmentofveteransaffairs9999/m/departmentofveteransaffairs9999/1736350333305/034f554056e15ace373c35a8b9655134d4ccafe0) for a visual diagram of the display conditions for the Decision Reviews Onramp Tool.
- `Q_1_1_CLAIM_DECISION` is the first question in the flow. The answer to this question controls the display of every other question after it. It has empty display conditions (`{}`) because it always shows first.
- All examples below are for demonstration only and may not represent accurate display conditions for the Decision Reviews Onramp Tool.

## Basic Display Conditions - Questions

```
Q_1_1A_SUBMITTED_526: {
  Q_1_1_CLAIM_DECISION: [NO],
}
```

The above means that `Q_1_1A_SUBMITTED_526` will display if "No" is selected
for `Q_1_1_CLAIM_DECISION`.

More Notes:
- `Q_1_1A_SUBMITTED_526` is a `SHORT_NAME` representing a question.
- All questions within `Q_1_1A_SUBMITTED_526`'s object control display of `Q_1_1A_SUBMITTED_526`.

Here's a more complex example:

```
Q_2_H_2B_JUDGE_HEARING: {
  Q_1_1_CLAIM_DECISION: [YES],
  Q_1_2_CLAIM_DECISION: [YES],
  Q_1_3_CLAIM_CONTESTED: [NO],
  Q_2_0_CLAIM_TYPE: [HLR],
  Q_2_H_1_EXISTING_BOARD_APPEAL: [NO],
  Q_2_H_2_NEW_EVIDENCE: [NO],
}
```

The above means that `Q_2_H_2B_JUDGE_HEARING` will display if every question inside its object
has a response, and it matches the response in the array. All of the conditions listed must be true.
For example, `Q_1_1_CLAIM_DECISION` must be answered "Yes," `Q_1_2_CLAIM_DECISION` must be answered "Yes,"
`Q_1_3_CLAIM_CONTESTED` must be answered "No," and so on.