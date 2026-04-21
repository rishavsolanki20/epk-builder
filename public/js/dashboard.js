// Global state
let currentEPK = null;
let currentSlug = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async () => {
    await loadEPKData();
});

// Load EPK data
async function loadEPKData() {
    try {
        const response = await fetch('/api/epk/current');
        if (response.ok) {
            currentEPK = await response.json();
            currentSlug = currentEPK.slug;
            populateDashboard();
        }
    } catch (error) {
        console.error('Error loading EPK data:', error);
    }
}

// Populate dashboard with EPK data
function populateDashboard() {
    if (!currentEPK) return;

    // Update stats
    document.getElementById('totalViews').textContent = currentEPK.views || 0;
    document.getElementById('photoCount').textContent = currentEPK.photos?.length || 0;
    document.getElementById('musicCount').textContent = currentEPK.music?.length || 0;
    document.getElementById('pressCount').textContent = currentEPK.press?.length || 0;

    // Populate form
    document.getElementById('artistName').value = currentEPK.artistName || '';
    document.getElementById('genre').value = currentEPK.genre || '';
    document.getElementById('bio').value = currentEPK.bio || '';
    document.getElementById('location').value = currentEPK.location || '';
    document.getElementById('website').value = currentEPK.website || '';

    // Set EPK URL
    const epkUrl = `${window.location.origin}/epk/${currentEPK.slug}`;
    document.getElementById('epkUrl').value = epkUrl;

    // Set publish status
    const publishToggle = document.getElementById('publishToggle');
    const publishStatus = document.getElementById('publishStatus');
    const publishHelp = document.getElementById('publishHelp');
    const urlWarning = document.getElementById('urlWarning');
    
    if (publishToggle) {
        publishToggle.checked = currentEPK.published;
        if (currentEPK.published) {
            publishStatus.textContent = 'EPK is public ✓';
            publishStatus.style.color = '#38a169';
            publishHelp.textContent = 'Your EPK is now visible to everyone';
            if (urlWarning) urlWarning.style.display = 'none';
        } else {
            publishStatus.textContent = 'EPK is private';
            publishStatus.style.color = '#1a202c';
            publishHelp.textContent = 'Toggle ON to make your EPK public and shareable';
            if (urlWarning) urlWarning.style.display = 'block';
        }
    }

    // Load photos
    if (currentEPK.photos) {
        renderPhotos();
    }

    // Load audio files
    if (currentEPK.music) {
        renderAudio();
    }
}

// Switch media tabs
function switchMediaTab(tab) {
    // Hide all tabs
    document.querySelectorAll('.media-tab-content').forEach(t => {
        t.style.display = 'none';
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`${tab}-tab`).style.display = 'block';
    event.currentTarget.classList.add('active');
}

// Show section
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });

    // Show selected section
    const section = document.getElementById(`${sectionName}-section`);
    if (section) {
        section.style.display = 'block';
    }

    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget?.classList.add('active');
}

