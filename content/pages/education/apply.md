---
layout: page-breadcrumbs.html
title: Education Benefits Application Process
plainlanguage: 11-02-16 certified in compliance with the Plain Writing Act
template: 1-topic-landing
showactionbar: false
relatedlinks:
 - url: /education/gi-bill/
   title: GI Bill
   description: "Learn about the GI Bill benefits that millions of Veterans like you have used to pay for college."
 - url: /education/advanced-training-and-certifications/
   title: Advanced Training and Certifications
   description: "The GI Bill can pay for more than just academic programs. Use it to help cover the costs of becoming a licensed or certified professional (like a mechanic or medical technician) or a business owner."
---

<div class="va-introtext">

If you’re a Servicemember, Veteran, or family member interested in education and training opportunities, you can apply for your Certificate of Eligibility (COE). You can also manage your current benefits.

</div>

### Prepare

- [Check your eligibility](/education/eligibility/).
- Gather the documents and information listed below that you'll need to apply for education benefits.
- See what benefits you'll get at the school you want to attend. [Go to the GI Bill Comparison Tool](/gi-bill-comparison-tool/).
- Work with a trained professional with a Veterans Service Organization (VSO) who can help you pick the right program. [Find an accredited representative](/disability-benefits/apply-for-benefits/help/index.html).

<div markdown="0"><br></div>

<div class="call-out" markdown="1">

#### What documents and information do I need to apply?

- Social Security number
- Bank account direct deposit information
- Education and military history
- Basic information about the school or training facility you want to attend or are attending now

</div>

### Ready to apply?

#### Applying for a new benefit
Apply online with Form 22-1990 or 22-1990E:

<button id="apply-expander-button" class="usa-button-primary va-button-primary expander-button">Apply for Benefits</button>

<p>
  <div id="apply-expander-content" class="form-expanding-group-open expander-content expander-content-closed">
    <div class="expander-content-inner">
      <div>Which form do you want to use?</div>
      <div class="form-radio-buttons">
        <input type="radio" name="form-selection" id="form-22-1990" value="1990">
        <label for="form-22-1990">Veterans applying for a <strong>new benefit</strong> (22-1990)</label>
        <input type="radio" name="form-selection" id="form-22-1990e" value="1990e">
        <label for="form-22-1990e">Dependents applying for a <strong>transferred benefit</strong> (22-1990E)</label>
        <!--
        <input type="radio" name="form-selection" id="form-22-5490" value="5490">
        <label for="form-22-5490">Dependent applying for a new benefit where your <strong>sponsor is permanently and totally disabled</strong> (22-5490)</label>
        <input type="radio" name="form-selection" id="form-22-5490" value="5490">
        <label for="form-22-5490">Dependent applying for a new benefit where your <strong>sponsor is deceased, MIA, or a POW</strong> (22-5490)</label>
        -->
      </div>
      <a id="apply-go-button" class="usa-button-primary va-button-primary">Apply Now</a>
    </div>
  </div>
</p>

#### Make a change to your current education benefits

If you need to make a change (for example, you’re moving to a new school), manage your benefits with Form 22-1995:

<a href="/education/apply-for-education-benefits/application/1995" class="usa-button-primary usa-button-outline">Manage Benefits</a>

<div class="usa-alert usa-alert-warning usa-content va-alert" markdown="1">
	<div class="usa-alert-body">

##### Forms 22-1990N, 22-5490, and 22-5495

You must apply for education benefits using eBenefits if you're:
- A dependent whose sponsor is permanently and totally disabled
- A dependent whose sponsor is deceased, MIA, or a POW
- A candidate for the National Call to Service program

<div markdown="0">
	<a class="usa-button-primary usa-button-outline usa-button-outline-exit transparent" href="https://www.ebenefits.va.gov/ebenefits/vonapp">Apply on eBenefits</a>
</div>
</div>
</div>
<br>

<div markdown="0"><br></div>

### Other ways to apply

#### In person
- Go to a VA regional office and have a VA employee help you. [Find a regional office near you](/facilities).
- Work with your school’s VA certifying official. This person is usually in the Registrar or Financial Aid office at the school.

#### By mail
- Call <a href="tel:+18884424551">888-442-4551</a> (888-GI-BILL-1) from 8:00 a.m. to 7:00 p.m. (ET), Monday through Friday, to request that we send the application to you. Fill it out and mail it to the VA regional claims processing office that’s in the same location as your school. [See a list of regional claims processing offices](http://www.benefits.va.gov/gibill/regional_processing.asp).

### What happens after I apply?

- [Find out what happens after you apply](/education/after-you-apply).
- You can't make changes to your application, but if you have questions about education benefits, please call <a href="tel:+18884424551">888-442-4551</a> (888-GI-BILL-1) from 8:00 a.m. to 7:00 p.m. (ET), Monday through Friday.
- If we've asked you for documents, please upload them through the GI Bill website. <a class="usa-button-primary" href="https://gibill.custhelp.com/app/home">Go to the GI Bill Website</a>

#### How long does it take us to make a decision?

<div class="card information" markdown="0">
<span class="number">30 days</span>
<span class="description">Average time to process education claims</span>
</div>

<div markdown="0"><br></div>

<script type="text/javascript">
  // I'm open to suggestions on how to not do this here

  function toggleClass(elementId, className) {
    document.getElementById(elementId).classList.toggle(className);
  }

  // Toggle the expandable apply fields
  document.getElementById('apply-expander-button')
    .addEventListener('click', function () {
      toggleClass('apply-expander-content', 'expander-content-closed');
      toggleClass('apply-expander-button', 'va-button-primary');
    });

  // Make the go button go to the right place
  document.getElementById('apply-go-button')
    .addEventListener('click', function () {
      var selectedForm = document.querySelector('input[name="form-selection"]:checked');

      if (selectedForm) {
        location.assign('/education/apply-for-education-benefits/application/' + selectedForm.value + '/introduction');
      }
    });
</script>
