import React from 'react';
import { fileTypes, maxSize } from '../../config/attachments';

export const mailOrFaxLaterMsg =
  'If you don’t have a copy to upload now, you can send one by mail or fax.';

const marriagePapers = [
  'Marriage certificate',
  'Civil union papers',
  'Affidavit of common law marriage',
];

export const acceptableFiles = {
  casualtyCert: ['Casualty report', 'Death certificate'],
  dischargeCert: ['DD214'],
  disabilityCert: ['VBA rating decision'],
  birthCert: ['Birth certificate', 'Social Security card'],
  schoolCert: [
    {
      text: 'School enrollment certification form',
      bullets: [
        {
          text: 'Download school enrollment certification form',
          href:
            'https://www.va.gov/COMMUNITYCARE/docs/pubfiles/forms/School-Enrollment.pdf',
        },
      ],
    },
    {
      text: 'Enrollment letter',
      bullets: [
        'Student’s full name and the last four digits of their Social Security Number.',
        'Exact beginning and end dates of each semester or enrollment term',
        'Projected graduation date',
        'Signature and title of a school official',
        'Acceptance letter from the school if not enrolled yet',
      ],
    },
  ],
  spouseCert: marriagePapers,
  divorceCert: ['Divorce decree', 'Annulment decree'],
  stepCert: marriagePapers,
  adoptionCert: ['Court ordered adoption papers'],
  helplessCert: ['VBA decision rating certificate of award'],
  medicareABCert: [
    'Front of Medicare Parts A or B card',
    'Back of Medicare Parts A or B card',
  ],
  medicareDCert: [
    'Front of Medicare Part D card',
    'Back of Medicare Part D card',
  ],
  ssIneligible: ['Letter from the SSA'],
  healthInsCert: [
    'Front of health insurance card(s)',
    'Back of health insurance card(s)',
  ],
  va7959cCert: [
    {
      href: 'https://www.va.gov/find-forms/about-form-10-7959c/',
      text: 'VA form 10-7959c',
    },
  ],
};

export const blankSchema = { type: 'object', properties: {} };

function makeLink(el) {
  return <va-link href={el.href} text={el.text} />;
}

function makeUl(points) {
  // A point may be an object, or just a string
  return (
    <ul key={points}>
      {points.map(point => {
        return (
          <li key={point}>
            {point.href ? makeLink(point) : point.text || point}
          </li>
        );
      })}
    </ul>
  );
}

export function acceptableFileList(list) {
  if (list.length === 0) return <></>;
  const parseItem = (item, idx) => {
    // If we have nested items (we allow one layer deep nesting)
    // then make a <ul> to nest
    let subList;
    if (item.bullets) {
      subList = makeUl(item.bullets);
    }
    return (
      <li key={`${item}-${idx}`}>
        {item.href ? makeLink(item) : item.text || item}
        {subList}
      </li>
    );
  };

  return {
    'view:acceptableFilesList': {
      'ui:description': (
        <>
          <p>
            <b>Acceptable files include:</b>
          </p>
          <ul>{list.map((item, index) => parseItem(item, index))}</ul>
        </>
      ),
    },
  };
}

export const fileUploadBlurb = {
  'view:fileUploadBlurb': {
    'ui:description': (
      <>
        <div className="vads-u-margin-bottom--4">
          <b>How to upload files</b>
          <ul>
            <li>
              Use a .{fileTypes.slice(0, -1).join(', .')}, or .
              {fileTypes.slice(-1)} file format
            </li>
            <li>Make sure that file size is {maxSize} or less.</li>
            <li>
              If you only have a paper copy, scan or take a photo and upload the
              image.
            </li>
          </ul>
        </div>
      </>
    ),
  },
};

export const requiredFileUploadMessage = {
  'ui:description': (
    <p>
      <i>This file is required for your application.</i>
      Your application will not be considered complete until we receive this
      file.
    </p>
  ),
};

export const optionalFileUploadMessage = {
  'ui:description': (
    <p>
      This file is not required for your application, but
      <b>
        {' '}
        not uploading this optional file will delay your application’s
        processing time.
      </b>
    </p>
  ),
};

/**
 * Builds a document upload page uiSchema and Schema.
 * @param {list of strings} fileList E.g., ['Birth certificate', 'Social security card']
 * @param {string} category E.g., 'school certificate'
 * @param {boolean} isOptional Whether or not this file upload is optional
 * @param {list of objects} resources E.g., [{href: "google.com", text: "Google"}]
 * @returns
 */
export function uploadWithInfoComponent(
  fileList,
  category,
  isOptional,
  resources,
) {
  return {
    uiSchema: {
      ...acceptableFileList(fileList || []),
      'view:additionalResources': {
        'ui:description': (
          <>
            {resources ? (
              <>
                <p>
                  <b>Resources regarding {category}</b>
                </p>
                <ul>
                  {resources.map((resource, index) => (
                    <li key={`link-${resource}-${index}`}>
                      {makeLink(resource)}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              ''
            )}
          </>
        ),
      },
      // 'view:fileUploadMessage': isOptional
      //   ? { ...optionalFileUploadMessage }
      //   : { ...requiredFileUploadMessage },
      ...fileUploadBlurb,
    },
    schema: {
      'view:acceptableFilesList': blankSchema,
      'view:additionalResources': blankSchema,
      // 'view:fileUploadMessage': blankSchema,
      'view:fileUploadBlurb': blankSchema,
    },
  };
}
