// Trash Elements
const trashContainer = document.getElementById('trashContainer');

// Fetch trash files from localStorage or initialize as an empty array
let trashFiles = JSON.parse(localStorage.getItem('trash')) || [];
let files = JSON.parse(localStorage.getItem('files')) || []; // Files in "My Drive"

// Function to render trash files
function renderTrash() {
  trashContainer.innerHTML = ''; // Clear existing content

  if (trashFiles.length === 0) {
    trashContainer.innerHTML = `<p>No files in Trash. Deleted files will appear here.</p>`;
    return;
  }

  // Loop through the trashFiles array and render each file
  trashFiles.forEach((file, index) => {
    const fileDiv = document.createElement('div');
    fileDiv.className = 'file';

    fileDiv.innerHTML = `
      <div class="file-info">
        <strong>${file.name}</strong>
        <span class="file-type">${file.type || 'Unknown Type'}</span>
      </div>
      <div class="file-options">
        <button onclick="restoreFile(${index})">Restore</button>
        <button onclick="deleteFilePermanently(${index})">Delete Permanently</button>
      </div>
    `;

    trashContainer.appendChild(fileDiv);
  });
}

// Function to restore a file
function restoreFile(index) {
  const restoredFile = trashFiles.splice(index, 1)[0];

  // Check if file already exists in "My Drive"
  if (files.some(file => file.name === restoredFile.name)) {
    alert(`A file named "${restoredFile.name}" already exists in My Drive.`);
    trashFiles.push(restoredFile); // Restore back to trash if duplicate
    return;
  }

  files.push(restoredFile); // Add back to "My Drive"
  localStorage.setItem('files', JSON.stringify(files)); // Update files in "My Drive"
  localStorage.setItem('trash', JSON.stringify(trashFiles)); // Update trash
  renderTrash(); // Re-render Trash
  updateHomeFileList(); // Re-render home files
  alert(`File "${restoredFile.name}" restored successfully!`);
}

// Function to delete a file permanently
function deleteFilePermanently(index) {
  const deletedFile = trashFiles.splice(index, 1)[0];
  localStorage.setItem('trash', JSON.stringify(trashFiles)); // Update trash
  renderTrash(); // Re-render Trash
  alert(`File "${deletedFile.name}" deleted permanently.`);
}

// Function to re-render home files
function updateHomeFileList() {
  const fileContainer = document.getElementById('fileContainer');
  fileContainer.innerHTML = ''; // Clear existing files

  files.forEach((file, index) => {
    const fileDiv = document.createElement('div');
    fileDiv.className = 'file';

    fileDiv.innerHTML = `
      <div class="file-info">
        <strong>${file.name}</strong>
        <span class="file-type">${file.type || 'Unknown Type'}</span>
      </div>
      <div class="file-options">
        <button onclick="deleteFile(${index})">Delete</button>
      </div>
    `;

    fileContainer.appendChild(fileDiv);
  });
}

// Initial render
renderTrash();
