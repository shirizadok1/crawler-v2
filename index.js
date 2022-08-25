import fetch from 'node-fetch';
import * as cheerio from "cheerio";
import * as urlParser from 'url';


const getUrl = (link) => {
    if(link.includes("http")) { // if its a relative link
        return link;
    } 
};

const crawl = async ({ url }) => {
    console.log("crawling", url);

    const response = await fetch(url)
    const html = await response.text();
    console.log("html", html);
    const $ = cheerio.load(html)
   

    const imageUrls = $("img")
    .map((i, link) => link.attribs.src)
    .get();

    imageUrls.forEach(imageUrl => {
        fetch(getUrl(imageUrl))
    });

    const results = JSON.stringify(imageUrls)
    console.log("images", imageUrls)
};

    crawl({
        url: "http://localhost:5500",
    });
    

