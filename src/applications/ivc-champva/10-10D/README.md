# Application for CHAMPVA benefits (IVC CHAMPVA Form 10-10d) Readme

_Integrated Veteran Care - [Civilian Health and Medical Program of the Department of Veterans Affairs](https://www.va.gov/health-care/family-caregiver-benefits/champva/) (IVC-CHAMPVA)_

## Executive Summary

This document contains context and other relevant notes that apply specifically
to form 10-10d as implemented in this directory. It provides information about
the components used, the overall form flow, and other notable features.

> [!IMPORTANT][platform documentation](https://depo-platform-documentation.scrollhelp.site/developer-docs/) is always the best place to go for form application development information. This document should be consulted _in addition_ to those resources, not _instead_ of.

> [!NOTE]
> Consult the parent directory README for information that applies to all IVC CHAMPVA forms.

## Contents

- [Overview of 10-10d](#overview-of-10-10d)
  - Organization
  - Information collected
- [Special considerations and requirements](#special-considerations-and-requirements)
  - Collecting multiple applicants (list loop)
  - Optionally requiring file uploads (supporting mail-in)

## Overview of 10-10d

10-10d is a key form for the CHAMPVA program. It is the form users fill out when
enrolling in the program. It is used to determine their eligibility to claim
benefits.

This was the first form digitized by the newly-created IVC CHAMPVA team in 2023/2024, and
is also the largest and most complex so far due to its conditional nature.

![image of form 10-10d PDF partially filled out](../images/example_1010d.png '10-10d PDF')

The form is organized into three sections:

- Sponsor information
  - This is information about the sponsor (veteran with whom the applicant is associated)
  - The sponsor may be living or deceased
  - An applicant must have a valid sponsor to be eligible
- Applicant information
  - This is information about the person(s) applying to claim benefits
  - The paper/PDF form supports up to three applicants. **In the digital form, we have increased the number of possible applicants to 25** (more on this in section XX)
- Certifier information
  - This is information about the person filling out the form if they are not
    one of the listed applicants.

## Special considerations and requirements

10-10d had two main special considerations that needed to be taken into account
when developing.

### Special consideration 1: Support for > 3 applicants

**Stuff about list loop, specifically about how custom wording required a lot of working around.**

### Special consideration 2: Support for bypassing required file uploads (mail-in)

**Stuff about the missing file overview**

**A diagram of the components that make it up? -> Might help with a refactor in future...**
