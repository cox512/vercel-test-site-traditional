// Global variable to store current user identification for JWT generation
let currentUserData = {
  user_id: null,
  email: null,
  name: null,
};

// Helper function to clean JWT payload
function cleanJWTPayload(data) {
  const cleaned = { ...data };
  Object.keys(cleaned).forEach((key) => {
    if (cleaned[key] === null || cleaned[key] === undefined) {
      delete cleaned[key];
    }
  });
  return cleaned;
}

// JWT Token Management
async function generateJWT(userData = {}) {
  try {
    const response = await fetch("/api/generate-jwt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error("Failed to generate JWT token:", error);
    return null;
  }
}

function clearBootForm() {
  document.getElementById("user_id").value = "";
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("company_id").value = "";
  document.getElementById("company").value = "";
}

function clearAttributesForm() {
  document.getElementById("attribute_name").value = "";
  document.getElementById("attribute_value").value = "";
}

function clearTrackEventForm() {
  document.getElementById("event_name").value = "";
  document.getElementById("metadata_name").value = "";
  document.getElementById("metadata_value").value = "";
}

function clearTourForm() {
  document.getElementById("tour_id").value = "";
}

async function performEmptyUpdate() {
  const updateData = {
    last_request_at: parseInt(new Date().getTime() / 1000),
  };

  // Include current user identification data for JWT generation
  const jwtUserData = cleanJWTPayload({
    ...currentUserData,
    ...updateData,
  });

  // Get JWT token for the update
  const token = await generateJWT(jwtUserData);
  if (token) {
    updateData.intercom_user_jwt = token;
  }

  Intercom("update", updateData);
}

function performShutdown() {
  Intercom("shutdown");

  // Clear stored user data
  currentUserData = {
    user_id: null,
    email: null,
    name: null,
  };
}

// Modal functions
function openModal(modalId) {
  document.getElementById(modalId).style.display = "block";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

// Close modal when clicking outside of it (except for tourModal)
window.onclick = function (event) {
  if (
    event.target.classList.contains("modal") &&
    event.target.id !== "tourModal"
  ) {
    event.target.style.display = "none";
  }
};

// Sidebar functionality
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const mainContent = document.getElementById("mainContent");
  const toggleBtn = document.getElementById("sidebarToggle");
  const overlay = document.getElementById("sidebarOverlay");

  const isOpen = sidebar.classList.contains("open");

  if (isOpen) {
    closeSidebar();
  } else {
    openSidebar();
  }
}

function openSidebar() {
  const sidebar = document.getElementById("sidebar");
  const mainContent = document.getElementById("mainContent");
  const toggleBtn = document.getElementById("sidebarToggle");
  let overlay = document.getElementById("sidebarOverlay");

  // Create overlay if it doesn't exist
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "sidebarOverlay";
    overlay.className = "sidebar-overlay";
    document.body.appendChild(overlay);

    // Add click event to overlay to close sidebar
    overlay.addEventListener("click", closeSidebar);
  }

  sidebar.classList.add("open");

  // Only shift content on desktop
  if (window.innerWidth > 768) {
    mainContent.classList.add("shifted");
    toggleBtn.classList.add("shifted");
  } else {
    // Show overlay on mobile/tablet
    overlay.classList.add("active");
  }
}

function closeSidebar() {
  const sidebar = document.getElementById("sidebar");
  const mainContent = document.getElementById("mainContent");
  const toggleBtn = document.getElementById("sidebarToggle");
  const overlay = document.getElementById("sidebarOverlay");

  sidebar.classList.remove("open");
  mainContent.classList.remove("shifted");
  toggleBtn.classList.remove("shifted");

  if (overlay) {
    overlay.classList.remove("active");
  }
}

