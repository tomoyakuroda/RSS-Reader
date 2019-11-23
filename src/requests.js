const axios=require('axios')
const corsUrl="https://api.rss2json.com/v1/api.json?rss_url=";

export const getFeedURL=async (inputURL)=>{

    let feedURL = ''
    const res = await axios.post('/.netlify/functions/getRSSFeedURL',{url:inputURL})
        feedURL=res.data
        console.log('feedURL')
        console.log(feedURL)
    return feedURL;


    // console.log('url',url)
    // let feedURL = ''
    // axios.post('/.netlify/functions/getRSSFeedURL',{url:url})
    // .then(res =>  {
    //     console.log('res')
    //     console.log(res)
    //     console.log('res.data')
    //     console.log(res.data)
    //     feedURL=res.data
    //     res.json()})
    // .then(response=> {
    //     console.log('response')
    //     console.log(response)})
    // .catch(err => err)
    // return feedURL;
}
export const getFeedListing=url=>axios.get(`${corsUrl}${url}`)