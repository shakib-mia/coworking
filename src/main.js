// MAIN JAVASCRIPT FILE
// This file contains all the interactive functionality for the website
// You can change various settings and content here

// Import animation library (AOS) for scroll animations
import Aos from "aos";
// Import smooth scrolling library (Lenis)
import Lenis from "lenis";

// Initialize smooth scrolling
new Lenis({
  autoRaf: true,
});

// Initialize animations with custom settings
Aos.init({
  duration: 800, // Animation duration in milliseconds (change for faster/slower animations)
  easing: "ease-in-out", // Animation easing (change for different animation styles)
  once: true, // Animations only play once per element
});

// DATE INPUT SETUP
// Set the minimum date for the booking form to today's date
// This prevents users from selecting past dates
const today = new Date().toISOString().split("T")[0];
document.getElementById("dateInput").setAttribute("min", today);

// VIRTUAL TOUR FUNCTIONALITY
// Handles the checkbox that shows/hides the video modal
document
  .getElementById("virtual-tour")
  .addEventListener("change", function (e) {
    console.log(e.target.checked);
    if (e.target.checked) {
      // When checkbox is checked, load the YouTube video
      // CHANGE THIS URL to your own YouTube video for the virtual tour
      document.getElementById("iframe").src =
        "https://www.youtube.com/embed/6BTOHtZkook?si=V2WY_k8IwmcoHL8v";
    } else {
      // When checkbox is unchecked, remove the video
      document.getElementById("iframe").src = "";
    }
  });

// COUNTER ANIMATIONS
// Animates the numbers in the statistics section
const counters = document.querySelectorAll(".counter");

// Function to format numbers (adds leading zero for small numbers, commas for large ones)
function formatNumber(num) {
  if (num < 10) return "0" + num;
  return num.toLocaleString();
}

// Function to animate a single counter
function runCounter(counter) {
  // Get the target number from the HTML data-target attribute
  // CHANGE THESE NUMBERS in the HTML file (data-target attribute) to update statistics
  let target = +counter.getAttribute("data-target");
  let duration = +counter.getAttribute("data-duration") || 1000; // Animation duration

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

// INTERSECTION OBSERVER FOR COUNTERS
// Triggers counter animation when the statistics section comes into view
const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll(".counter");

        counters.forEach((counter) => runCounter(counter));

        observer.unobserve(entry.target); // run only once
      }
    });
  },
  {
    threshold: 0.4, // 40% of the section must be visible to trigger (change this value if needed)
  },
);

// Start observing the statistics section
const section = document.querySelector("section");
observer.observe(section);

// ACCORDION FUNCTIONALITY
// Handles the expandable FAQ sections
const items = document.querySelectorAll(".accordion-item");

items.forEach((item) => {
  const header = item.querySelector(".accordion-header");
  const content = item.querySelector(".accordion-content");
  const icon = header.querySelector("span");
  header.addEventListener("click", () => {
    // Close all accordions first
    items.forEach((i) => {
      i.querySelector(".accordion-content").style.maxHeight = null;
      i.querySelector("span").textContent = "+";
    });

    // Open the clicked accordion (if it wasn't already open)
    if (!content.style.maxHeight) {
      content.style.maxHeight = content.scrollHeight + "px";
      icon.textContent = "−";
    }
  });
});

// Keep the first FAQ item open by default
const firstItem = items[0];
if (firstItem) {
  const content = firstItem.querySelector(".accordion-content");
  const icon = firstItem.querySelector("span");
  content.style.maxHeight = content.scrollHeight + "px";
  icon.textContent = "−";
}

// CURRENT YEAR DISPLAY
// Automatically updates the copyright year in the footer
document.getElementById("year").textContent = new Date().getFullYear();

// SCROLL DOWN FUNCTIONALITY
// Makes the down arrow in hero section scroll to next section
document.getElementById("scroll-down").addEventListener("click", function () {
  window.scrollBy({
    top: window.innerHeight, // Scroll down by one viewport height
    behavior: "smooth", // Smooth scrolling animation
  });
});

// NAVBAR SCROLL BEHAVIOR
// Handles navbar visibility and styling based on scroll direction and position
function createScrollDirectionTracker() {
  // Variables to track scroll behavior
  let scrollDirection = "up";
  let lastScrollY = 0;

  // Set initial navbar text color to white
  document.getElementById("navbar").style.color = "#FFF";

  // Main scroll handling function
  function handleScroll() {
    const currentScrollY = window.pageYOffset;

    // DETERMINE SCROLL DIRECTION
    // Compare current position with last position
    if (currentScrollY > lastScrollY) {
      scrollDirection = "down"; // User scrolled down
    } else {
      scrollDirection = "up"; // User scrolled up
    }

    // Update last position for next comparison
    lastScrollY = currentScrollY;

    // HANDLE NAVBAR VISIBILITY BASED ON SCROLL DIRECTION
    if (scrollDirection === "down") {
      // SCROLLING DOWN: Hide navbar by moving it up off-screen
      document.getElementById("navbar").style.top = "-10rem"; // Move up 160px (10rem)
      document.getElementById("navbar").style.transition = "all 0.5s ease"; // Smooth animation

      // Optional: Add shadow (currently commented out)
      // document.getElementById("navbar").classList.add("shadow-[0_0_80px_0_#2B245D21]");
    } else {
      // SCROLLING UP: Show navbar
      if (currentScrollY > 0) {
        document.getElementById("navbar").style.top = 0; // Move back to top
      } else {
        document.getElementById("navbar").style.top = 0 + "px";
        document.getElementById("navbar").style.transition = "all 0.5s ease";
      }
    }

    // HANDLE NAVBAR BACKGROUND BASED ON SCROLL POSITION
    if (currentScrollY > 0) {
      // NOT AT TOP: Add background and blur for better readability
      document.getElementById("navbar").style.position = "fixed";
      document.getElementById("navbar").classList.add("backdrop-blur"); // Blur background
      document.getElementById("navbar").classList.add("bg-white/80"); // Semi-transparent white
      document.getElementById("navbar").classList.add("shadow"); // Drop shadow
      document.getElementById("navbar").classList.add("text-black!"); // Text color
    } else {
      // AT TOP: Remove background (transparent navbar over hero)
      document.getElementById("navbar").style.top = 0 + "px";
      document.getElementById("navbar").classList.remove("backdrop-blur");
      document.getElementById("navbar").classList.remove("bg-white/80");
      document.getElementById("navbar").classList.remove("shadow");
      document.getElementById("navbar").classList.remove("text-black!");
    }
  }

  // Listen for scroll events and call handleScroll function
  window.addEventListener("scroll", handleScroll);

  // Return object with utility methods
  return {
    getScrollDirection: () => scrollDirection, // Get current scroll direction
    cleanup: () => {
      window.removeEventListener("scroll", handleScroll); // Remove listener (cleanup)
    },
  };
}

// Initialize the navbar scroll behavior
createScrollDirectionTracker();
