# Form Config Validation
To catch mistakes a developer may introduce in a `formConfig`, validation functions in this directory are run against the `formConfig`. This ensures that developers can catch and fix common mistakes.

## Validation functions
Each form config validation function must accept the `formConfig`.

If the `formConfig` contains an error introduced by a developer, the validation function should throw an `Error` with a description of the error and what to do to fix it.

If the configuration does not contian an error, the validation function should do nothing. No return value is needed.
