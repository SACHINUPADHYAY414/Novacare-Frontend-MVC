
// tooltipHandler.js
export function ErrorTooltipHandler() {
  const elements = document.getElementsByClassName("is-invalid");

  Array.from(elements).forEach((element, index) => {
    const createTooltip = (event) => {
      const parentElement = event.target.closest("div");
      const errorSpan = parentElement?.querySelector(".error-icon");
      const tooltipText =
        errorSpan?.getAttribute("data-error-message") || "This field is required.";

      // Create tooltip element
      const tooltip = document.createElement("div");
      tooltip.innerText = tooltipText;
      tooltip.style.position = "absolute";
      tooltip.style.backgroundColor = "#dc3545";
      tooltip.style.color = "white";
      tooltip.style.padding = "4px 8px";
      tooltip.style.borderRadius = "4px";
      tooltip.style.fontSize = "0.875rem";
      tooltip.style.whiteSpace = "nowrap";
      tooltip.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
      tooltip.style.zIndex = "10";

      document.body.appendChild(tooltip);

      // Position tooltip
      const rect = event.target.getBoundingClientRect();
      const tooltipWidth = tooltip.offsetWidth;
      let top = rect.top + window.scrollY + rect.height;
      let left = rect.right + 5;

      const viewportWidth = window.innerWidth;
      if (left + tooltipWidth > viewportWidth) {
        left = rect.left - tooltipWidth - 5;
        left = left + 30
      } else left = left - 30

      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;

      tooltip.setAttribute("id", `dynamic-tooltip-${index}`);
    };

    const removeTooltip = () => {
      const tooltip = document.querySelector(`#dynamic-tooltip-${index}`);
      if (tooltip) tooltip.remove();
    };

    // Add listeners
    element.addEventListener("mouseenter", createTooltip);
    element.addEventListener("mouseleave", removeTooltip);

    // Store cleanup function for the element
    element.cleanupTooltip = () => {
      element.removeEventListener("mouseenter", createTooltip);
      element.removeEventListener("mouseleave", removeTooltip);
      removeTooltip();
    };
  });
}

export function removeErrorTooltips() {
  const elements = document.getElementsByClassName("is-invalid");

  Array.from(elements).forEach((element) => {
    if (element.cleanupTooltip) {
      element.cleanupTooltip();
    }
  });
}
