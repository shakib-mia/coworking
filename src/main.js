import Aos from 'aos';
import Lenis from 'lenis'
new Lenis({
  autoRaf: true,
});

Aos.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true,
})


// Get current date and format as YYYY-MM-DD
const today = new Date().toISOString().split('T')[0];
  
// Set the "min" attribute to today's date
document.getElementById('dateInput').setAttribute('min', today);


document.getElementById('virtual-tour').addEventListener('change', function(e) {
    console.log(e.target.checked);
    if(e.target.checked) {
        document.getElementById("iframe").src = "https://www.youtube.com/embed/6BTOHtZkook?si=V2WY_k8IwmcoHL8v";
    } else {
        document.getElementById("iframe").src = "";
    }
})

  const counters = document.querySelectorAll('.counter');

  function formatNumber(num) {
    if (num < 10) return "0" + num;
    return num.toLocaleString();
  }

  function runCounter(counter) {
    let target = +counter.getAttribute('data-target');
    let duration = +counter.getAttribute('data-duration') || 1000;

    let startTime = null;

    const updateCounter = (timestamp) => {
      if (!startTime) startTime = timestamp;

      let progress = timestamp - startTime;
      let percent = Math.min(progress / duration, 1);

      let value = Math.floor(percent * target);
      counter.innerText = formatNumber(value);

      if (percent < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.innerText = formatNumber(target);
      }
    };

    requestAnimationFrame(updateCounter);
  }

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll('.counter');

        counters.forEach(counter => runCounter(counter));

        observer.unobserve(entry.target); // run only once
      }
    });
  }, {
    threshold: 0.4 // 40% visible হলে trigger
  });

  const section = document.querySelector('section');
  observer.observe(section);


const items = document.querySelectorAll(".accordion-item");

items.forEach(item => {
  const header = item.querySelector(".accordion-header");
  const content = item.querySelector(".accordion-content");
  const icon = header.querySelector("span");

  header.addEventListener("click", () => {
    // close all
    items.forEach(i => {
      i.querySelector(".accordion-content").style.maxHeight = null;
      i.querySelector("span").textContent = "+";
    });

    // open current (if not already open)
    if (!content.style.maxHeight) {
      content.style.maxHeight = content.scrollHeight + "px";
          icon.textContent = "−";
    }
  });
});

// Keep the first item open by default
const firstItem = items[0];
if (firstItem) {
  const content = firstItem.querySelector(".accordion-content");
  const icon = firstItem.querySelector("span");
  content.style.maxHeight = content.scrollHeight + "px";
  icon.textContent = "−";
}


document.getElementById("year").textContent = new Date().getFullYear();

// Scroll down functionality
document.getElementById('scroll-down').addEventListener('click', function() {
  window.scrollBy({
    top: window.innerHeight,
    behavior: 'smooth'
  });
});