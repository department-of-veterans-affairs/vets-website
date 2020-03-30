import React from 'react';

export default function SearchResult({ form }) {
  return (
    <div className="vads-u-padding--1 vads-u-border-top--1px vads-u-border-color--gray-lighter">
      <dt className="vads-l-row">
        <dfn className="vads-u-display--block medium-screen:vads-l-col--2">{form.id}</dfn> <div className="medium-screen:vads-l-col--10">{form.attributes.title}</div>
      </dt>

      <dd className="vads-l-row medium-screen:vads-u-justify-content--flex-end">
        <div className="medium-screen:vads-l-col--10">
          <dfn>Revision date:</dfn> {form.attributes.lastRevisionOn}
        </div>
      </dd>

      <dd className="vads-l-row medium-screen:vads-u-justify-content--flex-end">
        <div className="medium-screen:vads-l-col--10">
          Download VA form {form.id} (PDF)
        </div>
      </dd>
    </div>
  )
}
