export function tabSwitch() {
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      alert("You are cheating!");
    }
  });
}
