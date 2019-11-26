import React, { useState, useEffect } from "react";
import "./HomePage.css";
import { observer } from "mobx-react";
import { Formik } from "formik";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import * as yup from "yup";
import { Redirect, Link } from "react-router-dom";
import Layout from "./components/layout";
import { getFeedListing, getFeedURL } from "./requests";

const querystring = require("querystring");
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
  const [redirectToFeed, setRedirectToFeed] = useState(false);


  const handleSubmit = async evt => {
    const isValid = await schema.validate(evt);
    if (!isValid) {
      return;
    }
    try {
      const feedURL = await getFeedURL(evt.url)
      const response = await getFeedListing(feedURL);
      evt.name = response.data.feed.title;
      evt.url=feedURL
      feedsStore.feeds.push(evt);
      feedsStore.setFeeds(feedsStore.feeds);
      localStorage.setItem("feeds", JSON.stringify(feedsStore.feeds));
      evt.url=''
    } catch (err) {
      alert("Fail to get the Rss feeds");
    }
  };
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
  if (redirectToFeed) {
    return (
      <Redirect to={`/feed?${querystring.encode({ url: feedsStore.feed })}`} />
    );
  }
  return (
    <Layout feedsStore={feedsStore}>
      <div className="home-page vertical-center">
        <h1 className="center">RSS Reader</h1>
        <h2 className="center">
          Enter your favorite website and get the feeds!
        </h2>
        <Formik validationSchema={schema} onSubmit={handleSubmit}>
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
                    isInvalid={touched.url && errors.url}
                  />{" "}
                  <Form.Control.Feedback type="invalid">
                    {errors.url}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
              <Button type="submit">Add</Button>
            </Form>
          )}
        </Formik>
        <br />
        {/* {feedsStore.feeds.map((f, i) => {
          return (
            <Card key={i}>
              <Card.Title className="card-title">{f.name}</Card.Title>
              <Card.Body>
                <p>{f.url}</p>
                <Link to={`feed?url=${f.url}`}>
                <Button
                  variant="primary"
                  onClick={setSelectedFeed.bind(this, f.url)}
                >
                  Open
                </Button>{" "}
                </Link>

                <Button variant="primary" onClick={deleteFeed.bind(this, i)}>
                  Delete
                </Button>
              </Card.Body>
            </Card>
          );
        })} */}
      </div>
    </Layout>
  );
}
export default observer(HomePage);
