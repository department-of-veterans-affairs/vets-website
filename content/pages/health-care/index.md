---
layout: page-breadcrumbs.html
template: level2-index
title: Health Care Benefits
display_title: Health Care
permalink: /health-care/index.html
widgets:
  - root: react-applicationStatus
    timeout: 20
    loadingMessage: Checking your application status.
    errorMessage: <strong>We’re sorry. Something went wrong when we tried to load your saved application.</strong><br/>Please try refreshing your browser in a few minutes.
majorlinks:
  - heading: Apply for Health Care Benefits
    links:    
    - url: /health-care/eligibility/
      title: Eligibility
      description: Find out if you can get VA health care benefits.
    - url: /health-care/apply/
      title: How to Apply 
      description: Apply online now, or find out how to apply in person, by phone, or by mail.
    - url: /health-care/family-caregiver-health-benefits/
      title: Family and Caregiver Health Benefits
      description: If you’re the spouse, surviving spouse, dependent child, or family caregiver of a Servicemember or Veteran, you may qualify for health care benefits like TRICARE, CHAMPVA, or other programs based on your caregiver status or your family member's service history.
  - heading: Manage Your Health
    links:
    - url: /health-care/health-conditions/conditions-related-to-service-era/
      title: Learn About Health Concerns Related to Your Service History
      description: Learn about service-connected health concerns you should be aware of based on when and where you served.
    - url: /health-care/prescriptions
      title: Refill Prescriptions
      description: Refill prescriptions online, and track the status of your refills.
    - url: /health-care/messaging
      title: Send a Secure Message to Your Health Care Team
      description: Send a secure, private note to your primary care provider or other members of your VA health care team.
    - url: /health-care/schedule-an-appointment
      title: Schedule a VA Appointment
      description: Find out how to make a doctor's appointment with a member of your VA health care team online or by phone.
    - url: /health-care/health-records/
      title: Get Your VA Health Records
      description: View, download, and print your VA health records.
  - heading: Learn About Health Care Coverage
    links:
    - url: /health-care/about-va-health-care/
      title: About VA Health Care Coverage
      description: Learn more about your VA health care benefits, your health care team, and where you’ll go for care.
    - url: /health-care/health-conditions
      title: Health Needs and Conditions
      description: Find out how to access VA services for mental health, women’s health, and other specific needs.
    - url: /health-care/health-conditions/conditions-related-to-service-era/
      title: Conditions Related to When and Where You Served
      description: Find out which service-connected health concerns you should be aware of, based on when and where you served.
    - url: /health-care/affordable-care-act/
      title: Affordable Care Act (ACA)
      description: Find out what you need to know about the ACA and your health coverage.
---

<div class="va-introtext">

With VA health care, you’re covered for regular checkups with your primary care provider and appointments with specialists (like cardiologists, gynecologists, and mental health providers). You also gain access to home health and geriatric (elder) care, medical equipment, prosthetics, and prescriptions.

</div>

<div id="react-applicationStatus" data-hide-apply-button class="static-page-widget"></div>
  
<div class="usa-alert usa-alert-warning">
  <div class="usa-alert-body">
    <h4 class="usa-alert-heading">How do I get help if I'm homeless or at risk of becoming homeless?<br><a id="crisis-expander-link">We may be able to help</a>.</h4>
    <div id="crisis-expander-content" class="expander-content expander-content-closed">
      <div class="expander-content-inner usa-alert-text">

We offer many programs and services that may help—including free health care and, in some cases, free limited dental care. We can also help you connect with resources in your community, like homeless shelters or faith-based organizations.
  
**Find the support you need:**

- **Call the National Call Center for Homeless Veterans** at 1-877-4AID-VET (<a href="tel:+18774243838">1-877-424-3838</a>) for help 24 hours a day, 7 days a week. You’ll talk privately with a trained VA counselor for free.
- **Contact your nearest VA medical center** and ask to talk with the VA social worker. If you're a female Veteran, ask for the Women Veterans Program Manager. <br>
[Find the nearest VA medical center](/facilities/).

**Talk with someone right now:**
 
Whatever you’re struggling with—homelessness, chronic pain, anxiety, depression, trouble sleeping, or anger—we can support you, day or night.<br>
[Chat online with a trained VA staff member](https://www.veteranscrisisline.net/ChatTermsOfService.aspx?account=Homeless%20Veterans%20Chat").

   </div>
  </div>
 </div>
</div>

<script type="text/javascript">
  // Toggle the expandable crisis info
  document.getElementById('crisis-expander-link')
    .addEventListener('click', function () {
      document.getElementById('crisis-expander-content').classList.toggle('expander-content-closed');
    });
</script>
