const links = [
  { name: "Cloudflare", url: "https://www.cloudflare.com/" },
  { name: "Github", url: "https://github.com/" },
  { name: "Google", url: "https://www.google.com/" },
  { name: "Youtube", url: "https://www.youtube.com/" },
  { name: "LinkedIn", url: "https://www.linkedin.com/" }
]

const socialLinks = [
  { url: "https://www.apple.com/", icon: "https://simpleicons.org/icons/applepodcasts.svg" },
  { url: "https://www.microsoft.com/en-us/", icon: "https://simpleicons.org/icons/microsoftonenote.svg" },
  { url: "https://www.raspberrypi.org/", icon: "https://simpleicons.org/icons/raspberrypi.svg" }
]

const retrieveUrl = "https://static-links-page.signalnerve.workers.dev"
const profileImageUrl = "https://www.kindpng.com/picc/m/136-1369892_avatar-people-person-business-user-man-character-avatar.png"

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  let url = new URL(request.url);
  if (url.pathname === "/links") {
    return handleLinkRequest(request);
  }
  return handleOtherRequest(request);
}

async function handleLinkRequest(request) {
  let body = JSON.stringify(links);
  let response = new Response(body);
  response.headers.set("Content-Type", "application/json");
  return response;
}

async function handleOtherRequest(request) {
  const init = {
    headers: {
      "Content-Type": "text/html;charset=UTF-8"
    }
  }
  let rewriter = new HTMLRewriter()
    .on("div#links", new LinksTransformer(links))
    .on("div#profile", new ProfileTranformer())
    .on("img#avatar", new AvartarTransformer())
    .on("h1#name", new NameTransformer())
    .on("div#social", new SocialTransformer())
    .on("title", new TitleTransformer())
    .on("body", new BackgroundTransformer())
  const results = await rewriter.transform(await fetch(retrieveUrl, init)).text()
  let response = new Response(results)
  response.headers.set("Content-Type", "text/html")
  return response
}

class LinksTransformer {
  constructor(links) {
    this.links = links
  }
  element(element) {
    for (let link of links) {
      element.append(`<a href=${link.url}>${link.name}</a>`, { html: true })
    }
  }
}

class ProfileTranformer {
  element(element) {
    element.removeAttribute("style")
  }
}

class AvartarTransformer {
  element(element) {
    element.setAttribute("src", profileImageUrl)
  }
}

class NameTransformer {
  element(element) {
    element.setInnerContent("yyfMichaelYan")
  }
}

class SocialTransformer {
  element(element) {
    element.removeAttribute("style")
    for (let socialLink of socialLinks) {
      element.append(`<a href=${socialLink.url}><img src=${socialLink.icon}></a>`, { html: true })
    }
  }
}

class TitleTransformer {
  element(element) {
    element.setInnerContent("Yifei Yan")
  }
}

class BackgroundTransformer {
  element(element) {
    element.setAttribute("style", "background-color: #A0AEC0")
  }
}