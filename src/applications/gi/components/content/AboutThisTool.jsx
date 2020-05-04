import React from 'react';

function AboutThisTool() {
  return (
    <div className="row">
      <div className="center columns about-this-tool">
        <a
          href="https://www.benefits.va.gov/gibill/comparison_tool/about_this_tool.asp"
          target="_blank"
          rel="noopener noreferrer"
        >
          About this Tool
        </a>

        <a
          className="about-this-tool-mobile"
          href="https://www.benefits.va.gov/GIBILL/docs/job_aids/ComparisonToolData.xlsx"
        >
          Download Data on All Schools (Excel)
        </a>
      </div>
    </div>
  );
}

export default AboutThisTool;
