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

### Another Example

```
Q_2_H_2_NEW_EVIDENCE: {
  Q_1_1_CLAIM_DECISION: YES,
  Q_1_2_CLAIM_DECISION: YES,
  ONE_OF: {
    Q_1_3A_FEWER_60_DAYS: YES,
    Q_2_H_1_EXISTING_BOARD_APPEAL: NO,
  },
},
```

The above example introduces the `ONE_OF` key, which means **only one of** the key:value pairs in the object must be true.
In this example, the below conditions must be true:

1. `Q_1_1_CLAIM_DECISION` is answered "Yes"
2. `Q_1_2_CLAIM_DECISION` is answered "Yes"

and also **one of** the below conditions must be true:

1. `Q_1_3A_FEWER_60_DAYS` is answered "Yes"
2. `Q_2_H_1_EXISTING_BOARD_APPEAL` is answered "No"

In this scenario, `Q_2_H_2_NEW_EVIDENCE`'s display conditions does not include every possible question that could come before it because it is not possible that they will all be answered. Prior questions (such as `Q_1_3_CLAIM_CONTESTED`) may or may not display depending on the user's responses. It doesn't make sense to accept a "Yes," "No," or `null` response in this case. When the path splits, we should only create expectations for questions that we know are shown to the user, and omit the rest.

Therefore, we can boil down display conditions for questions like `Q_2_H_2_NEW_EVIDENCE` into:

1) questions that come before the path splits and
2) one of the questions that comes immediately prior to `Q_2_H_2_NEW_EVIDENCE`

Think of display conditions collectively as a roadmap. Looking at a single object is only a small piece of the roadmap. But when they are all combined, they form the full picture (see **Repetition and DRY code** below).

## Repetition and DRY Code

It is expected that the same condition (e.g. key:value pair) is repeated across subsequent questions. Because this app is low-complexity, this type of repetition improves human-readability and troubleshooting while not greatly impacting performance of the application. It allows us to adjust the order of questions and add or remove questions with high confidence.

Additionally, repetition ensures that scenarios like splits in logic paths are covered. If you don't find explicit display conditions for questions that can be reached multiple ways, those conditions are listed on a traditional question in another part of the code. For instance, all questions in path A will make up the full logic through path A, and all questions in path B will make up the full logic through path B, but it is not necessary for one question to make up the full logic for both paths.

## Order of Questions

The display conditions code (the keys in the objects) are expected to flow in the same order that they would appear in the browser flow. If Question 1 has a subquestion, Question 1A, that can be reached by both Question 1 and Question 2, the keys in the display conditions should go in this order:

1. Question 1
2. Question 2
3. Question 1A

The utility functions that consume the display conditions always look **ahead** of the current question only to see what could come next, so there would never be a scenario where Question 2 would be checking Question 1's display conditions to see what's next.

## Display Conditions (Review Screens)

TODO