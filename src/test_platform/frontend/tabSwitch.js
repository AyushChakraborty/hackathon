export function tabSwitch(){
  console.log("tab monitoring started")
document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    alert("You are cheating!");
  }
});
}
