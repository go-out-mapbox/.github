'use strict'

async function indexJSON() {
  const requestURL = 'index.json';
  const request = new Request(requestURL);
  const response = await fetch(request);
  const indexJSON = await response.text();

  const index = JSON.parse(indexJSON);
  indexHead(index);
  indexMenu(index);
}

function indexHead(obj) {
  const head = document.querySelector('head');
  const indexTitle = document.createElement('title');
  const ogTitle = document.createElement('meta');
  const twittetTitle = document.createElement('meta');
  indexTitle.textContent = obj['title'];
  ogTitle.setAttribute("property", "og:title");
  ogTitle.setAttribute("content", obj['title']);
  twittetTitle.setAttribute("name", "twitter:title");
  twittetTitle.setAttribute("content", obj['title']);
  head.appendChild(indexTitle);
  head.appendChild(ogTitle);
  head.appendChild(twittetTitle);

  const indexDescription = document.createElement('meta');
  const ogDescription = document.createElement('meta');
  const twitterDescription = document.createElement('meta');
  indexDescription.setAttribute("name", "description");
  indexDescription.setAttribute("content", obj['description']);
  ogDescription.setAttribute("property", "og:description");
  ogDescription.setAttribute("content", obj['description']);
  twitterDescription.setAttribute("name", "twitter:description");
  twitterDescription.setAttribute("content", obj['description']);
  head.appendChild(indexDescription);
  head.appendChild(ogDescription);
  head.appendChild(twitterDescription);

  const indexAuthor = document.createElement( "meta" );
  indexAuthor.setAttribute("name", "author");
  indexAuthor.setAttribute("content", obj['author']);
  head.appendChild(indexAuthor);

  const indexEmail = document.createElement( "meta" );
  indexEmail.setAttribute("name", "reply-to");
  indexEmail.setAttribute("content", obj['email']);
  head.appendChild(indexEmail);

  const ogType = document.createElement( "meta" );
  ogType.setAttribute("property", "og:type");
  ogType.setAttribute("content", obj['type']);
  head.appendChild(ogType);

  const twitter = document.createElement( "meta" );
  const twitterCard = document.createElement( "meta" );
  twitter.setAttribute("name", "twitter:site");
  twitter.setAttribute("content", obj['twitter']);
  twitterCard.setAttribute("name", "twitter:card");
  twitterCard.setAttribute("content", obj['card']);
  head.appendChild(twitter);
  head.appendChild(twitterCard);

  const ogIMG = document.createElement( "meta" );
  const twitterIMG = document.createElement( "meta" );
  ogIMG.setAttribute("property", "og:image");
  twitterIMG.setAttribute("name", "twitter:image");
  ogIMG.setAttribute("content", obj['src']);
  twitterIMG.setAttribute("content", obj['src']);
  head.appendChild(ogIMG);
  head.appendChild(twitterIMG);

  const ogSite = document.createElement( "meta" );
  ogSite.setAttribute("property", "og:site_name");
  ogSite.setAttribute("content", location.hostname);
  head.appendChild(ogSite);

  const ogURL = document.createElement( "meta" );
  ogURL.setAttribute("property", "og:url");
  ogURL.setAttribute("content", location.href);
  head.appendChild(ogURL);
}

function indexMenu(obj) {
  const menu = document.querySelector('#menu');
  const menuLinks = obj.contents;

  for (const link of menuLinks) {
    const linkA = document.createElement('a');
    const linkB = document.createElement('b');
    const linkSmall = document.createElement('small');

    linkA.href = link.url;
    linkA.classList.add(link.type);
    linkB.innerHTML = link.title;
    linkSmall.innerHTML = link.date;

    menu.appendChild(linkA);
    linkA.appendChild(linkB);
    linkA.appendChild(linkSmall);
  }
}

indexJSON();
