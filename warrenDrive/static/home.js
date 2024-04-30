const fileListElement = document.getElementById('file-list');
const uploadForm = document.getElementById('upload-form');
const uploadButton = document.getElementById('upload-button')
const uploadNewButton = document.getElementById('new-button')
var popover = document.getElementById('popover');
const closePopoverButton = document.getElementById("uploadDone")
const sharedFiles = document.getElementById("shared");
const myDriveFiles = document.getElementById("mydrive");
const trashFiles = document.getElementById("trash")



function getFileList() {
  fetch('/fileList')
  .then(response => response.json())
  .then(data => {
    renderFileList(data)
  })
  .catch(error => {
    console.error('Error fetching file list:', error);
    fileListElement.textContent = 'Error retrieving file list.';
  });
}

sharedFiles.addEventListener('click', function() {
  fetch('/sharedFileList')
  .then(response => response.json())
  .then(data => {
    renderFileList(data)
  })
  .catch(error => {
    console.error('Error fetching file list:', error);
    fileListElement.textContent = 'Error retrieving file list.';
  });
  });

  myDriveFiles.addEventListener('click', function() {
    getFileList()
  })

  trashFiles.addEventListener('click', function() {
    // fetch deleted files and render list
  });


function renderFileList(data) {
  const tableBody = document.getElementById('file-list-content');
  tableBody.innerHTML = ''; // Clear existing content

  for (const file of data) {
    const tableRow = document.createElement('tr');
    tableRow.classList.add('file-row');
    tableRow.classList.add('file-row');
     tableRow.addEventListener('dblclick', () => {
      // Handle row click
      window.open(file.url);
  });

    tableRow.addEventListener('mouseover', () => {
      tableRow.classList.add('hovered');
    });

    tableRow.addEventListener('mouseout', () => {
      tableRow.classList.remove('hovered');
    });

    let previouslySelectedRow = null;  // Track previously selected row

    tableRow.addEventListener('click', () => {
      if (previouslySelectedRow) {
        previouslySelectedRow.classList.remove('selected');  // Remove selection from previous row
        previouslySelectedRow.removeEventListener('click', handleRowClick); // Remove click listener
     }
      tableRow.classList.toggle('selected');  // Toggle selected class
      previouslySelectedRow = tableRow;  // Update reference to currently selected row

    });

    const nameCell = document.createElement('td');
    nameCell.textContent = file.name;
    tableRow.appendChild(nameCell);
  
    const lastOpenedCell = document.createElement('td');
    lastOpenedCell.textContent = '—'; // TODO Last opened
    tableRow.appendChild(lastOpenedCell);
  
    const ownerCell = document.createElement('td');
    ownerCell.textContent = file.owner;
    tableRow.appendChild(ownerCell);
  
    const sharedCell = document.createElement('td');
    sharedCell.textContent = file.location || "My Drive";
    tableRow.appendChild(sharedCell);
  
    const optionsCell = document.createElement('td');
    optionsCell.classList.add('options-cell');
    // Add placeholder for options menu (implementation omitted)
    optionsCell.innerHTML = '<span class="options-dots">...</span>';
    tableRow.appendChild(optionsCell);
    tableBody.appendChild(tableRow);
  }
}

uploadNewButton.addEventListener('click', function() {
  popover.style.display ="block";
  document.getElementById('background').style.zIndex = '5';
  document.getElementById('background').style.backgroundColor = '#eee';
  document.getElementById('background').style.backgroundColor = 'transparent';
});

// Optional: Close popover when clicked outside or popover done button
document.addEventListener('click', function(event) {
  if ((!popover.contains(event.target) && !uploadNewButton.contains(event.target)) || (event.target === closePopoverButton)) {
     popover.style.display ="none";
  }
});

function uploadData() {
  const formData = new FormData(uploadForm);
  fetch('/upload', {
    method: 'POST',
    body: formData
  })
    .then(response => response.text())
    .then(message => {
        const uploadSuccessful = popover.querySelector("h4");
        uploadSuccessful.textContent = message;
    })
    .catch(error => {
      console.error('Error uploading file:', error);
    });
}

getFileList(); // initial rendering