// Handle window resize
function handleResize() {
  const sidebar = document.getElementById("sidebar");
  const mainContent = document.getElementById("mainContent");
  const toggleBtn = document.getElementById("sidebarToggle");
  const overlay = document.getElementById("sidebarOverlay");

  if (window.innerWidth > 768) {
    // Desktop behavior
    if (sidebar.classList.contains("open")) {
      mainContent.classList.add("shifted");
      toggleBtn.classList.add("shifted");
    }
    if (overlay) {
      overlay.classList.remove("active");
    }
  } else {
    // Mobile/tablet behavior
    mainContent.classList.remove("shifted");
    toggleBtn.classList.remove("shifted");
    if (sidebar.classList.contains("open") && overlay) {
      overlay.classList.add("active");
    }
  }
}

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Sidebar event listeners
  const sidebarToggle = document.getElementById("sidebarToggle");
  const closeSidebarBtn = document.getElementById("closeSidebar");

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", toggleSidebar);
  }

  if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener("click", closeSidebar);
  }

  // Handle window resize
  window.addEventListener("resize", handleResize);

  // Close sidebar when pressing Escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      const sidebar = document.getElementById("sidebar");
      if (sidebar && sidebar.classList.contains("open")) {
        closeSidebar();
      }
    }
  });

  // Tour form submission handler
  document.getElementById("tourForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const tourId = parseInt(document.getElementById("tour_id").value);

    if (tourId) {
      Intercom("startTour", tourId);
      clearTourForm();
      closeModal("tourModal");
    }
  });

  // Track event form submission handler
  document
    .getElementById("trackEventForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const eventName = document
        .getElementById("event_name")
        .value.toLowerCase();
      const metadataName = document
        .getElementById("metadata_name")
        .value.toLowerCase();
      const metadataValue = document.getElementById("metadata_value").value;

      // Check if event name is provided
      if (!eventName.trim()) {
        alert(
          "There was an error submitting the event - Event name is required"
        );
        return;
      }

      try {
        if (metadataName && metadataValue) {
          // If metadata is provided, create metadata object
          const metadata = {
            [metadataName]: metadataValue,
          };
          Intercom("trackEvent", eventName, metadata);
        } else {
          // If no metadata, just track the event
          Intercom("trackEvent", eventName);
        }

        // Show success message
        alert(`${eventName} has been successfully submitted`);

        // Clear the form after successful submission
        clearTrackEventForm();

        // Close the modal after successful submission
        closeModal("trackEventModal");
      } catch (error) {
        // Show error message
        alert(`There was an error submitting the ${eventName} event`);
      }
    });

  // User data form submission handler
  document
    .getElementById("userDataForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      // Get form data
      const formData = {
        user_id: document.getElementById("user_id").value,
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        company: {
          id: document.getElementById("company_id").value,
          name: document.getElementById("company").value,
        },
      };

      // Create boot data object, only including non-empty values
      const bootData = {
        app_id: window.intercomSettings?.app_id || "your-app-id-here",
      };

      // Only add user_id if it's not empty
      if (formData.user_id) {
        bootData.user_id = formData.user_id;
      }

      // Only add name if it's not empty
      if (formData.name) {
        bootData.name = formData.name;
      }

      // Only add email if it's not empty
      if (formData.email) {
        bootData.email = formData.email;
      }

      // Only add company if either id or name is present
      if (formData.company.id || formData.company.name) {
        bootData.company = {
          id: formData.company.id || undefined,
          name: formData.company.name || undefined,
        };
        // Remove undefined values from company object
        Object.keys(bootData.company).forEach(
          (key) =>
            bootData.company[key] === undefined && delete bootData.company[key]
        );
      }

      // Generate JWT token for the boot data
      const jwtUserData = cleanJWTPayload({
        user_id: bootData.user_id,
        email: bootData.email,
        name: bootData.name,
      });

      // Store current user data for future JWT generation
      currentUserData = {
        user_id: bootData.user_id || null,
        email: bootData.email || null,
        name: bootData.name || null,
      };

      const token = await generateJWT(jwtUserData);
      if (token) {
        bootData.intercom_user_jwt = token;
      }

      // Boot the user in Intercom
      Intercom("boot", bootData);
    });

  // Custom attributes form submission handler
  document
    .getElementById("customAttributesForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const attributeName = document.getElementById("attribute_name").value;
      const attributeValue = document.getElementById("attribute_value").value;

      if (!attributeName || !attributeValue) {
        alert("Please fill in both attribute name and value");
        return;
      }

      // Create an object with the custom attribute
      const customData = {
        [attributeName]: attributeValue,
      };

      // Include current user identification data for JWT generation
      const jwtUserData = cleanJWTPayload({
        ...currentUserData,
        ...customData,
      });

      // Generate JWT token for the update data
      const token = await generateJWT(jwtUserData);
      if (token) {
        customData.intercom_user_jwt = token;
      }

      // Update the user with the custom attribute
      Intercom("update", customData);
    });
});
