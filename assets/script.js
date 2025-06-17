document.addEventListener("DOMContentLoaded", function () {
  // Get container element
  const container = document.getElementById("checklistContainer");

  // Create main title
  const titleElement = document.createElement("h1");
  titleElement.textContent = appConfig.title;
  container.appendChild(titleElement);

  // Create all sections
  appConfig.sections.forEach((section) => {
    // Create section container
    const sectionElement = document.createElement("div");
    sectionElement.className = "checklist-section";

    // Create section title
    const titleElement = document.createElement("h2");
    titleElement.textContent = section.title;
    titleElement.classList.add('collapsible-header'); // Add class for styling and targeting
    titleElement.style.cursor = 'pointer'; // Indicate clickable
    titleElement.style.userSelect = 'none'; // Prevent text selection on click

    // Create checklist content container
    const checklistContent = document.createElement("div");
    checklistContent.classList.add('collapsible-content'); // Add class for styling and toggling

    // Create checklist container
    const checklistElement = document.createElement("div");
    checklistElement.className = "checklist";
    checklistElement.id = section.id;
    checklistContent.appendChild(checklistElement); // Append checklist to content container

    sectionElement.appendChild(titleElement); // Append title to section
    sectionElement.appendChild(checklistContent); // Append content container to section

    // Add section to main container
    container.appendChild(sectionElement);

    // Add click event listener to the header
    titleElement.addEventListener('click', function() {
      checklistContent.classList.toggle('collapsed');
      // Optional: Update indicator text (can be replaced with CSS arrow)
      // if (checklistContent.classList.contains('collapsed')) {
      //   titleElement.textContent = section.title + ' [+]';
      // } else {
      //   titleElement.textContent = section.title + ' [-]';
      // }
    });

    // Function to create a checklist item
    function createChecklistItem(parent, itemText, isSubItem = false) {
      const itemId = `${section.id}-${itemText.replace(/\s+/g, "-").toLowerCase()}`;

      const itemElement = document.createElement("div");
      itemElement.className = `checklist-item${isSubItem ? ' sub-item' : ''}`;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = itemId;

      itemElement.addEventListener("click", function () {
        checkbox.checked = !checkbox.checked;
        updateProgress();
        if (checkbox.checked) {
          itemElement.classList.add("completed");
          // Check all parent items if this is a sub-item
          if (isSubItem) {
            let parentItem = itemElement.parentElement;
            while (parentItem && parentItem.classList.contains('checklist-item')) {
              const parentCheckbox = parentItem.querySelector('input[type="checkbox"]');
              if (parentCheckbox) {
                parentCheckbox.checked = true;
                parentItem.classList.add("completed");
              }
              parentItem = parentItem.parentElement;
            }
          }
        } else {
          itemElement.classList.remove("completed");
        }
      });

      const label = document.createElement("label");
      label.htmlFor = itemId;
      label.textContent = itemText;

      itemElement.appendChild(checkbox);
      itemElement.appendChild(label);

      parent.appendChild(itemElement);
    }

    // Function to create a nested checklist
    function createNestedChecklist(parent, items, parentItem = null) {
      if (Array.isArray(items)) {
        items.forEach((item) => {
          createChecklistItem(parent, item, parentItem !== null);
        });
      } else if (typeof items === 'object') {
        Object.keys(items).forEach((key) => {
          // Create a container for the sub-section
          const subSection = document.createElement("div");
          subSection.className = "checklist-subsection";

          // Create a header for the sub-section
          const subHeader = document.createElement("h3");
          subHeader.className = "checklist-subheader collapsible-header"; // Add collapsible-header class
          subHeader.textContent = key;
          subHeader.style.cursor = 'pointer'; // Indicate clickable
          subHeader.style.userSelect = 'none'; // Prevent text selection on click
          subSection.appendChild(subHeader);

          // Create a container for the sub-items
          const subItemsContainer = document.createElement("div");
          subItemsContainer.className = "checklist-subitems collapsible-content"; // Add collapsible-content class
          subSection.appendChild(subItemsContainer);

          // Add the sub-section to the parent
          parent.appendChild(subSection);

          // Add click event listener to the sub-header
          subHeader.addEventListener('click', function() {
            subItemsContainer.classList.toggle('collapsed');
          });

          // Recursively create the nested checklist
          createNestedChecklist(subItemsContainer, items[key], key);
        });
      }
    }

    // Create the checklist items
    createNestedChecklist(checklistElement, section.items);
  });

  // Progress bar functionality
  function updateProgress() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const totalItems = checkboxes.length;
    const checkedItems = document.querySelectorAll('input[type="checkbox"]:checked').length;

    const progressPercentage = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

    document.getElementById("progressBar").style.width = `${progressPercentage}%`;

    // Optional: Update text display (uncomment if you want to show numbers)
    document.getElementById("progressText").textContent = `${checkedItems} of ${totalItems} completed (${Math.round(
      progressPercentage
    )}%)`;
  }

  // Initialize progress bar
  updateProgress();
});
