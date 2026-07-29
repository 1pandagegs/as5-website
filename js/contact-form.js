(function () {
  "use strict";

  var fieldNames = ["name", "email", "phone", "company", "inquiryType", "project", "timeline", "message"];

  function setFieldError(form, name, message) {
    var errorEl = form.querySelector('[data-error-for="' + name + '"]');
    if (errorEl) {
      errorEl.textContent = message || "";
      errorEl.hidden = !message;
    }
    var inputEl = form.querySelector('[name="' + name + '"]');
    if (inputEl) {
      inputEl.setAttribute("aria-invalid", message ? "true" : "false");
    }
  }

  function validate(values) {
    var errors = {};
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!values.name || values.name.trim().length < 2) {
      errors.name = "Please enter your full name.";
    }
    if (!values.email || !emailPattern.test(values.email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!values.message || values.message.trim().length < 10) {
      errors.message = "Please tell us a bit more about your inquiry.";
    }
    return errors;
  }

  function wireForm(form) {
    var widget = form.closest("[data-inquiry-widget]") || form.parentElement;
    var successEl = widget.querySelector("[data-success]");
    var serverMessageEl = form.querySelector("[data-server-message]");

    var projectParam = new URLSearchParams(window.location.search).get(
      "project"
    );
    if (projectParam) {
      var projectSelect = form.querySelector('select[name="project"]');
      if (projectSelect) {
        var hasOption = Array.prototype.some.call(
          projectSelect.options,
          function (option) {
            return option.value === projectParam;
          }
        );
        if (hasOption) projectSelect.value = projectParam;
      }
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (serverMessageEl) serverMessageEl.hidden = true;

      var formData = new FormData(form);
      var values = {
        name: String(formData.get("name") || ""),
        email: String(formData.get("email") || ""),
        phone: String(formData.get("phone") || "") || undefined,
        company: String(formData.get("company") || "") || undefined,
        inquiryType: String(formData.get("inquiryType") || "") || undefined,
        project: String(formData.get("project") || "") || undefined,
        timeline: String(formData.get("timeline") || "") || undefined,
        message: String(formData.get("message") || ""),
      };

      var errors = validate(values);
      fieldNames.forEach(function (field) {
        setFieldError(form, field, errors[field]);
      });
      if (Object.keys(errors).length > 0) return;

      var submitButton = form.querySelector('button[type="submit"]');
      var originalLabel = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = "Sending…";

      fetch("/api/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
        .then(function (response) {
          if (!response.ok) throw new Error("Request failed");
          form.hidden = true;
          if (successEl) successEl.hidden = false;
        })
        .catch(function () {
          if (serverMessageEl) {
            serverMessageEl.textContent =
              "Something went wrong. Please try again or email us directly.";
            serverMessageEl.hidden = false;
          }
        })
        .finally(function () {
          submitButton.disabled = false;
          submitButton.textContent = originalLabel;
        });
    });
  }

  Array.prototype.forEach.call(
    document.querySelectorAll("[data-inquiry-form]"),
    wireForm
  );
})();
