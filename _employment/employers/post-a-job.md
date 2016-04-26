---
title: Post a Job
concurrence: complete
template: 1-topic-landing
---
<link href="/assets/css/vendor/prism.css" type="text/css" rel="stylesheet">

<div class="main" role="main" markdown="0">

<div class="section one" markdown="0">
<div class="primary" markdown="0">
<div class="row" markdown="0">
<div class="small-12 medium-9 columns" markdown="0">

<div markdown="1">

Thank you for your interest in hiring Veterans, transitioning Servicemembers, and their families through the Veterans Employment Center (VEC). Maximize your exposure by posting jobs directly from your website to the Veterans Job Bank through the [National Labor Exchange (NLX)](https://us.jobs/postajobpartner.asp?partner=ebenefits). 

</div>

<div class="call-out" markdown="1">

### Who can post a job?

Anyone

</div>

<div class="call-out" markdown="1">

### Who is eligible
All employers

**A note about registration:** You do not have to be registered with the NLX to post a job in the VEC, but it may streamline the process. 
</div>

<div markdown="1">
### How it works

If your company’s current job listing is posted on the NLX, then it is also searchable in the Veterans Job Bank. If you haven’t registered your company with the NLX, [register now and post for free](https://us.jobs/postajobpartner.asp?partner=ebenefits). 
Or reach out to [qualified Veterans and military spouses](https://www.vets.gov/veterans-employment-center/employers) directly.



<div markdown="1">
### How to be a featured employer

Use the JobPosting Schema from schema.org. If your job listing conforms to the JSON-LD template for schema.org’s JobPosting vocabulary, your job will automatically appear in the Veterans Job Bank within 24 hours of adding the job URL to the designated box in your VEC profile. When appropriate to a search query, your job will be returned as a featured listing near the top of the search results. Please note that the provided URL must end in .json and contain valid JSON-LD.


#### How the schema works

The schema.org JobPosting vocabulary consists of 18 basic elements (listed below). Each element describes a core detail of a job vacancy. Participation in the Veterans Job Bank requires only a handful of these elements (datePosted, hiringOrganization, JobLocation, SpecialCommitments, title, and url). Adding more elements, however, will make your job posting more accessible to searchers.

<hr>
### The schema.org JSON-LD JobPosting elements

Only those marked with an asterisk (*) are required for inclusion in the Veterans Job Bank. Square brackets [like this] following each element name indicate the schema.org data type.

- ***title**: [Text] The descriptive title for the job vacancy or opportunity
- ***hiringOrganization**: [Organization] The company or organization with the vacancy or opportunity
- **industry**: [Text] The major industry in which the vacancy or opportunity operates
- **occupationalCategory**: [Text] (use BLS O*NET-SOC taxonomy: http://www.onetcenter.org/taxonomy.html)
- ***jobLocation**: [Place] The principal place of performance for the vacancy or opportunity
- **baseSalary**: [Number] Annual salary. If hourly position, estimate cumulative annual wages
- **salaryCurrency**: [Text] Indication of country currency in which salary will be paid, particularly for international vacancies or opportunities
- **employmentType**: [Text] (e.g., full-time, part-time, contract, temporary, seasonal, internship)
- **workHours**: [Text] (e.g., 1st shift, night shift, 8am-5pm)
- **qualifications**: [Text] Any certifications, experience, training, licenses, or other special qualifications required for the vacancy or opportunity
- **skills**: [Text] Key or special skills to be highlighted in relation to the vacancy or opportunity
- **educationRequirements**: [Text] Level of education or educational specialty required for the vacancy or opportunity
- **experienceRequirements**: [Text] Years or months of previous experience required for the vacancy or opportunity. May also indicate entry level.
- **responsibilities**: [Text] Key duties and responsibilities for the vacancy or opportunity
- **benefits**: [Text] Benefits associated with the vacancy or opportunity, including health insurance, retirement, tuition assistance, or other nonsalary-based compensation
- **incentives**: [Text] A place for bonus and commission compensation
- ***specialCommitments**: [Text] (e.g., VeteranCommit, MilitarySpouseCommit, etc.)
- ***datePosted**: [Date] Effective date of posting for the vacancy or opportunity
- ***url**: [URL] Unique url of the detailed job posting

#### Schema.org JSON-LD example

This example contains two job listings. The first uses a smaller set of schema.org elements. Both contain all elements required for inclusion in the Veterans Job Bank. 
          
<!-- Each of these lines needs to begin with 4 spaces -->
<pre><code class="language-json">[{
"@context": "http://schema.org",
"@type": "JobPosting",
"description": "Description: ABC Company Inc. seeks a full-time mid-level software engineer to develop in-house tools.",
"jobLocation": {
 "@type": "Place",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Kirkland",
    "addressRegion": "WA"
  }
},
"hiringOrganization": {
  "@type": "Organization",
  "name": "ABC, Inc.",
  "legalName": "Alphabet, Inc."
},
"specialCommitments": "VeteranCommit",
"title": "Software Engineer",
"datePosted": "1/2/15",
"url": "www.abccompanyinc.com/jobs?listing=12345"
},
{
"@context": "http://schema.org",
"@type": "JobPosting",
"baseSalary": "100000",
"benefits": "Medical, Life, Dental",
"description": "ABC Company Inc. seeks a full-time machine shop foreman for its main manufacturing facility. The successful candidate will be in charge of all shop activities.",
"employmentType": "Full-time",
"experienceRequirements": "Minimum 4 years experience as shop foreman. Military shop experience highly desired",
"incentives": "Performance-based annual bonus plan, project-completion bonuses",
"jobLocation": {
  "@type": "Place",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Kirkland",
    "addressRegion": "WA"
  }
},
"hiringOrganization": {
  "@type": "Organization",
  "name": "ABC, Inc.",
  "legalName": "Alphabet, Inc."
},
"qualifications": "Ability to lead a group of 30+ machinists of varying skill levels. Highly motivated. Ability to learn quickly. Ability to settle disputes.",
"responsibilities": "Manage all floor activities. Handle hirings, promotions, and firings.",
"salaryCurrency": "USD",
"specialCommitments": "VeteranCommit",
"title": "Software Engineer",
"workHours": "40+ hours per week",
"datePosted": "1/2/15",
"url": "www.abccompanyinc.com/jobs?listing=23456"
}]</code></pre>
</div>
</div>
</div>
</div>

<div class="action-bar">
  <div class="row">
    <div class="small-12 columns">
      <a class="usa-button-primary" href="https://us.jobs/postajobpartner.asp?partner=ebenefits">Post a Job on the <abbr>NLX</abbr></a>
    </div>
  </div>
</div>
