const essay = document.querySelector('#essay section')
async function index(url) {
  event.preventDefault();
  fetch(url)
  .then(response => response.text())
  .then(innerHTML => {
    essay.innerHTML = innerHTML
  })
  smoothTo()
}
index("with/about.html")

function smoothTo() {
  const targetOffsetTop = window.pageYOffset + essay.getBoundingClientRect().top
  window.scrollTo({
    top: targetOffsetTop,
    behavior: "smooth"
  });
}
