// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Find the "Get Space Images" button and the gallery container
const getImagesBtn = document.querySelector('.filters button');
const gallery = document.getElementById('gallery');

// NASA APOD API endpoint and your API key
const API_URL = 'https://api.nasa.gov/planetary/apod';
const API_KEY = '2ZTqCBxethgKGcopuX2P8jr3g2Wh76YDaBMZ85bb'; // Use your own API key

// Function to fetch images from NASA's APOD API
async function fetchSpaceImages(startDate, endDate) {
  // Build the API URL with query parameters
  const url = `${API_URL}?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;
  try {
    // Fetch data from the API
    const response = await fetch(url);
    // Parse the response as JSON
    const data = await response.json();
    // Return the data (array of image objects)
    return data;
  } catch (error) {
    // If there's an error, return null
    return null;
  }
}

// Create a modal element and add it to the page
const modal = document.createElement('div');
modal.id = 'imageModal';
modal.style.display = 'none'; // Hide by default
modal.innerHTML = `
  <div class="modal-content">
    <span class="modal-close">&times;</span>
    <img class="modal-img" src="" alt="" />
    <h2 class="modal-title"></h2>
    <p class="modal-date"></p>
    <p class="modal-explanation"></p>
  </div>
`;
document.body.appendChild(modal);

// Function to open the modal with image details
function openModal(image) {
  // Set modal image, title, date, and explanation
  const modalImg = modal.querySelector('.modal-img');
  const modalTitle = modal.querySelector('.modal-title');
  const modalDate = modal.querySelector('.modal-date');
  const modalExplanation = modal.querySelector('.modal-explanation');

  modalImg.src = image.hdurl || image.url;
  modalImg.alt = image.title;
  modalTitle.textContent = image.title;
  modalDate.textContent = `Date: ${image.date}`;
  modalExplanation.textContent = image.explanation;

  modal.style.display = 'flex';
}

// Function to close the modal
function closeModal() {
  modal.style.display = 'none';
}

// Close modal when clicking the close button
modal.querySelector('.modal-close').addEventListener('click', closeModal);

// Close modal when clicking outside the modal content
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

// ===== Random Space Fact Section =====

// Array of fun space facts
const spaceFacts = [
  "Did you know? One million Earths could fit inside the Sun!",
  "Did you know? A day on Venus is longer than a year on Venus.",
  "Did you know? Neutron stars can spin 600 times per second.",
  "Did you know? There are more trees on Earth than stars in the Milky Way.",
  "Did you know? The footprints on the Moon will be there for millions of years.",
  "Did you know? Jupiter has 95 known moons as of 2024.",
  "Did you know? Space is completely silent—there’s no air for sound to travel.",
  "Did you know? The hottest planet in our solar system is Venus.",
  "Did you know? Saturn would float if you could put it in water.",
  "Did you know? The largest volcano in the solar system is on Mars—Olympus Mons."
];

// Pick a random fact
const randomFact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];

// Create and insert the fact section above the gallery
const factSection = document.createElement('div');
factSection.className = 'space-fact';
factSection.innerHTML = `<span class="fact-icon">🛰️</span> <span>${randomFact}</span>`;
const filters = document.querySelector('.filters');
filters.insertAdjacentElement('afterend', factSection);

// ====== Gallery and Modal Code (with video handling) ======

// Function to update the gallery with images
function showImages(images) {
  // Clear the gallery
  gallery.innerHTML = '';
  // If there are no images, show a message
  if (!images || images.length === 0 || images.code === 400) {
    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">🚫</div>
        <p>Sorry, no images found for this date range.</p>
      </div>
    `;
    return;
  }
  // Loop through each image object and create a gallery item
  images.forEach(image => {
    // Create a div for each gallery item
    const item = document.createElement('div');
    item.className = 'gallery-item';

    // If it's an image, show the image and info
    if (image.media_type === 'image') {
      item.innerHTML = `
        <img src="${image.url}" alt="${image.title}" />
        <h3>${image.title}</h3>
        <p><strong>Date:</strong> ${image.date}</p>
        <p>${image.explanation}</p>
      `;
      // Add click event to open modal with image details
      item.addEventListener('click', () => {
        openModal(image);
      });
    } else if (image.media_type === 'video') {
      // For videos, show a video icon, title, and a clickable link
      item.innerHTML = `
        <div class="video-thumb">
          <span class="video-icon">🎬</span>
          <a href="${image.url}" target="_blank" rel="noopener" class="video-link">
            <h3>${image.title}</h3>
          </a>
        </div>
        <p><strong>Date:</strong> ${image.date}</p>
        <p>${image.explanation}</p>
      `;
    }
    // Add the item to the gallery
    gallery.appendChild(item);
  });
}

// When the button is clicked, fetch and show images
getImagesBtn.addEventListener('click', async () => {
  // Get the selected start and end dates
  const startDate = startInput.value;
  const endDate = endInput.value;
  // Show a loading message before fetching
  gallery.innerHTML = `
    <div class="placeholder">
      <div class="placeholder-icon">🔄</div>
      <p>Loading space photos…</p>
    </div>
  `;
  // Fetch images from the API
  const images = await fetchSpaceImages(startDate, endDate);
  // Show the images in the gallery (replaces loading message)
  showImages(images);
});
