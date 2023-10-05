# Display Conditions

Display conditions are defined for every question in the flow. Instructions are cascading, meaning the display
conditions for a question rely on the display conditions of the question before it. This allows the display
conditions to be more concise and use less processing time when navigating backward or forward.

**Note**
- Refer to all files in this directory (other than `index.js`) for real examples.
- See [this Mural](https://app.mural.co/t/departmentofveteransaffairs9999/m/departmentofveteransaffairs9999/1692989444688/0044b9825c82d8d23920601f68c41a61d047d681?sender=ue51e6049230e03c1248b5078) for a visual diagram of the display conditions
for the PACT Act wizard flow.
- `SERVICE_PERIOD` is the first question in the flow. The answer to this question controls the display of
every other question after it. Its responses ("1990 or later", "1989 or earlier" and "During both of these time periods")
are used to refer to question sets throughout this document.
- All examples below are for demonstration only and may not represent accurate display conditions for the PACT Act wizard

## Basic Display Conditions

```
BURN_PIT_2_1: {
  SERVICE_PERIOD: [NINETY_OR_LATER, DURING_BOTH_PERIODS]
}
```

The above means that `BURN_PIT_2_1` will display if "1990 or later" or "During both of these time periods" is selected
for `SERVICE_PERIOD`.

More Notes:
- `BURN_PIT_2_1` is a `SHORT_NAME` representing a question.
- `BURN_PIT_2_1` does not display at all for "1989 or earlier".
- All questions within `BURN_PIT_2_1`'s object control display of `BURN_PIT_2_1`.
- The array of responses for `SERVICE_PERIOD` represents an **OR** (`||`) condition if multiple responses exist

## Nested Display Conditions

When a question has different display conditions depending on the response to `SERVICE_PERIOD`, the `SERVICE_PERIOD_SELECTION`
key is used to differentiate.

Example:

```
ORANGE_2_2_A: {
  SERVICE_PERIOD_SELECTION: {
    EIGHTYNINE_OR_EARLIER: {
      SERVICE_PERIOD: [EIGHTYNINE_OR_EARLIER]
    },
    DURING_BOTH_PERIODS: {
      SERVICE_PERIOD: [DURING_BOTH_PERIODS]
      BURN_PIT_2_1_2: [YES, NO, NOT_SURE]
    }
  }
}
```

**Note**
- In the `DURING_BOTH_PERIODS` flow, it is not necessary to specify other `BURN_PIT` questions that precede `BURN_PIT_2_1_2`.
Those display conditions are listed in the `BURN_PIT_2_1_2` question, and need not be duplicated here.

Per the above example, the question flows can be either of these:
- Scenario 1
  - `SERVICE_PERIOD` "1989 or earlier"
  - `ORANGE_2_2_A`
- Scenario 2: 
  - `SERVICE_PERIOD` "During both of these time periods"
  - `BURN_PIT_2_1` "No"
  - `BURN_PIT_2_1_1` "No"
  - `BURN_PIT_2_1_2` "No"
  - `ORANGE_2_2_A`

## Nested and Forked Display Conditions

Nested and forked display conditions use all of the above logic with an added layer of complexity. **Nested and forked** display conditions handle `SERVICE_PERIOD_SELECTION` flows that further split (referred to as a `FORK`).

When this applies, both `SHORT` and `LONG` must be included together.

Example:

```
ORANGE_2_2_A: {
  SERVICE_PERIOD_SELECTION: {
    [EIGHTYNINE_OR_EARLIER]: {
      SERVICE_PERIOD: [EIGHTYNINE_OR_EARLIER]
    }
    [DURING_BOTH_PERIODS]: {
      FORK: {
        SHORT: {
          SERVICE_PERIOD: [DURING_BOTH_PERIODS]
          ONE_OF: {
            BURN_PIT_2_1: [YES]
            BURN_PIT_2_1_1: [YES]
          }
        }
        LONG: {
          SERVICE_PERIOD: [DURING_BOTH_PERIODS]
          BURN_PIT_2_1_2: [YES, NO, NOT_SURE]
        }
      }
    }
  }
}
```

The question flows can be any of these:
- Scenario 1:
  - `SERVICE_PERIOD` "1989 or earlier"
  - `ORANGE_2_2_A`
- Scenario 2: ("Short")
  - `SERVICE_PERIOD` "During both of these time periods"
  - `BURN_PIT_2_1` "Yes"
  - `BURN_PIT_2_1_1` "No"
  - `ORANGE_2_2_A`
- Scenario 3: ("Long")
  - `SERVICE_PERIOD` "During both of these time periods"
  - `BURN_PIT_2_1` "I'm not sure"
  - `BURN_PIT_2_1_1` "I'm not sure"
  - `BURN_PIT_2_1_2` "I'm not sure"
  - `ORANGE_2_2_A`

The **Short** flow (line(s) above the main flow line) includes follow-up questions regarding locations chosen and/or `Yes` responses that skip remaining questions in the batch (e.g. Burn Pit) and/or direct to a results page.

The **Long** flow (main flow line) follows the `No` and `I'm not sure` response flows through all of the questions for that
`SERVICE_PERIOD_SELECTION` leading to the results screens.

## Nested, Forked and Pathed Display Conditions

Nested, forked and pathed display conditions use all of the functionality above plus a layer of complexity. The example below demonstrates a `FORK` with a
`SHORT` and `LONG` flow. The added complexity is inside the `SHORT` `FORK` below. It is unlikely that this structure will be used for the `LONG` `FORK`.