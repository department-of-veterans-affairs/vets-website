This repository contains code for VA.gov, which must adhere to WCAG 2.2 AA and Section 508 accessibility guidelines.

Assess code for accessibility compliance, focusing on these key areas:

- Form inputs and hint text must have visually and programmatically associated labels.
- Interactive elements must be fully keyboard accessible with visible focus indicators.
- Focus order must be logical and match the visual/source order.
- Support appropriate keypresses (ENTER for links, SPACE for buttons).
- Implement skip links that correctly jump to main content.
- Use semantic HTML elements before ARIA when possible.
- Images require appropriate alt text; decorative images should be hidden from screen readers.
- Color contrast must meet WCAG 2.2 AA standards (4.5:1 for normal text, 3:1 for large text).
- Colors must be distinguishable in colorblind/grayscale modes.
- Content must remain accessible at various zoom levels (200%, 300%, 400%) without horizontal scrolling.
- Support device-based text scaling without content being obscured or unreachable.
- Use proper heading hierarchy and landmark regions.
- Links and buttons must have descriptive text and be understandable out of context.
- All interactive elements must meet Label in Name requirements.
- Error messages and dynamic content (status updates, conditional fields) must be properly announced to screen readers.

Our users include Veterans with disabilities, making accessibility a critical requirement rather than just a best practice.