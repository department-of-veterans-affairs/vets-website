# Display Conditions

**Note**
- Refer to all files in this directory (other than `index.js`) for real examples.
- See [this Figma](https://www.figma.com/design/5vAWK3wpBkJgG7ngLXYmht/Onramping-Tool?node-id=148-12838&t=QOAwUntpNngliuF1-0) or the below screenshot for a visual diagram of the display conditions for the Decision Reviews Onramp Tool

<img width="1257" height="1184" alt="Screenshot 2025-09-11 at 3 22 11 PM copy" src="https://github.com/user-attachments/assets/ae0e61cb-f3d9-45f0-8e71-e2285c6b4a17" />

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
5. `Q_2_H_2_NEW_EVIDENCE` is answered "No"

### Another Example

```
Q_2_H_2_NEW_EVIDENCE: {
  Q_1_1_CLAIM_DECISION: YES,
  Q_1_2_CLAIM_DECISION: YES,
  ONE_OF: {
    Q_1_3A_FEWER_60_DAYS: YES,
    Q_2_IS_1B_NEW_EVIDENCE: NO,
  },
},
```

The above example introduces the `ONE_OF` key, which means **only one of** the key:value pairs in the object must be true.
In this example, the below conditions must be true:

1. `Q_1_1_CLAIM_DECISION` is answered "Yes"
2. `Q_1_2_CLAIM_DECISION` is answered "Yes"

and also **one of** the below conditions must be true:

1. `Q_1_3A_FEWER_60_DAYS` is answered "Yes"
2. `Q_2_IS_1B_NEW_EVIDENCE` is answered "No"

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

## Display Conditions (Results Screens)

The display conditions for results are identical in structure to questions, but they might be leaner when it comes to covering split paths. Unlike the questions, some results screens have more than one or two scenarios in which to display. When a results screen can be reached many ways, our primary concern is the answers to the questions immediately prior to that screen.

Remember, as the user navigates through the flow, the questions' display conditions will direct them properly through the decision tree. By the time they reach a results screen, we will have verified every question against the decision tree, so the results decision tree won't need to do much additional validation.

### Dynamic Results Screens Content

For some dynamic results screen content (on Decision Reviews results screens), we want to show content UNLESS specific conditions are true. In that case, we use the key `NONE_OF`. For example:

```
CARD_SC: {
  NONE_OF: {
    Q_2_IS_1B_NEW_EVIDENCE: NO,
    Q_2_S_1_NEW_EVIDENCE: NO,
    Q_2_H_2_NEW_EVIDENCE: NO,
  },
}
```

We want to show the Supplemental Claims option card UNLESS any of those three conditions are true. This is the opposite behavior of `ONE_OF` which requires one of the contained conditions to be true in order for the item to show.

#### Combined Behavior
In some cases, `ONE_OF` behavior is combined with basic display conditions. For example:

```
CARD_HLR: {
    Q_1_3_CLAIM_CONTESTED: NO,
    ONE_OF: {
      Q_2_IS_1B_NEW_EVIDENCE: NO,
      Q_2_S_1_NEW_EVIDENCE: NO,
    },
  },
```

In this example, we want to show the content for `CARD_HLR` if the answer to `Q_1_3_CLAIM_CONTESTED` is 'No', but only if one of the below conditions is also true:

1. `Q_2_IS_1B_NEW_EVIDENCE` is 'No'
2. `Q_2_S_1_NEW_EVIDENCE` is 'No'

#### Forks

If an item has multiple groups of conditions, any of which could be true in order to show the item, we need to add a `FORK` to the display conditions. For example:

```
CARD_BOARD_DIRECT: {
  FORK: {
    A: {
      Q_2_0_CLAIM_TYPE: [INIT, SC, HLR],
      ONE_OF: {
        Q_2_IS_1B_NEW_EVIDENCE: NO,
        Q_2_S_1_NEW_EVIDENCE: NO,
        Q_2_H_2_NEW_EVIDENCE: NO,
      },
    },
    B: {
      Q_1_3A_FEWER_60_DAYS: YES,
    },
  },
},
```

In this example, we want to show the content for `CARD_BOARD_DIRECT` in two scenarios:

Scenario A
1. `Q_2_0_CLAIM_TYPE` has a response of 'Initial claim or claim for increase', 'Supplemental claim' or 'Higher-Level Review decision'.
2. One of these is true:
  - `Q_2_IS_1B_NEW_EVIDENCE` is 'No'
  - `Q_2_S_1_NEW_EVIDENCE` is 'No'
  - `Q_2_H_2_NEW_EVIDENCE` is 'No'

Scenario B
1. `Q_1_3A_FEWER_60_DAYS` is 'Yes'