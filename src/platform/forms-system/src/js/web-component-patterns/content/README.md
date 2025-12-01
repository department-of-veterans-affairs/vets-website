This folder contains files that can be updated by external teams (i.e. Content) and which will feed into various patterns.

## Service History pattern
- `serviceBranch.js` contains all services branches to be rendered in the `serviceBranchPattern`
- the keys of the exported object are the values that will be included in the form submission (e.g. `AAC` or `ARMY`).
- the value associated with each key contains:
    - the text that will be rendered in the underlying `va-combo-box` component
    - the group to which the value belongs