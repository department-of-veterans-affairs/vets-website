# todo

- Create mock API
  - X make API call with token from url and dump data into redux
  - X Create a demographics page
  - X Prefill data from redux
- Next Steps in tickets
- Demo to team

- Requirement doc
  - 5 pages
    - intro page
    - demographics page
    - NoK
    - Review Page
    - Confirmation page?

## Spikes

- [SPIKE] <https://dsva.slack.com/archives/C02GXKL8WM6/p1635952399044300?thread_ts=1635946020.043300&cid=C02GXKL8WM6>
- [SPIkE] Pages vs modals
- Tasks
  - Day of Check in
    - [SPIKE] Conditional show pages based on data from CHIP

- Create app busy work
  - URL
  - Content
  
## Forms system to useOption 1

- Old Formation (No)
  - No. Not dynamic enough for us
- ByPass, using Formik inside the Formation system
  - Pros
    - Some routing
      - dynamic routing is a risk. There are work arounds for dealing the following, but they are unofficial and workarounds
      - Entering and leaving the form is a risk.
    - all the decorations around a form (Breadcrumbs, progress bar)
    - review page
    - confirmation page
    - intro page
    - SiP
    - We might be able to levarage the
    - Every page would be a custom page, Could use the built in the stuff if need be
  - Cons
    - logging in the middle of the app becomes a challenge
    - Overriding the next/prev buttons would be a thing
    - [Latest mocks up](https://preview.uxpin.com/349cb3520e4ad95ebfb3e7b5dc0a40a2e582ac64#/pages/143335159/simulate/sitemap) do not have the form extras(progress bar), so we would have to hide them on every page
- Formik/Custom Forms
  - Risk
    - rolling everything ourselves

## pages

- validate page
- intro page
- demographics page
- edit demographics
- Next of Kin page
- Edit Next of Kin
- Review page
- confirmation page

optn 1

- same app
- differnent app

## Questions

- Is SiP a thing?
