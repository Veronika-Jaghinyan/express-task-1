const addVideoPopup = document.getElementById('add-video-popup');
const updateVideoPopup = document.getElementById('update-video-popup');

function openAddVideoPopup() {
  if (!addVideoPopup) return;
  addVideoPopup.style.display = 'flex';
}

function openUpdateVideoPopup(event, videoId) {
  if (!updateVideoPopup || !videoId) return;
  event.preventDefault();
  updateVideoPopup.style.display = 'flex';
  restoreSelectedVideoData(videoId);
}

function restoreSelectedVideoData(videoId) {
  // Set video ID to use in update/put request
  updateVideoPopup.setAttribute('data-id', videoId);

  // Get current video and restore form based on memory data
  const video = document.getElementById(videoId);

  // Restor saved title
  const inputTitle = document.getElementById('update-title');
  inputTitle.value = video.title || '';

  // Restore saved video name
  const currentVideo = video.src.split('/').pop().split('?')[0] || '';
  const currentVideoEl = document.getElementById('current-video-name');
  currentVideoEl.textContent = 'Current vidoe name: ' + currentVideo;

  // Restore saved thumbnail name
  const currentThumbnail = video.poster.split('/').pop().split('?')[0] || '';
  const currentThumbnailEl = document.getElementById('current-thumbnail-name');
  currentThumbnailEl.textContent = 'Current thumbnail name: ' + currentThumbnail;
}

function cleanPopupForms() {
  document.getElementById('add-upload-form').reset();
  document.getElementById('update-upload-form').reset();
}

function closePopup() {
  addVideoPopup.style.display = 'none';
  updateVideoPopup.style.display = 'none';

  // Clean popup form on close
  cleanPopupForms();
}

function closePopupsOnOutsideClick() {
  // Close update video popup on outside click
  addVideoPopup &&
    addVideoPopup.addEventListener('click', function (event) {
      if (event.target === this) {
        closePopup();
      }
    });

  // Close update video popup on outside click
  updateVideoPopup &&
    updateVideoPopup.addEventListener('click', function (event) {
      if (event.target === this) {
        closePopup();
      }
    });
}

function handleAddVideoSubmit() {
  const addForm = document.getElementById('add-upload-form');
  if (!addForm) return;

  addForm.addEventListener('submit', function (event) {
    event.preventDefault();

    let formData = new FormData(this);

    // Send a POST request with the form data
    fetch('/', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        alert(data.msg);
        location.reload(); // Refresh page after adding new video
      })
      .catch(error => {
        alert('Error:', error);
      });

    closePopup();
  });
}

function handleUpdateVideoSubmit() {
  const updateForm = document.getElementById('update-upload-form');
  if (!updateForm) return;

  updateForm.addEventListener('submit', function (event) {
    event.preventDefault();
    let formData = new FormData(this);

    // Get video ID set on form data restore
    const videoEl = updateVideoPopup;
    const videoId = videoEl.getAttribute('data-id');

    // Send a PUT request with the form data
    fetch(`/${videoId}`, {
      method: 'PUT',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        alert(data.msg);
        location.reload(); // Refresh page after update
      })
      .catch(error => {
        alert('Error:', error);
      });

    closePopup();
  });
}

function handleDeleteVideo(event, videoId) {
  event.preventDefault();

  const confirmDeleting = confirm('Are you sure you want to delete this video?');

  if (confirmDeleting) {
    // Send a DELETE request
    fetch(`/${videoId}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(data => {
        alert(data.msg);
        location.reload(); // Refresh page after deletion
      })
      .catch(error => alert('Error:', error));
  }
}

// Call functions with event listeners
closePopupsOnOutsideClick();
handleAddVideoSubmit();
handleUpdateVideoSubmit();
