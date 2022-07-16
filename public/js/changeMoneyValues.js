const familySelect = document.getElementById("familySelect");
const familyHeader = document.getElementById("familyHeader");
const money = document.getElementById("money");
const card = document.getElementById("moneyCard");
const buttonSuccess = document.getElementById("addBtn");
const buttonDanger = document.getElementById("subtractBtn");
const addedMoney = document.getElementById("addedMoney");
const hiddenMoney = document.getElementById("hiddenMoney");
let moneyChange = 0;
familySelect.addEventListener("change", function () {
  if (familySelect.value == "") {
    card.setAttribute("hidden", "true");
  } else {
    let idAndBudget = familySelect.value.split(":");
    card.removeAttribute("hidden");
    familyHeader.innerHTML = `${
      familySelect.options[familySelect.selectedIndex].text
    } family has`;
    money.innerHTML = `$${idAndBudget[1]}`;
  }
  moneyChange = 0;
  addedMoney.setAttribute("hidden", "true");
  addedMoney.innerHTML = "";
});

buttonSuccess.addEventListener("click", function () {
  addedMoney.removeAttribute("hidden");
  moneyChange += 50;
  changeValue();
});
buttonDanger.addEventListener("click", function () {
  addedMoney.removeAttribute("hidden");
  moneyChange -= 50;
  changeValue();
});

function changeValue() {
  if (moneyChange < 0) {
    addedMoney.style.color = "rgb(170, 47, 47)";
    addedMoney.innerHTML = `${moneyChange}`;
  } else if (moneyChange == 0) {
    addedMoney.setAttribute("hidden", "true");
  } else {
    addedMoney.innerHTML = `+${moneyChange}`;
    addedMoney.style.color = "rgb(82, 161, 57)";
  }
  hiddenMoney.value = moneyChange;
}
