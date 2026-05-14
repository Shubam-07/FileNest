const fileContainer = document.getElementById('fileContainer');
const fileInput = document.getElementById('fileInput');
const newButton = document.getElementById('newButton');
const newDropdown = document.getElementById('newDropdown');
const searchBar = document.getElementById('searchBar');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const viewPermissionCheckbox = document.getElementById('viewPermission');
const editPermissionCheckbox = document.getElementById('editPermission');
const recipientEmailInput = document.getElementById('recipientEmail');
const savePermissionsButton = document.getElementById('savePermissions');

// Load documents and trash from localStorage or initialize
let documents = JSON.parse(localStorage.getItem('documents')) || [];
let trash = JSON.parse(localStorage.getItem('trash')) || [];
let currentFileIndex = null;

// Update localStorage with the current documents and trash
function updateLocalStorage() {
    localStorage.setItem('documents', JSON.stringify(documents));
    localStorage.setItem('trash', JSON.stringify(trash));
}

// Toggle dropdown on "New" button click
newButton.addEventListener('click', () => {
    newDropdown.style.display = newDropdown.style.display === 'block' ? 'none' : 'block';
});

// Trigger file upload when "Upload File" is clicked
document.getElementById('uploadFileOption').addEventListener('click', () => {
    fileInput.click();
    newDropdown.style.display = 'none';
});

// Handle file selection and display in workspace
fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
        // Prevent duplicate file names
        if (documents.some(doc => doc.name === file.name)) {
            alert('A file with this name already exists.');
            return;
        }
        documents.push({ name: file.name, permissions: [] });
        updateLocalStorage();
        renderFiles();
    } else {
        alert('No file selected.');
    }
});


// Render files with delete and share options
function renderFiles() {
    fileContainer.innerHTML = '';
    if (documents.length === 0) {
        fileContainer.innerHTML = `<p>No files available. Upload a file to get started.</p>`;
        return;
    }
    documents.forEach((file, index) => {
        const fileElement = document.createElement('div');
        fileElement.className = 'file';

        fileElement.innerHTML = `
            <div class="file-info">
                <strong>${file.name}</strong>
                <div class="file-options">
                    <button onclick="openModal(${index})">Share</button>
                    <button onclick="deleteFile(${index})">Delete</button>
                </div>
            </div>
        `;
        fileContainer.appendChild(fileElement);
    });
}

// Delete a file (move to Trash)
function deleteFile(index) {
    const deletedFile = documents.splice(index, 1)[0];
    trash.push(deletedFile);
    updateLocalStorage();
    renderFiles();
    alert(`File "${deletedFile.name}" moved to Trash.`);
}

// Open permissions modal and set sharing options
function openModal(fileIndex) {
    currentFileIndex = fileIndex;
    recipientEmailInput.value = '';
    viewPermissionCheckbox.checked = false;
    editPermissionCheckbox.checked = false;
    modal.style.display = 'block';
}

// Close the modal when "X" button is clicked
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Save permissions, store them, and close the modal
savePermissionsButton.addEventListener('click', () => {
    if (currentFileIndex !== null) {
        const email = recipientEmailInput.value.trim();
        const view = viewPermissionCheckbox.checked;
        const edit = editPermissionCheckbox.checked;

        if (email) {
            // Add recipient-specific permissions to the file
            documents[currentFileIndex].permissions.push({
                email,
                view,
                edit
            });
            updateLocalStorage();
            modal.style.display = 'none';
            alert(`File shared with ${email}`);
        } else {
            alert("Please enter a recipient's email.");
        }
    }
});

// Filter files based on search query
searchBar.addEventListener('input', () => {
    const searchTerm = searchBar.value.toLowerCase();
    const filteredFiles = documents.filter((file) =>
        file.name.toLowerCase().includes(searchTerm)
    );

    fileContainer.innerHTML = '';
    if (filteredFiles.length === 0) {
        fileContainer.innerHTML = `<p>No files match your search.</p>`;
        return;
    }
    filteredFiles.forEach((file, index) => {
        const fileElement = document.createElement('div');
        fileElement.className = 'file';
        fileElement.innerHTML = `
            <div class="file-info">
                <strong>${file.name}</strong>
                <div class="file-options">
                    <button onclick="openModal(${index})">Share</button>
                    <button onclick="deleteFile(${index})">Delete</button>
                </div>
            </div>
        `;
        fileContainer.appendChild(fileElement);
    });
});

// Initial render of files
renderFiles();