// Handle EPK form submission
document.getElementById('epkForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        artistName: document.getElementById('artistName').value,
        genre: document.getElementById('genre').value,
        bio: document.getElementById('bio').value,
        location: document.getElementById('location').value,
        website: document.getElementById('website').value
    };

    try {
        const response = await fetch(`/epk/${currentSlug}/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        
        if (result.success) {
            showNotification('EPK updated successfully!', 'success');
            currentEPK = result.epk;
        } else {
            showNotification('Error updating EPK', 'error');
        }
    } catch (error) {
        console.error('Update error:', error);
        showNotification('Error updating EPK', 'error');
    }
});

// Upload photo
async function uploadPhoto(input) {
    if (!input.files || !input.files[0]) return;

    const formData = new FormData();
    formData.append('photo', input.files[0]);
    formData.append('caption', '');

    try {
        const response = await fetch(`/upload/photo/${currentSlug}`, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        
        if (result.success) {
            showNotification('Photo uploaded successfully!', 'success');
            await loadEPKData();
        } else {
            showNotification('Error uploading photo', 'error');
        }
    } catch (error) {
        console.error('Upload error:', error);
        showNotification('Error uploading photo', 'error');
    }
}

// Upload audio/MP3
async function uploadAudio(input) {
    if (!input.files || !input.files[0]) return;

    const file = input.files[0];
    const title = prompt('Enter track title:', file.name.replace(/\.[^/.]+$/, ''));
    if (!title) return;

    const formData = new FormData();
    formData.append('audio', file);
    formData.append('title', title);

    try {
        showNotification('Uploading audio file...', 'info');
        
        const response = await fetch(`/upload/audio/${currentSlug}`, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        
        if (result.success) {
            showNotification('Audio uploaded successfully!', 'success');
            await loadEPKData();
            input.value = ''; // Clear input
        } else {
            showNotification(result.error || 'Error uploading audio', 'error');
        }
    } catch (error) {
        console.error('Audio upload error:', error);
        showNotification('Error uploading audio file', 'error');
    }
}

// Render photos
function renderPhotos() {
    const gallery = document.getElementById('photoGallery');
    if (!gallery) return;

    gallery.innerHTML = currentEPK.photos.map((photo, index) => `
        <div class="photo-item">
            <img src="${photo.url}" alt="${photo.caption || 'Photo'}">
            <div class="photo-actions">
                <button onclick="deletePhoto('${photo._id}')" class="btn-delete">Delete</button>
            </div>
        </div>
    `).join('');
}

// Render audio files
function renderAudio() {
    const audioList = document.getElementById('audioList');
    if (!audioList) return;

    const uploadedTracks = currentEPK.music.filter(track => track.platform === 'upload');
    
    if (uploadedTracks.length === 0) {
        audioList.innerHTML = '<p style="text-align: center; color: #718096; padding: 2rem;">No audio files uploaded yet.</p>';
        return;
    }

    audioList.innerHTML = uploadedTracks.map((track) => `
        <div class="audio-item">
            <div class="audio-info">
                <h3 class="audio-title">${track.title}</h3>
                <p class="audio-meta">Uploaded ${new Date(track.addedAt).toLocaleDateString()}</p>
            </div>
            <audio controls style="width: 100%; margin: 1rem 0;">
                <source src="${track.filePath}" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
            <div class="audio-actions">
                <button onclick="deleteAudio('${track._id}')" class="btn-delete">Delete</button>
            </div>
        </div>
    `).join('');
}

// Delete photo
async function deletePhoto(photoId) {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
        const response = await fetch(`/upload/photo/${currentSlug}/${photoId}`, {
            method: 'DELETE'
        });

        const result = await response.json();
        
        if (result.success) {
            showNotification('Photo deleted successfully!', 'success');
            await loadEPKData();
        } else {
            showNotification('Error deleting photo', 'error');
        }
    } catch (error) {
        console.error('Delete error:', error);
        showNotification('Error deleting photo', 'error');
    }
}

// Delete audio
async function deleteAudio(audioId) {
    if (!confirm('Are you sure you want to delete this audio file?')) return;

    try {
        const response = await fetch(`/upload/audio/${currentSlug}/${audioId}`, {
            method: 'DELETE'
        });

        const result = await response.json();
        
        if (result.success) {
            showNotification('Audio deleted successfully!', 'success');
            await loadEPKData();
        } else {
            showNotification('Error deleting audio', 'error');
        }
    } catch (error) {
        console.error('Delete audio error:', error);
        showNotification('Error deleting audio', 'error');
    }
}

// Toggle publish status
async function togglePublish() {
    const toggle = document.getElementById('publishToggle');
    const status = document.getElementById('publishStatus');
    const help = document.getElementById('publishHelp');
    const warning = document.getElementById('urlWarning');

    try {
        const response = await fetch(`/epk/${currentSlug}/publish`, {
            method: 'POST'
        });

        const result = await response.json();
        
        if (result.success) {
            if (result.published) {
                status.textContent = 'EPK is public ✓';
                status.style.color = '#38a169';
                help.textContent = 'Your EPK is now visible to everyone';
                warning.style.display = 'none';
                showNotification('EPK is now public! Share your link.', 'success');
            } else {
                status.textContent = 'EPK is private';
                status.style.color = '#1a202c';
                help.textContent = 'Toggle ON to make your EPK public and shareable';
                warning.style.display = 'block';
                showNotification('EPK is now private', 'info');
            }
        }
    } catch (error) {
        console.error('Publish toggle error:', error);
        toggle.checked = !toggle.checked;
        showNotification('Error updating publish status', 'error');
    }
}

// Copy URL
function copyUrl() {
    const urlInput = document.getElementById('epkUrl');
    urlInput.select();
    document.execCommand('copy');
    showNotification('URL copied to clipboard!', 'success');
}

// Preview EPK
function previewEPK() {
    window.open(`/epk/${currentSlug}`, '_blank');
}

// Add music modal
function addMusic() {
    const url = prompt('Enter Spotify, SoundCloud, or YouTube URL:');
    if (!url) return;

    const title = prompt('Enter track title:');
    if (!title) return;

    addMusicTrack(url, title);
}

// Add music track
async function addMusicTrack(url, title) {
    try {
        const response = await fetch(`/epk/${currentSlug}/music`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url,
                title,
                platform: detectPlatform(url)
            })
        });

        const result = await response.json();
        
        if (result.success) {
            showNotification('Music track added!', 'success');
            await loadEPKData();
        }
    } catch (error) {
        console.error('Add music error:', error);
        showNotification('Error adding music', 'error');
    }
}

// Detect platform from URL
function detectPlatform(url) {
    if (url.includes('spotify')) return 'spotify';
    if (url.includes('soundcloud')) return 'soundcloud';
    if (url.includes('youtube') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('apple')) return 'apple';
    return 'other';
}

// Add press
function addPress() {
    showNotification('Press form coming soon!', 'info');
}

// Share EPK
function shareEPK() {
    copyUrl();
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
