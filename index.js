import fetch from 'node-fetch';
import * as cheerio from "cheerio";

const MAX_DEPTH = 3;

const getUrl = (link) => {
    if(link.includes("http")) { 
        return link;
    } 
};

const crawl = async ({ url }) => {
    console.log("crawling", url);

    const response = await fetch(url)
    const html = await response.text();
    // console.log("html", html);
    const $ = cheerio.load(html)
   
    
    const imageUrls = $("img")
    .map((link) => link.attribs.src)
    .get();

    imageUrls.forEach(imageUrl => {
        fetch(getUrl(imageUrl))
    });

    const results = JSON.stringify(imageUrls)
    console.log(results)
    console.log("images", imageUrls)
};

    crawl({
        url: "http://ynet.com",
    });
    

