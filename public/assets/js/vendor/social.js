function facebook(url, title, desc, img) {
window.open( "http://www.facebook.com/sharer.php?s=100&p[title]="+encodeURI(title)+"&p[summary]=" +desc+ "&p[url]="+encodeURI(url)+"&p[images][0]="+encodeURI(img), "facebook", "status=1, height=400, width=550, resizable=0, toolbar=0");
facebook.focus();
}

function linkedIn(url, title, desc, source) {
window.open( "http://www.linkedin.com/shareArticle?mini=true&url=" + encodeURI(url) +"&title=" + encodeURI(title) + "&summary=" + encodeURI(desc) + "&source=" + encodeURI(source), "linkedIn", "status=1, height=400, width=550, resizable=0, toolbar=0");
linkedIn.focus();
}

function tweet(url, text) {
window.open( "https://twitter.com/intent/tweet?text=" + encodeURI(text) + "&url=" + encodeURI(url), "tweet", "status=1, height=400, width=550, resizable=0, toolbar=0");
tweet.focus();
}

function plusone(url) {
window.open( "https://plusone.google.com/_/+1/confirm?hl=en&url=" + encodeURI(url), "plusone", "status=1, height=400, width=550, resizable=0, toolbar=0");
plusone.focus();
}