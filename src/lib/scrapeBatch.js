import { load } from 'cheerio';

const scrapeBatch = (html) => {
    const $ = load(html);
    const batch = $('.download2 .batchlink h4').text();
    
    const download_urls = $('.download2 .batchlink ul li').toString()
        .split('</li>')
        .filter((item) => item.trim() !== '')
        .map((item) => `${item}<li>`)
        .map((urlGroup) => {
            const $ = load(urlGroup);
            const urls = [];
            
            $('a').toString()
                .split('</a>')
                .filter((item) => item.trim() !== '')
                .map((item) => `${item}</a>`)
                .forEach((provider) => {
                    const $ = load(provider);
                    urls.push({
                        provider: $('a').text(),
                        url: $('a').attr('href')
                    });
                });
                
            return {
                resolution: $('li strong').text().replace(/([A-z][A-z][0-9] )/, ''),
                file_size: $('li i').text(),
                urls
            };
        });

    return {
        batch,
        download_urls
    };
};

export default scrapeBatch;
