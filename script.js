// Scroll To Top Button
document.addEventListener("DOMContentLoaded", () => {
  const scrollTopBtn = document.getElementById("scrollToTop");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      scrollTopBtn.style.display = "block";
    } else {
      scrollTopBtn.style.display = "none";
    }
  });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// Sticky Navbar
const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    navbar.classList.add("sticky");
  } else {
    navbar.classList.remove("sticky");
  }
});

// Mobile Menu Toggle
const toggleBtn = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (toggleBtn && navMenu) {
  toggleBtn.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });
}

// Animate feature cards on scroll
document.addEventListener("DOMContentLoaded", () => {
  const featureCards = document.querySelectorAll(".zigzag-item");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
        observer.unobserve(entry.target); // Optional: only animate once
      }
    });
  }, {
    threshold: 0.2
  });

  featureCards.forEach(card => observer.observe(card));
});

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// 2. Scroll to top button
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerText = "⬆️";
scrollTopBtn.id = "scrollToTop";
scrollTopBtn.style.cssText = `
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: none;
  background: #007bff;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 999;
`;
document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
  scrollTopBtn.style.display = window.scrollY > 200 ? 'block' : 'none';
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 3. Fade-in animations on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
    }
  });
}, {
  threshold: 0.2,
});

document.querySelectorAll('.zigzag-item, .feature-card, .footer-section').forEach(el => {
  observer.observe(el);
});

// 4. Accordion for FAQs (optional)
const accordions = document.querySelectorAll('.accordion-header');
accordions.forEach(header => {
  header.addEventListener('click', () => {
    const content = header.nextElementSibling;
    content.classList.toggle('open');
    header.classList.toggle('active');
  });
});

// 5. Toast Notification (optional)
function showToast(message = "This is a toast!") {
  const toast = document.createElement('div');
  toast.innerText = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: #fff;
    padding: 12px 20px;
    border-radius: 6px;
    z-index: 1000;
    opacity: 0.9;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}




// Example usage
// showToast("Welcome to Credify!");

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  const data = [
    "Home",
    "Credit Tips",
    "Loans",
    "Mobile App",
    "Easy Approval",
    "FAQs",
    "Help Center",
    "About Credify",
    "Support",
    "User Dashboard"
  ];

  searchInput.addEventListener("input", function () {
    const value = this.value.toLowerCase();
    searchResults.innerHTML = "";

    if (value.trim() === "") {
      searchResults.style.display = "none";
      return;
    }

    const filtered = data.filter(item =>
      item.toLowerCase().includes(value)
    );

    if (filtered.length > 0) {
      filtered.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        li.addEventListener("click", () => {
          searchInput.value = item;
          searchResults.style.display = "none";
        });
        searchResults.appendChild(li);
      });
      searchResults.style.display = "block";
    } else {
      searchResults.style.display = "none";
    }
  });

  // Hide on click outside
  document.addEventListener("click", function (e) {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.style.display = "none";
    }
  });
});

document.getElementById('getStartedBtn').addEventListener('click', () => {
      const modal = document.getElementById('getStartedModal');
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
    });

    // Hide modal on cancel
    document.getElementById('modalCancelBtn').addEventListener('click', () => {
      const modal = document.getElementById('getStartedModal');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    });

    // Handle form submission
    document.getElementById('getStartedForm').addEventListener('submit', event => {
      event.preventDefault();

      // Collect data
      const monthlyIncomeEstimate = event.target.monthlyIncomeEstimate.value;
      const repaymentCapacity = event.target.repaymentCapacity.value;
      const selfEmployedYears = event.target.selfEmployedYears.value;

      if (!monthlyIncomeEstimate || !repaymentCapacity || !selfEmployedYears) {
        alert('Please fill all fields.');
        return;
      }

      // Store data in session storage (to be used later in eligibility page)
      const getStartedData = {
        monthlyIncomeEstimate: Number(monthlyIncomeEstimate),
        repaymentCapacity: Number(repaymentCapacity),
        selfEmployedYears: Number(selfEmployedYears)
      };
      sessionStorage.setItem('getStartedData', JSON.stringify(getStartedData));

      // Hide modal
      const modal = document.getElementById('getStartedModal');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');

      // Redirect user to eligibility page
      window.location.href = 'eligibility.html';
    });

    fetch('/save-get-started', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify(getStartedData)
}).then(response => {
  if(response.ok) {
    // Redirect or further processing
    window.location.href = 'eligibility.html';
  } else {
    // Handle error
    alert('Failed to save data.');
  }
});

function checkEligibility() {
    const monthlyIncome = document.getElementById('monthlyIncomeEstimate').value;
    const repaymentCapacity = document.getElementById('repaymentCapacity').value;
    const selfEmployedYears = document.getElementById('selfEmployedYears').value;
    fetch('/check-eligibility', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            monthlyIncome: Number(monthlyIncome),
            repaymentCapacity: Number(repaymentCapacity),
            selfEmployedYears: Number(selfEmployedYears)
        })
    })
    .then(response => response.json())
    .then(data => {
        // Display eligibility status to the user
        alert(`Eligibility Status: ${data.eligibility_status}\nDTI: ${data.dti.toFixed(2)}%`);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

