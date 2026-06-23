export function bindTabs(storage = null) {
  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      activateTab(button.dataset.tab);
      storage?.setSetting("lastTab", button.dataset.tab);
    });
  });
  return storage?.getSetting("lastTab", "practice").then((tab) => {
    if (document.getElementById(tab)) activateTab(tab);
  });
}

function activateTab(tab) {
  document.querySelectorAll("[data-tab]").forEach((item) => item.classList.toggle("is-active", item.dataset.tab === tab));
  document.querySelectorAll(".workspace").forEach((panel) => panel.classList.toggle("is-active", panel.id === tab));
}
