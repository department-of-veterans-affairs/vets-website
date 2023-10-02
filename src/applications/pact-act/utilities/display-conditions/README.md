# Display Conditions

**Note**
- Refer to all files in this directory (other than `index.js`) for real examples.
- See [this Mural](https://app.mural.co/t/departmentofveteransaffairs9999/m/departmentofveteransaffairs9999/1692989444688/0044b9825c82d8d23920601f68c41a61d047d681?sender=ue51e6049230e03c1248b5078) for a visual diagram of the display conditions
for the PACT Act wizard flow.
- `SERVICE_PERIOD` is the first question in the flow. The answer to this question controls the display of
every other question after it. Its responses ("1990 or later", "1989 or earlier" and "During both of these time periods")
are used to refer to question sets throughout this document.

Display conditions are formatted as such:

```
BURN_PIT_2_1: {
  SERVICE_PERIOD: [NINETY_OR_LATER, DURING_BOTH_PERIODS]
}
```

Per the above, the question flow can be either of these:
- Scenario 1
  - `SERVICE_PERIOD` "1990 or later"
  - `BURN_PIT_2_1`
- Scenario 2
  - `SERVICE_PERIOD` "During both of these time periods"
  - `BURN_PIT_2_1`

Also per the above, `BURN_PIT_2_1` does not display at all for "1989 or earlier".

More Notes:
- `BURN_PIT_2_1` is a `SHORT_NAME` representing a question.
- All questions within `BURN_PIT_2_1`'s object control display of `BURN_PIT_2_1`.
- The array of responses for `SERVICE_PERIOD` represents an **OR** (`||`) condition if multiple responses exist
  - To display `BURN_PIT_2_1`, either of these responses may be selected.

## Nested Display Conditions

Nested display conditions use the above logic plus a layer of complexity. 

There are different question paths for the responses for SERVICE_PERIOD. We have a `PATHS` key to distinguish display conditions for a question for each of those paths.

### Important: PATHS are included when there is different behavior for the question depending on the response to `SERVICE_PERIOD`

Example:

```
ORANGE_2_2_A: {
  PATHS: {
    EIGHTYNINE_OR_EARLIER: {
      SERVICE_PERIOD: [EIGHTYNINE_OR_EARLIER]
    },
    DURING_BOTH_PERIODS: {
      SERVICE_PERIOD: [DURING_BOTH_PERIODS]
      BURN_PIT_2_1: [NO, NOT_SURE]
      BURN_PIT_2_1_1: [NO, NOT_SURE]
      BURN_PIT_2_1_2: [YES, NO, NOT_SURE]
    }
  }
}
```

The question flows can be either of these:
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

Nested and forked display conditions use all of the above logic with an added layer of complexity. **Nested and forked** display conditions handle PATHS that further split (referred to as a **fork**).

### Important: FORK is included when there are multiple paths to get to the same question within a `SERVICE_PERIOD` flow. When this applies, both SHORT and LONG must be included together.

Example:

```
ORANGE_2_2_1_B: {
  PATHS: {
    EIGHTYNINE_OR_EARLIER: {
      SERVICE_PERIOD: [EIGHTYNINE_OR_EARLIER]
      ORANGE_2_2_A: [NO, NOT_SURE]
      ORANGE_2_2_1_A: [YES]
    },
    DURING_BOTH_PERIODS: {
      FORK: {
        SHORT: {
          SERVICE_PERIOD: [DURING_BOTH_PERIODS],
          BURN_PIT_2_1: [YES],
          BURN_PIT_2_1_1: [YES],
          ORANGE_2_2_A: [NO, NOT_SURE],
          ORANGE_2_2_1_A: [YES],
        },
        LONG: {
          SERVICE_PERIOD: [DURING_BOTH_PERIODS],
          BURN_PIT_2_1: [NO, NOT_SURE],
          BURN_PIT_2_1_1: [NO, NOT_SURE],
          BURN_PIT_2_1_2: [YES, NO, NOT_SURE],
          ORANGE_2_2_A: [NO, NOT_SURE],
          ORANGE_2_2_1_A: [YES],
        },
      },
    }
  }
}
```

The question flows can be any of these:
- Scenario 1:
  - `SERVICE_PERIOD` "1989 or earlier"
  - `ORANGE_2_2_A` "No"
  - `ORANGE_2_2_1_A` "Yes"
  - `ORANGE_2_2_1_B`
- Scenario 2: ("Short")
  - `SERVICE_PERIOD` "During both of these time periods"
  - `BURN_PIT_2_1`: "Yes",
  - `BURN_PIT_2_1_1`: "Yes",
  - `ORANGE_2_2_A`: "I'm not sure",
  - `ORANGE_2_2_1_A`: "Yes",
- Scenario 3: ("Long")
  - `SERVICE_PERIOD` "During both of these time periods"
  - `BURN_PIT_2_1`: "I'm not sure",
  - `BURN_PIT_2_1_1`: "I'm not sure",
  - `BURN_PIT_2_1_2`: "I'm not sure",
  - `ORANGE_2_2_A`: "I'm not sure",
  - `ORANGE_2_2_1_A`: "Yes",

The **Long** flow (main flow line) tends to follow the `No` and `I'm not sure` response paths through all of the location questions (with few exceptions) leading to the results screens. It is the longer path through the application.

The **Short** flow (lines above the main flow line) tends to contain follow-up questions regarding locations chosen and/or `Yes` responses that can skip remaining questions in the batch (e.g. Burn Pit) and/or direct to a results page. It is the shorter path through the application.

Both `SHORT` and `LONG` should be included in a `FORK`.
