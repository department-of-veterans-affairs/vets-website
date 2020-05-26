import React from 'react';

export default function OffState() {
  return (
    <div itemScope="" itemType="http://schema.org/Question">
      <h2 itemProp="name" id="how-do-i-apply-for-this-progra">
        How do I apply for this program?
      </h2>
      <div
        itemProp="acceptedAnswer"
        itemScope=""
        itemType="http://schema.org/Answer"
      >
        <div itemProp="text">
          <div className="processed-content">
            <p>
              You and the Veteran will need to apply together and participate in
              an application process&nbsp;to determine if you’re eligible for
              the program.
            </p>

            <p>
              To apply, fill out a joint Application for the Program of
              Comprehensive Assistance for Family Caregivers (VA Form 10-10CG).
              You’ll need information such as contact information for you and
              the Veteran as well as the name of the VA medical center where the
              Veteran will be receiving care. And you’ll both need to sign and
              date the form.
              <br />
              <br />
              <a href="https://www.va.gov/vaforms/medical/pdf/10-10CG.pdf">
                Download VA Form 10-10CG (PDF)
              </a>
              <br />
              <br />
              <strong>Note</strong>: Each time the Veteran wants to add a new
              family caregiver, the Veteran and the new caregiver will need to
              submit a new application.&nbsp;Remember, there can only be 1
              Primary and up to 2 Secondary Family Caregivers designated at any
              one time.
              <br />
              <br />
              Mail the form and any supporting documents to:
            </p>

            <p className="va-address-block">
              Program of Comprehensive Assistance for Family Caregivers
              <br />
              Health Eligibility Center
              <br />
              2957 Clairmont Road NE, Suite 200
              <br />
              Atlanta, GA 30329-1647
            </p>

            <p>
              Or apply in person by bringing the application to your local VA
              medical center’s Caregiver Support Coordinator. To find the name
              of your local coordinator, you can:
            </p>

            <ul>
              <li>
                <a href="https://www.caregiver.va.gov/support/New_CSC_Page.asp">
                  Go to the VA Caregiver Support Coordinator directory
                </a>
                ,&nbsp;
                <strong>or</strong>
              </li>
              <li>
                Contact the Caregiver Support Line at{' '}
                <a href="tel:+18552603274">855-260-3274</a>
              </li>
            </ul>
            <p>
              If you need help filling out the form, you can contact your local
              coordinator, or call our main VA information line at{' '}
              <a href="tel:+18772228387">877-222-8387</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
