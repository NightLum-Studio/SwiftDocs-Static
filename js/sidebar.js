// Sidebar open/close helpers and swipe gestures.

function openSidebar() {
  document.body.classList.add("sidebar-open");
}

function closeSidebar() {
  document.body.classList.remove("sidebar-open");
}

function initSwipeGestures() {
  let startX = 0;
  let startY = 0;
  let tracking = false;

  document.addEventListener("touchstart", event => {
    if (!event.touches || event.touches.length !== 1) return;
    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    tracking = true;
  }, { passive: true });

  document.addEventListener("touchend", event => {
    if (!tracking || !event.changedTouches || event.changedTouches.length !== 1) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    tracking = false;

    if (Math.abs(deltaX) < 60 || Math.abs(deltaX) < Math.abs(deltaY)) return;

    const isSmallScreen = window.matchMedia("(max-width: 1024px)").matches;
    if (!isSmallScreen) return;

    if (deltaX > 0 && startX < 40) {
      openSidebar();
    } else if (deltaX < 0) {
      closeSidebar();
    }
  }, { passive: true });
}

window.openSidebar = openSidebar;
window.closeSidebar = closeSidebar;
window.initSwipeGestures = initSwipeGestures;
