# {{title}}

> Run start date: {{startDate}}
> Duration: {{duration}}s

## Tests run stats

📚 total tests: {{totalTests}}

✔️ passed: {{passedTestsCount}} | ❌ failed: {{failedTestsCount}} | 🔜 skipped: {{skippedTestsCount}} | ⚠️ skipped by Cypress: {{skippedCypressTestsCount}} | ❇️ other: {{otherTestsCount}}

{{#passedExists}}

## Passed tests

<details>
<summary>Click to reveal</summary>
<article>
{{#passedTests}}

- ✔️ [{{title}}]({{path}})
  {{/passedTests}}
  </article>
  </details>
  {{/passedExists}}

{{#failedExists}}

## Failed tests

<details>
<summary>Click to reveal</summary>
<article>
{{#failedTests}}

💢 [{{title}}]({{path}})

```diff
  {{err.message}}
```

{{/failedTests}}

</article>
</details>
{{/failedExists}}

{{#skippedExists}}

## Skipped tests

<details>
<summary>Click to reveal</summary>
<article>
{{#skippedTests}}

- 🔜 [{{title}}]({{path}})
  {{/skippedTests}}
  </article>
  </details>
  {{/skippedExists}}

{{#skippedCypressExists}}

## Skipped tests by Cypress

<details>
<summary>Click to reveal</summary>
<article>
{{#skippedCypress}}

- ⚠️ [{{title}}]({{path}})
  {{/skippedCypress}}
  </article>
  </details>
  {{/skippedCypressExists}}
