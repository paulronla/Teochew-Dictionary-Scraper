# Teochew-Dictionary-Scraper

This script downloads the entries from www.czyzd.com, an online Teochew Dictionary. The dictionary contains 9149 unique Chinese character entries and can be queried from the database in a variety of ways. 

An example URL is www.czyzd.com/ajax/list?page=0&keyword=&pinyin=&chaoyin=&bushou=&bihua=0. This URL will return 10 character entries per page. Because page == 2 is always a duplicate of page == 1, there are a total of 915 pages to download (skip page == 2) to get the full dictionary. Requests going beyond the end of the dictionary will return -1 and will cause the script to end execution.

Each page is returned as HTML without styling. The script submits an HTTP request and then writes the text response to the file system in its own [page_number].html, which can be read by other programs for further processing. In order to not overload the server, wait time of *WAIT_TIME* ms is implemented in between requests

Options are as follows: 

```
node teochew_dict_scraper.js -h

        Usage:
        node teochew_dict_scraper.js -flag value

        Options:
        -dir            <output directory>
        -start          <start page number>
        -end            <up to but not including this end page number>
        -wait           <wait time in ms>
        -help || -h     <brings up this help>
```

Here is an example to download all pages:

```
node teochew_dict_scraper.js -start 0 -end 916
```
