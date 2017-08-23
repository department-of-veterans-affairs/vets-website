---
layout: page-breadcrumbs.html
template: detail-page
title: Education Benefits Application Process
display_title: Application Process
plainlanguage: 11-02-16 certified in compliance with the Plain Writing Act
collection: education
order: 2
---

<div class="va-introtext">

If you’re a Servicemember, Veteran, or family member interested in education and training opportunities, you can apply for your Certificate of Eligibility (COE). You can also manage your current benefits.

</div>

### Prepare

- [Check your eligibility](/education/eligibility/).
- Gather the documents and information listed below that you’ll need to apply for education benefits.
- See what benefits you’ll get at the school you want to attend. [Go to the GI Bill Comparison Tool](/gi-bill-comparison-tool/).
- Work with a trained professional with a Veterans Service Organization (VSO) who can help you pick the right program. [Find an accredited representative](/disability-benefits/apply/help/index.html).

<div markdown="0"><br></div>

<div class="feature" markdown="1">

#### What documents and information do I need to apply?

- Social Security number
- Bank account direct deposit information
- Education and military history
- Basic information about the school or training facility you want to attend or are attending now

</div>

### Ready to apply?

<div class="wizard-container">
  <button class="usa-button-primary va-button-primary wizard-button">Select Correct Form</button>

  <p>
    <div class="form-expanding-group-open wizard-content wizard-content-closed">
      <div class="wizard-content-inner">
        <div class="wizard-content-question" data-question="create-or-update" data-state="open">
        <label>Are you applying for a new benefit or updating your current education benefits?</label>
          <div class="form-radio-buttons">
            <input type="radio" name="create-or-update" id="new-application" value="new-application" data-next-question="create" data-alternate="existing-application">
            <label for="new-application">Applying for a new benefit</label>
            <input type="radio" name="create-or-update" id="existing-application" value="existing-application" data-next-question="update" data-alternate="new-application">
            <label for="existing-application">Updating my current education benefits</label>
          </div>
        </div>
        <div class="wizard-content-question" data-question="create" data-alternate="update" data-state="closed">
        <label>Are you a Veteran or Servicemember claiming a benefit based on your own service?</label>
          <div class="form-radio-buttons">
            <input type="radio" name="create" id="is-veteran" value="is-veteran" data-next-question="national-call-to-service" data-alternate="is-not-veteran">
            <label for="is-veteran">Yes</label>
            <input type="radio" name="create" id="is-not-veteran" value="is-not-veteran" data-next-question="create-dependent" data-alternate="is-veteran">
            <label for="is-not-veteran">No</label>
          </div>
        </div>
        <div class="wizard-content-question" data-question="national-call-to-service" data-alternate="create-dependent" data-state="closed">
        <label>Are you claiming a <strong>National Call to Service</strong> education benefit?<br />
              (This is uncommon)
          </label>
          <div class="form-radio-buttons">
            <input type="radio" name="national-call-to-service" id="is-ncts" value="is-ncts" data-selected-form="1990n" data-alternate="is-not-ncts">
            <label for="is-ncts">Yes</label>
            <input type="radio" name="national-call-to-service" id="is-not-ncts" value="is-not-ncts" data-selected-form="1990" data-alternate="is-ncts">
            <label for="is-not-ncts">No</label>
          </div>
        </div>
        <div class="wizard-content-question" data-question="update" data-alternate="create" data-state="closed">
        <label>Are you receiving education benefits transferred to you by a sponsor Veteran?</label>
          <div class="form-radio-buttons">
            <input type="radio" name="update" id="update-non-dependent" value="is-not-dependent" data-selected-form="1995" data-alternate="update-dependent">
            <label for="is-not-dependent">No, I’m using my own benefit.</label>
            <input type="radio" name="update" id="update-transfer" value="is-transfer" data-selected-form="1995" data-alternate="update-dependent">
            <label for="is-transfer">Yes, I’m using a transferred benefit.</label>
            <input type="radio" name="update" id="update-dependent" value="is-dependent" data-selected-form="5495" data-alternate="update-non-dependent update-transfer">
            <label for="is-dependent">No, I am using the Fry Scholarship or DEA (Chapter 35)</label>
          </div>
        </div>
        <div class="wizard-content-question" data-question="create-dependent" data-alternate="national-call-to-service" data-state="closed">
        <label>Is your sponsor deceased, 100% permanently disabled, MIA, or a POW?</label>
          <div class="form-radio-buttons">
            <input type="radio" name="create-dependent" id="create-dependent" value="is-dependent" data-selected-form="5490" data-alternate="create-non-dependent">
            <label for="create-dependent">Yes</label>
            <input type="radio" name="create-dependent" id="create-non-dependent" value="is-non-dependent" data-next-question="create-transfer"  data-alternate="create-dependent">
            <label for="create-non-dependent">No</label>
          </div>
        </div>
        <div class="wizard-content-question" data-question="create-transfer" data-state="closed">
        <label>Has your sponsor transferred their benefits to you?</label>
          <div class="form-radio-buttons">
            <input type="radio" name="create-transfer" id="create-transfer" value="is-transfer" data-selected-form="1990e" data-alternate="create-transfer">
            <label for="create-transfer">Yes</label>
            <input type="radio" name="create-transfer" id="create-non-transfer" value="is-non-transfer" data-selected-form="1990e" data-alternate="create-transfer">
            <label for="create-non-transfer">No</label>
          </div>
        </div>
        <div id="ncts-warning" class="usa-alert usa-alert-warning usa-content secondary" data-state="closed">
        <div class="usa-alert-body">
          <h4 style="padding:0;">Are you sure?</h4>
          <p style="margin:0;">Are all of the following things true of your service?</p>
          <ul>
            <li>Enlisted under the National Call to Service program, <strong>and</strong></li>
            <li>Entered service between 10/01/03 and 12/31/07, <strong>and</strong></li>
            <li>Chose education benefits</li>
          </ul>
        </div>
        </div>
        <div id="transfer-warning" class="usa-alert usa-alert-warning usa-content secondary" data-state="closed">
        <div class="usa-alert-body">
          <h4 style="padding:0;">Your application cannot be approved until your sponsor transfers their benefits.</h4>
          <p style="margin:0;"><a target="_blank" href="https://www.dmdc.osd.mil/milconnect/public/faq/Education_Benefits-How_to_Transfer_Benefits">Instructions for your sponsor to transfer education benefits.</a></p>
        </div>
        </div>
        <a id="apply-now-button" class="usa-button-primary va-button-primary apply-go-button" data-state="closed">Apply now</a>
      </div>
    </div>
  </p>
