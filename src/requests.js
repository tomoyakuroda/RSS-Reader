const axios=require('axios')
const corsUrl="https://api.rss2json.com/v1/api.json?rss_url=";

export const getFeedURL=async (inputURL)=>{

    let feedURL = ''
    const res = await axios.post('/.netlify/functions/getRSSFeedURL',{url:inputURL})
        feedURL=res.data
    return feedURL;
}
export const getFeedListing=url=>axios.get(`${corsUrl}${url}`)