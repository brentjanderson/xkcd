#xkcd comic viewer
A simple NodeJS + Express based app for extracting comics from xkcd.com. Planning on building it out for my own nefarious purposes like an xkcd forum or app or something. In the mean time, it is what it is and it was fun to put together thus far.

Note that it still has a lot of ExpressJS boilerplate hanging out in it. Definitely not optimized and needs refactoring, esp. when it comes to the xkcd extractor. But, it works, and it works well.

#Install
Git clone the repository and from the command line...

    npm install
    node app

On first run, the app will go to xkcd.com, fetch the latest comic, and then iterate backwards to the first comic to generate the cache of comics located in `comics.json`. Subsequent runs (and also every 3 days), the app will refresh this cache by fetching the latest comic and walking backwards until it reaches a comic we already know about.

#License (Plain Language)
MIT License in a nutshell: Do whatever you like with this software, but you can't sue me and I make no promises.

#License (The real one)
Please see LICENSE for the legally binding license for this software.