</div>

### Other ways to apply

#### In person
- Go to a VA regional office and have a VA employee help you. [Find a regional office near you](/facilities).
- Work with your school’s certifying official. This person is usually in the Registrar or Financial Aid office at the school.

#### By mail
- Call <a href="tel:+18884424551">888-442-4551</a> (888-GI-BILL-1) from 8:00 a.m. to 7:00 p.m. (ET), Monday through Friday, to request that we send the application to you. Fill it out and mail it to the VA regional claims processing office that’s in the same location as your school. [See a list of regional claims processing offices](http://www.benefits.va.gov/gibill/regional_processing.asp).

### What happens after I apply?

- [Find out what happens after you apply](/education/after-you-apply).
- You can’t make changes to your application, but if you have questions about education benefits, please call <a href="tel:+18884424551">888-442-4551</a> (888-GI-BILL-1) from 8:00 a.m. to 7:00 p.m. (ET), Monday through Friday.
- If we’ve asked you for documents, please upload them through the GI Bill website. <a class="usa-button-primary" href="https://gibill.custhelp.com/app/home">Go to the GI Bill Website</a>

#### How long does it take us to make a decision?

<div class="card information" markdown="0">
<span class="number">30 days</span>
<span class="description">Average time to process education claims</span>
</div>

<div markdown="0"><br></div>
