const axios=require('axios')
const corsUrl="https://api.rss2json.com/v1/api.json?rss_url=";

export const getFeedURL=async (inputURL)=>{

    let feedURL = ''
    let requestURL= process.env.REACT_APP_MODE === 'local' ? "http://localhost:9000/getRSSFeedURL" : '/.netlify/functions/getRSSFeedURL'
    const res = await axios.post(requestURL,{url:inputURL})
        feedURL=res.data
    return feedURL;
}
export const getFeedListing=url=>axios.get(`${corsUrl}${url}`)