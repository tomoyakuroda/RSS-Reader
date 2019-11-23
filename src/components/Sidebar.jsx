import React, {useEffect} from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import { Link, withRouter, Redirect } from 'react-router-dom'
import { observer , } from "mobx-react";

function Sidebar({ location, feedsStore }) {
useEffect(()=>{
    let rssFeeds = [];
    try {
        rssFeeds = JSON.parse(localStorage.getItem("feeds"));
        if (Array.isArray(rssFeeds)) {
          feedsStore.setFeeds(rssFeeds);
        }
      } catch (ex) {}
},[])
    const setSelectedFeed = url => {
        feedsStore.setSelectedFeed(url);
        console.log('feedsStore.feed',feedsStore.feed)
        // setRedirectToFeed(true);
        return (
        <Redirect to={`/feed?url=${url}`}  />
        )
      };
    return (
        <ListGroup>
            <ListGroup.Item>
                <Link to='/' active={location.pathname === '/'}>
                    Home
                    </Link>
            </ListGroup.Item>
            {feedsStore.feeds.map((feed, index)=>{
                return (
            <ListGroup.Item key={index}>
                
            <Link to={`feed?url=${feed.url}`} active={location.pathname === `feed?url=${feed.url}`} onClick={()=>setSelectedFeed(feed.url)}>
              {/* <button onClick={()=>setSelectedFeed(feed.url)}>  */}
               {feed.name}
               {/* </button> */}
                </Link>
        </ListGroup.Item>
                )
            })}
        </ListGroup>
    )
}

export default withRouter(observer(Sidebar))