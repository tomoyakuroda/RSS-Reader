import React, { useState, useEffect } from "react";
import "./HomePage.css";
import { observer } from "mobx-react";
import { Formik } from "formik";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import * as yup from "yup";
import Layout from "./components/layout";
import { getFeedListing, getFeedURL } from "./requests";

const schema = yup.object({
  url: yup
    .string()
    .required("URL is required")
    .matches(
      /(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\/\w-]*)*\/?\??([^#\n\r]*)?#?([^\n\r]*)/,
      "Invalid URL"
    )
});
function HomePage({ feedsStore }) {
  const [initialized, setInitialized] = useState(false);
  const [message, setMessage] = useState("");
  const storeFeed = evt => {
    let flag = true;
    for (let i = 0; i < feedsStore.feeds.length && flag === true; i++) {
      feedsStore.feeds.forEach(element =>
        element.url === evt.url ? (flag = false) : (flag = true)
      );
    }
    if (!flag) {
      setMessage("The RSS is already registered");
      return;
    }
    feedsStore.feeds.push(evt);
    feedsStore.setFeeds(feedsStore.feeds);
    localStorage.setItem("feeds", JSON.stringify(feedsStore.feeds));
    setMessage("The RSS is successfully registered");
  };
  const handleSubmit = async evt => {
    setMessage("");
    const isValid = await schema.validate(evt);
    if (!isValid) {
      return;
    }
    try {
      const response = await getFeedListing(evt.url);
      evt.name = response.data.feed.title;

      storeFeed(evt);
      
    } catch (err) {
      try {
        const URL = await getFeedURL(evt.url);
        const response = await getFeedListing(URL);
        evt.name = response.data.feed.title;
        evt.url = URL;
        storeFeed(evt);
      } catch (error) {
        setMessage("Fail to get the RSS feeds");
        return;
      }
    }
  };

const clearMessage = ()=>{
  setMessage('')
}

  const setSelectedFeed = url => {
    feedsStore.setSelectedFeed(url);
    // setRedirectToFeed(true);
  };
  const deleteFeed = index => {
    feedsStore.feeds.splice(index, 1);
    feedsStore.setFeeds(feedsStore.feeds);
    localStorage.setItem("feeds", JSON.stringify(feedsStore.feeds));
  };
  useEffect(() => {
    if (!initialized) {
      let rssFeeds = [];
      try {
        rssFeeds = JSON.parse(localStorage.getItem("feeds"));
        if (Array.isArray(rssFeeds)) {
          feedsStore.setFeeds(rssFeeds);
        }
      } catch (ex) {}
      setInitialized(true);
    }
  });

  return (
    <Layout feedsStore={feedsStore}>
      <div className="home-page vertical-center">
        <h1 className="center">RSS Reader</h1>
        <h2 className="center">
          Enter your favorite website and get the feeds!
        </h2>
        <Formik validationSchema={schema} onSubmit={handleSubmit} onChange={clearMessage}>
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            isInvalid,
            errors
          }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Row>
                <Form.Group as={Col} md="12" controlId="url">
                  {/* <Form.Label>URL</Form.Label> */}
                  <Form.Control
                    type="text"
                    name="url"
                    placeholder="https://blog.mozilla.org/press"
                    value={values.url || ""}
                    onChange={handleChange}
                    isInvalid={(touched.url && errors.url) || message}
                    required
                  />
                  <Form.Control.Feedback type="invalid" className='error-message'>
                    <h6>
                      {errors.url} {message}
                    </h6>
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
              <Button type="submit">Add</Button>
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  );
}
export default observer(HomePage);
