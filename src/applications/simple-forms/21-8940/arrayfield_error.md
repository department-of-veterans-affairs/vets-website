# Error Report: ArrayField.handleAdd TypeError

## IMPORTANT: 
This occurs for every single ArrayField/Item Array, must be patched

## Summary

An error occurs when a user tries to add a new item to an array field (such as doctor information) before entering any information for the first item. This happens when the array is empty or uninitialized on page load.


## Steps to Reproduce

1. Load the page with an array field (e.g., doctor information) that is empty or uninitialized.
2. Without entering any information for the first item, click to add a new item.
3. Observe the error in the console: "Cannot read properties of undefined (reading 'length')
TypeError: Cannot read properties of undefined (reading 'length')"

## Root Cause

The array field is `undefined` instead of an empty array (`[]`) when the page loads. When the user tries to add a new item, the code attempts to access the `.length` property of `undefined`, causing a TypeError.


### Example

doctorInformation: []


## Error Message
