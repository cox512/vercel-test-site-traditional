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

function performEmptyUpdate() {
  Intercom("update", {
    last_request_at: parseInt(new Date().getTime() / 1000),
  });
}

function performShutdown() {
  Intercom("shutdown");
}

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Tour form submission handler
  document.getElementById("tourForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const tourId = parseInt(document.getElementById("tour_id").value);

    if (tourId) {
      Intercom("startTour", tourId);
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
    });

  // User data form submission handler
  document
    .getElementById("userDataForm")
    .addEventListener("submit", function (e) {
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
        app_id: "<%= env.INTERCOM_APP_ID %>",
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

      // Boot the user in Intercom
      Intercom("boot", bootData);
    });

  // Custom attributes form submission handler
  document
    .getElementById("customAttributesForm")
    .addEventListener("submit", function (e) {
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

      // Update the user with the custom attribute
      Intercom("update", customData);
    });
});
