// import * as fetch from "node-fetch";
import fetch from 'node-fetch';
import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from 'path';
import * as urlParser from 'url';
import { filter } from 'cheerio/lib/api/traversing';


const seenUrls={};

const getUrl = (link) => {
    if(link.includes("http")) { // if its a relative link
        return link;
    } else if (link.startsWith("/")) {
        return 'http://localhost:5500${link}';
    } else {
        return 'http://localhost:5500/${link}'; //if its fixed
    }
};

const crawl = async ({ url }) => {
    if(seenUrls[url]) return;
    console.log("crawling", url);
    seenUrls[url] = true;

    const response = await fetch(url)
    const html = await response.text();
    console.log("html", html);
    const $ = cheerio.load(html)
    const links = $("a")
    .map((i, link) => link.attribs.href) // get all the a tags that includes links
    .get();

    const imageUrls = $("img")
    .map((i, link) => link.attribs.src)
    .get();

    imageUrls.forEach(imageUrl => {
        fetch(getUrl(imageUrl)).then(response => {
            const fileName = path.basename(imageUrl);
            const dest = fs.createWriteStream('images/${fileName}'); //every image we will find will override this one
            response.body.pipe(dest);
        });
    });

    const { host } = urlParser.parse(url);

    console.log("images", imageUrls)
    links
    .filter((link) => link.includes(host))  //show only the link that includes the url that is provided- don't go to external links
    .forEach((link) => {
        crawl({
            url: getUrl(link),
        });
    });
};

    crawl({
        url: "http://localhost:5500",
    })
    

crawl({
    url: "http://localhost:5500",
});
