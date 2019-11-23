const axios=require('axios')
const corsUrl="https://api.rss2json.com/v1/api.json?rss_url=";

export const getFeedURL=async (inputURL)=>{

    let feedURL = ''
    // /.netlify/functions/getRSSFeedURL
    const res = await axios.post('https://youthful-villani-c8113a.netlify.com/.netlify/functions/getRSSFeedURL',{url:inputURL})
        feedURL=res.data
    return feedURL;
}
export const getFeedListing=url=>axios.get(`${corsUrl}${url}`)