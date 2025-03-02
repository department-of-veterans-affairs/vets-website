# Decision Reviews Team

## Applications

- Higher-Level Review (VA Form 20-0996)
- Notice of Disagreement (aka Board Appeal, VA Form 10182)
- Supplemental Claim (VA Form 20-0995)

## Engineering Documents

- [Decision Review engineering folder](https://github.com/department-of-veterans-affairs/va.gov-team/tree/master/products/decision-reviews/engineering)
- [Set up backend](https://depo-platform-documentation.scrollhelp.site/developer-docs/base-setup-vets-api) - recommend running [native](https://depo-platform-documentation.scrollhelp.site/developer-docs/native-setup-vets-api) or [hybrid](https://github.com/department-of-veterans-affairs/vets-api/blob/master/docs/setup/hybrid.md)
- [Set up frontend](https://depo-platform-documentation.scrollhelp.site/developer-docs/setting-up-your-local-frontend-environment)
- Run all apps on frontend locally
  ```bash
  yarn watch --env entry=auth,static-pages,login-page,verify,terms-of-use,10182-board-appeal,0996-higher-level-review,995-supplemental-claim
  ```
- Run mock server (start new form)
  ```bash
  yarn mock-api --responses ./src/applications/appeals/shared/tests/mock-api.js
  ```
- Run mock server (save-in-progress with max data)
  ```bash
  yarn mock-api --responses ./src/applications/appeals/shared/tests/mock-api-full-data.js
  ```

## Supplemental Claim

- Source code: `/src/applications/appeals/995`
- Local entry: http://localhost:3001/decision-reviews/supplemental-claim/file-supplemental-claim-form-20-0995/
- [Product documentation](https://github.com/department-of-veterans-affairs/va.gov-team/tree/master/products/decision-reviews/Supplemental-Claims)
- [Service diagram](https://app.mural.co/t/departmentofveteransaffairs9999/m/adhoccorporateworkspace2583/1654096034291/25f4086b638b48828941c4d6aa330f1df1c9527a?sender=66cfcd80-684f-490f-a034-1540c801ca34)
- [Design](https://www.figma.com/design/2LGebZcUuu5Iqh4QLPII6A/Supplemental-Claims-(VA-0995)?node-id=0-1&p=f&t=hSNyd179dhEjyLoa-0)
- [Engineering documentation](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/decision-reviews/Supplemental-Claims/engineering)
- [Descision: VA evidence dates & UX](https://github.com/department-of-veterans-affairs/benefits-team-1-docs/discussions/3)



## Higher-Level Review

- Source code: `/src/applications/appeals/996`
- Local entry: http://localhost:3001/decision-reviews/higher-level-review/request-higher-level-review-form-20-0996
- [Product documentation](https://github.com/department-of-veterans-affairs/va.gov-team/tree/master/products/decision-reviews/higher-level-review)
- [Service Diagram](https://app.mural.co/t/departmentofveteransaffairs9999/m/lighthouseapiplatform7991/1631736307705/31e23e9b9754a0ffceecdc2f037dc86976553b08?sender=u0d70ac6e87daa7c066838517)
- [Design](https://www.figma.com/design/OxukHeNtSkCDbdmLxD5k9A/Higher-Level-Review-(VA-0996)?node-id=0-1&p=f&t=AcsDCMiqhMMt9WEK-0)
- [Engineering documentation](https://github.com/department-of-veterans-affairs/va.gov-team/tree/master/products/decision-reviews/higher-level-review/engineering)

## Notice of Disagreement (Board Appeal)

- Source code: `/src/applications/appeals/10182`
- Local entry: http://localhost:3001/decision-reviews/board-appeal/request-board-appeal-form-10182/
- [Product documentation](https://github.com/department-of-veterans-affairs/va.gov-team/tree/master/products/decision-reviews/Notice-of-Disagreement)
- [Service diagram](https://app.mural.co/t/departmentofveteransaffairs9999/m/departmentofveteransaffairs9999/1686860506968/58cf67b56dfb12c9337cdd7b110dbf6182a55516?invited=true&sender=02d71842-45b3-44df-b5bd-b1399d0ba73e)
- [Design](https://www.figma.com/design/BplQkEDZzD8NPPNmLrhvXv/Request-a-Board-Appeal-%2F-Notice-of-Disagreement-(VA-10182)?node-id=0-1&p=f&t=ApOjFtPTpJhsEL3D-0)
- [Engineering documentation](https://github.com/department-of-veterans-affairs/va.gov-team/tree/master/products/decision-reviews/Notice-of-Disagreement/engineering)
