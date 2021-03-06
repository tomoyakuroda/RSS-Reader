import React, { useState, useEffect } from "react";
import "./FeedPage.css";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import * as yup from "yup";
import { getFeedListing } from "./requests";
import Layout from "./components/layout";
const querystring = require("querystring");
function FeedPage({ feedsStore, location }) {
  const [listings, setListings] = useState([]);
  const [data, setData] = useState({});
  const [currentFeedURL, setCurrentFeedURL]=useState('')
  const getListings = async url => {
    try {
      const response = await getFeedListing(url);
      setListings(response.data.items);
      setData(response.data.feed);
    } catch (ex) {
      console.log(ex);
    }
  };
  const openLink = url => {
    window.location.href = url;
  };

  const deleteFeed = item => {
    // feedsStore.feeds.splice(
    //   feedsStore.feeds.findIndex(element => element === item),1
    // );
    let newFeeds=    feedsStore.feeds.filter(element=>element.url!==item)

    feedsStore.setFeeds(newFeeds);
    localStorage.setItem("feeds", JSON.stringify(feedsStore.feeds));
  };

  useEffect(() => {
    if (querystring.decode(location.search)["?url"]) {
      const url = querystring.decode(location.search)["?url"];
      getListings(url);
      setCurrentFeedURL(url)
      // feedsStore.setFeeds()
    }
  }, [feedsStore.feed]);
  return (
    <Layout feedsStore={feedsStore}>
      <div className="feed-page">
        <h1 className="center title">
          {data.image ? <img src={data.image} height='50px' width='50px' /> : null}
           {data.title}{" "}
          <Button variant="danger" onClick={() => deleteFeed(currentFeedURL)}>
            Delete
          </Button>
        </h1>

        {listings.map((l, i) => {
          return (
            <Card key={i}>
              <Card.Title className="card-title">
                {l.title} <small>{l.pubDate}</small>
              </Card.Title>
              <Card.Body>
                {l.description.replace(/(<([^>]+)>)/gi, "")}
                <Button
                  variant="light"
                  href={l.link}
                  size="sm"
                  target="_blank" rel="noopener noreferrer"
                >
                  Read more
                </Button>
              </Card.Body>
            </Card>
          );
        })}
      </div>
    </Layout>
  );
}
export default withRouter(observer(FeedPage));
