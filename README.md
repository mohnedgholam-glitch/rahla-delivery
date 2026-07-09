#// ===== Mobile Menu Toggle =====
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ===== Smooth Scroll to Booking Section =====
function scrollToBooking() {
    const bookingSection = document.getElementById('booking');
    bookingSection.scrollIntoView({ behavior: 'smooth' });
}

// ===== Form Handling =====
const bookingForm = document.getElementById('bookingForm');
const confirmationMessage = document.getElementById('confirmationMessage');

bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const service = document.getElementById('service').value;
    const time = document.getElementById('time').value;
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const notes = document.getElementById('notes').value;

    // Validate form
    if (!name || !phone || !service || !time || !from || !to) {
        alert('الرجاء ملء جميع الحقول المطلوبة');
        return;
    }

    // Create booking object
    const booking = {
        name: name,
        phone: phone,
        service: service,
        time: time,
        from: from,
        to: to,
        notes: notes,
        timestamp: new Date().toISOString()
    };

    // Save to localStorage (for demonstration)
    saveBooking(booking);

    // Show confirmation message
    showConfirmation();

    // Reset form
    bookingForm.reset();

    // Hide confirmation after 5 seconds
    setTimeout(() => {
        confirmationMessage.style.display = 'none';
    }, 5000);
});

// Save booking to localStorage
function saveBooking(booking) {
    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    console.log('تم حفظ الحجز:', booking);
}

// Show confirmation message
function showConfirmation() {
    confirmationMessage.style.display = 'block';
    confirmationMessage.scrollIntoView({ behavior: 'smooth' });
}

// ===== Scroll animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards for animation
document.querySelectorAll('.service-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
});

// ===== Phone validation =====
document.getElementById('phone').addEventListener('input', function(e) {
    // Remove non-numeric characters
    this.value = this.value.replace(/[^\d]/g, '');
});

// ===== Dynamic Service Selection Price =====
const serviceSelect = document.getElementById('service');
const prices = {
    motorcycle: '50 ج.م',
    car: '100 ج.م',
    quarter: '200 ج.م',
    half: '400 ج.م',
    heavy: '600 ج.م',
    bicycle: '30 ج.م'
};

serviceSelect.addEventListener('change', function() {
    const selectedPrice = prices[this.value];
    if (selectedPrice) {
        console.log('السعر المتوقع:', selectedPrice);
    }
});

// ===== Contact Form Handler (Optional) =====
// You can add a contact form handler if needed

// ===== Navbar scroll effect =====
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// ===== Initialize on page load =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('موقع رحلة - تم تحميل الصفحة بنجاح!');
    
    // You can add initialization code here
});

// ===== Prevent form submission to actual server =====
// In production, you would send the form data to a backend server
 rahla-delivery
