# Teochew-Dictionary-Scraper

This script downloads the entries from www.czyzd.com, an online Teochew Dictionary. The dictionary contains 9149 unique Chinese character entries and can be queried from the database in a variety of ways. 

An example URL is www.czyzd.com/ajax/list?page=0&keyword=&pinyin=&chaoyin=&bushou=&bihua=0. This URL will return 10 character entries per page. Because page == 2 is always a duplicate of page == 1, there are a total of 915 pages to download (skip page == 2) to get the full dictionary.

Each page is returned as HTML without styling. The script submits an HTTP request and then writes the text response to the file system in its own HTML file, which can be read by other programs for further processing.
