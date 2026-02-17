import React from 'react';

function AboutThisTool() {
  return (
    <div className="row">
      <div className="center columns about-this-tool">
        <a
          className="vads-u-margin-right--2"
          href="https://www.benefits.va.gov/gibill/comparison_tool/about_this_tool.asp"
          target="_blank"
          rel="noopener noreferrer"
          id="about-this-tool"
        >
          About this tool
        </a>
        <va-link
          id="download-all-data"
          download
          filetype="XLS"
          href="https://www.benefits.va.gov/GIBILL/docs/job_aids/ComparisonToolData.xlsx"
          text="Download data on all schools"
        />
      </div>
    </div>
  );
}

export default AboutThisTool;
