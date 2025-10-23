# Cypress Test Approach

Refer to this [Figma](https://www.figma.com/design/5vAWK3wpBkJgG7ngLXYmht/Onramping-Tool?node-id=148-12838&t=YIDFuLZ1yrDtIsh8-0) for a complete diagram of all question flows.

We want to use automated tests for as many flows as reasonable to ensure the display logic is functioning as expected. This includes navigation between questions and to and from the introduction page and results pages.

We also recognize that we are limited in our ability to comprehensively test our components and end-to-end flow from our unit tests due to shadow DOM limitations. Cypress tests help us cover expected flows and gain confidence that our decision tree and utility functions are working correctly.

## Cypress testing structure

### Parent folders

There are a number of `results-` parent folders. If the decision tree has a line to a results screen, there is a test file for it.

`results-shortcuts` are the "shortcut" results screens that are not necessarily Decision Review pathway recommendations. They are represented by black ovals on the decision tree.

If there are multiple lines leading to a particular results screen, there is a test to represent each of those lines.

If there's a path split (`ONE_OF` in the decision tree logic) scenario that leads to a results screen, we cover all of the splits leading to that results screen with an individual test file each.

The answers to the questions for each file (what the "path" is) are described in brief in the comments above the main `describe` block near the top of the file.

## Cypress test performance

There are many tests, but the idea is to keep their runs short and concise. Our CI is set up to run Cypress tests in parallel and performance should not be a major concern as long as the individual tests take on average a few seconds to run each.

Additionally, because we are covering what our unit tests cannot (clicks on web components and thus answer validation and navigation between questions), that necessitates more end-to-end tests for now.