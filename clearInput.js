export function clearInput() {
  document.getElementById("hijosu-input").value = null;
  document.getElementById("josu-input").value = null;
  document.getElementById("sho-input").value = null;
  document.getElementById("amari-input").value = null;
  
  document.getElementById("hijosu-input").disabled = false;
  document.getElementById("josu-input").disabled = false;
  document.getElementById("sho-input").disabled = true;
  document.getElementById("amari-input").disabled = true;
}
