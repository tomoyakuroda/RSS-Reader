// 'use strict';

const cheerio = require('cheerio');
const request = require('request');

export function handler(event, context, callback) {
    const data = JSON.parse(event.body)
    const baseURL=data.url
  // grab the parameters from the request
//   const { size, user } = event.queryStringParameters;

  // transform the size parameter into the image URL pattern needed in the request
//   const option = {
//     "small" : "_normal",
//     "large" : "_400x400"
//   };

  // Report back to our logs
//   console.log(`Fetch avatar URL for ${user} with these size parameters of ${option[size]}`);

  // Make the request to twitter and parse the response
  request(baseURL , function(err, response, body){
    if(!err && response.statusCode === 200){
      const $ = cheerio.load(body);
    //   const avatar = ($('.avatar img').attr('src') || '').replace('_normal', option[size]);
    // var feedUrl = dom.window.document.querySelector('link[type="application/rss+xml"]').href
    var feedUrl = $('link[type="application/rss+xml"]').attr('href')
      return callback(null, {
          statusCode: 200,
          headers: {"Content-Type": "text/plain"},
          body: feedUrl
        })
      } else {
        return callback(null, {
          statusCode: 404,
          body: err
        })
      }
    })
}



// // var fetch = require('node-fetch')
// const rp = require('request-promise')
// const jsdom = require("jsdom");
// // const cheerio = require('cheerio')
// const { JSDOM } = jsdom;

// exports.handler=async(event,context,callback)=>{
//  //   try{
//     // const data = JSON.parse(event.body)
//     const baseURL='https://www.gamespark.jp/'

// const data = rp(baseURL).then(function(htmlString){
//     const dom = new JSDOM(htmlString);
//     const result= dom.window.document.querySelector('link[type="application/rss+xml"]').href; 
// return{
//     result:result
// }
// })

//     // const res=await fetch(baseURL)
//     // const htmlTxt = await res.text()

//     // const dom = new JSDOM(htmlTxt);
//     // const result= dom.window.document.querySelector('link[type="application/rss+xml"]').href; 

//     // const res=await fetch(baseURL)
//     // const htmlTxt = await res.text()
//     // // // var domParser = new DOMParser()
//     // // let doc = parser.parseFromString(htmlTxt, 'text/html')
//     // // var feedUrl = doc.getElementsByTagName('link[type="application/rss+xml"]')
//     // //const dom = new jsdom.JSDOM(htmlTxt)
//     // const $ = cheerio.load(htmlTxt);
//     // // var feedUrl = dom.window.document.querySelector('link[type="application/rss+xml"]').href
//     // var feedUrl = $('link[type="application/rss+xml"]').attr('href')

//     // const jobs = await res.json()

//     // return {
//     //     statusCode: 200,
//     //   body: feedUrl,
//     // }
//     // }catch(error){
//     //     return {
//     //     statusCode: 500,
//     //     body: JSON.stringify({error:error})
//     //     }
//     // }
//     // callback(null,{
//     //     statusCode:200,
//     //     body:JSON.stringify(data)
//     // })
//     return data
// }