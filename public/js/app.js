const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links a');
const hamburger = document.querySelector('.hamburger');
const cssMoon = document.querySelector('#css-moon');
const content = document.querySelector('#home .content');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  if (cssMoon) {
    if (cssMoon.classList.contains('z-index')) {
      setTimeout(() => {
        cssMoon.classList.remove('z-index');
        content.classList.remove('z-index');
      }, 500);
    } else {
      cssMoon.classList.add('z-index');
      content.classList.add('z-index');
    }
  }
  links.forEach(link => {
    link.classList.toggle('fade');
  });
  hamburger.classList.toggle('toggle');
});
