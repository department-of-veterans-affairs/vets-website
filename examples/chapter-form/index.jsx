import React from 'react';
import { Outlet, Route } from 'react-router-dom'
import FormRouter from '../../src/routing/Router';
import Chapter from '../../src/routing/Chapter';
import Page from '../../src/routing/Page';
import IntroductionPage from '../../src/form-layout/IntroductionPage'
import { Link } from 'react-router-dom';

const NoMatch = (props) => (
  <main style={{ padding: '1rem' }}>
    <p>There is nothing here! {props.name}</p>
  </main>
);

const FormIntroductionPageChapter = (props) => {
  return (
    <>
      <Page {...props} nextPage="/chapter-one">
        <p> Chapter Form </p>
      </Page>
    </>
  )
}

const ChapterOne = (props) => (
  <>
    <Chapter {...props}>
      <p>
        Custom UI content that can go inside chapter 1: 
        <Link to="/chapter-one/page-one">PageOne</Link>
      </p>
    </Chapter>
  </>
);

const ChapterOnePageOne = (props) => (
  <Page {...props} nextPage="/chapter-one/page-two">
    <p>chapter one, page one</p>
  </Page>
);

const ChapterOnePageTwo = (props) => (
  <Page {...props} nextPage="/chapter-two">
    <p>chapter one, page two</p>
  </Page>
);

const ChapterTwo = (props) => (
  <Chapter {...props}>
    <p>Custom UI content that can go inside chapter 2: <Link to="/chapter-two/page-one">PageOne</Link></p>
  </Chapter>
);

const ChapterTwoPageOne = (props) => (
  <Page {...props} nextPage="/chapter-two/page-two">
    <p>chapter two, page one</p>
  </Page>
)

const ChapterTwoPageTwo = (props) => (
  <Page {...props} nextPage="/">
    <p>chapter two, page two</p>
  </Page>
)

const ChapterForm = (props) => {
  // Let users extract and use formData here
  // initialValues would ideally be provided by a json-schema
  return (
    <div className='vads-u-display--flex vads-u-align-items--center vads-u-flex-direction--column'>
      <FormRouter basename={props.basename} formData={props.initialValues} title="Chapter Example">
        <Route index element={<FormIntroductionPageChapter title="Chapter Form Introduction Page" />} />
        <Route path="/chapter-one" element={<ChapterOne title="Chapter One" />} >
          <Route path="page-one" element={<ChapterOnePageOne title="Chapter One Page One" />} />
          <Route path="page-two" element={<ChapterOnePageTwo title="Chapter One Page Two" />} />
        </Route>
        <Route path="/chapter-two" element={<ChapterTwo title="Chapter Two" />} >
          <Route path="page-one" element={<ChapterTwoPageOne title="Chapter Two Page One" />} />
          <Route path="page-two" element={<ChapterTwoPageTwo title="Chapter Two Page Two" />} />
        </Route>
      </FormRouter>
    </div>
  )
}

export default ChapterForm;