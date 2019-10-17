# Teochew-Dictionary-Scraper

This script downloads the entries from www.czyzd.com, an online Teochew Dictionary, to be 
used in [Mandarin-To-Teochew-Mapper](https://github.com/paulronla/Mandarin-To-Teochew-Mapper) 
for parsing the Teochew pronunciations for every Chinese character. The dictionary contains 
9149 unique Chinese character entries and can be queried from the database in a variety of ways. 

An example URL is www.czyzd.com/ajax/list?page=0&keyword=&pinyin=&chaoyin=&bushou=&bihua=0. 
This URL will return 10 character entries per page. Because page == 2 is always a duplicate 
of page == 1, there are a total of 915 pages to download (skip page == 2) to get the full 
dictionary. Requests going beyond the end of the dictionary will return -1 and will cause 
the script to end execution.

Each page is returned as HTML without styling. The script submits an HTTP request and then 
writes the text response to the file system in its own [page_number].html, which can be 
read by other programs for further processing. In order to not overload the server, wait 
time of *WAIT_TIME* ms is implemented in between requests

Options are as follows: 

```
node teochew_dict_scraper.js -h

        Usage:
        node teochew_dict_scraper.js --flag=value

        Options:
        --dir            <output directory>
        --start          <start page number>
        --end            <up to but not including this end page number>
        --wait           <wait time in ms>
        --help || -h     <brings up this help>
        --version || -v  <version>
```

Here is an example to download all pages:

```
node teochew_dict_scraper.js -start 0 -end 916
```

## Teochew-Audio-Scraper

This script reuses several methods from ```teochew_dict_scraper.js``` to scrape 
Teochew pronunciation audio files to be used in 
[Teochew-Dictionary-Backend](https://github.com/paulronla/teochew-dictionary-backend). 
The script takes ```chaoyin_audio.json``` 
generated from 
[Mandarin-To-Teochew-Mapper](https://github.com/paulronla/Mandarin-To-Teochew-Mapper), 
which lists all the audio filenames scraped from the website ready for download by 
```teochew_audio_scraper.js```

Options are as follows:

```
node teochew_audio_scraper.js -h

        Usage:
        node teochew_audio_scraper.js --flag=value

        Options:
        --dir            <output directory>
        --start_track    <start audio number>
        --end_track      <up to but not including this end audio number>
        --wait           <wait time in ms>
        --help || -h     <brings up this help>
        --version || -v  <version>
```

## What is Teochew?
[Teochew](https://en.wikipedia.org/wiki/Teochew_dialect) is a dialect of 
Chinese with over 25 million speakers worldwide. Outside of China, it is 
among one of the most spoken Chinese varieties only surpassed by 
Mandarin, Cantonese, and Taiwanese/Hokkien. Phonetically, it has not 
changed very much and many vocabularies from Japanese, Korean, and Vietnamese 
that originated from China centuries ago still sound similar.

For example, consider 肉 which means flesh. \[Niku\] is one of the common 
Japanese readings borrowed from China along with the character. Compare with 
Teochew \[nek8\] \([POJ spelling](https://en.wikipedia.org/wiki/Pe̍h-ōe-jī)\) 
and Mandarin \[rou4\].
