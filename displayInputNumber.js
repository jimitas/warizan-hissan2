export function displayInputNumber(randomNumberArray) {
  const [hijosu, josu] = randomNumberArray;
  document.getElementById("hijosu-input").value = hijosu;
  document.getElementById("josu-input").value = josu;
  document.getElementById("sho-input").value = null;
  document.getElementById("amari-input").value = null;
  
  document.getElementById("hijosu-input").disabled = true;
  document.getElementById("josu-input").disabled = true;
  document.getElementById("sho-input").disabled = false;
  document.getElementById("amari-input").disabled = false;
}
