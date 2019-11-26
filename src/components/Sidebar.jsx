import React, { useEffect } from "react";
import Image from "react-bootstrap/Image";
import { Link, withRouter, Redirect } from "react-router-dom";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MailIcon from "@material-ui/icons/Mail";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
// Be sure to include styles at some point, probably during your bootstraping
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import logo from "../assets/logo.png";
function Sidebar({ location, feedsStore }) {
  const drawerWidth = 240;

  const useStyles = makeStyles(theme => ({
    root: {
      display: "flex"
    },
    drawer: {
      [theme.breakpoints.up("sm")]: {
        width: drawerWidth,
        flexShrink: 0
      }
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        display: "none"
      }
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3)
    }
  }));

  //   const { container } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      {/* <div className={classes.toolbar} /> */}
      <Link to="/"  style={{ textDecoration: 'none', color:'initial' }}>

      <Image src={logo} fluid /> 
      </Link>

      <Divider />
      <List>
        <Link to="/" style={{ textDecoration: 'none', color:'initial' }}>
          <ListItem button>
            <ListItemText primary="Home" />
          </ListItem>
        </Link>

        {feedsStore.feeds.map((feed, index) => {
          return (
            <Link
              key={feed.name}
              to={`feed?url=${feed.url}`}
              active={location.pathname === `feed?url=${feed.url}`}
              onClick={() => setSelectedFeed(feed.url)}
              style={{ textDecoration: 'none', color:'initial' }}
            >
              <ListItem button>
                <ListItemText primary={feed.name} />
              </ListItem>
            </Link>
          );
        })}
      </List>
      {/* <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List> */}
    </div>
  );

  useEffect(() => {
    let rssFeeds = [];
    try {
      rssFeeds = JSON.parse(localStorage.getItem("feeds"));
      if (Array.isArray(rssFeeds)) {
        feedsStore.setFeeds(rssFeeds);
      }
    } catch (ex) {}
  }, []);
  const setSelectedFeed = url => {
    feedsStore.setSelectedFeed(url);
    console.log("feedsStore.feed", feedsStore.feed);
    // setRedirectToFeed(true);
    return <Redirect to={`/feed?url=${url}`} />;
  };
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            // container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
}

export default withRouter(observer(Sidebar));
