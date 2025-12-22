This folder contains `json` files that can be updated by external teams (i.e. Content) and which will feed into forms system patterns. The `json` files are the sources of truth for their respective patterns.

## Service Branch pattern
- `serviceBranch.json` contains all services branches to be rendered in the `serviceBranchPattern`
- the keys of the object are the values that will be included in the form submission (e.g. `AAC` or `ARMY`).
- the value associated with each key contains:
    - the text that will be rendered in the underlying `va-combo-box` component (e.g. `Army Air Corps or Army Air Force`)
    - the group to which the value belongs (e.g. `Army`)