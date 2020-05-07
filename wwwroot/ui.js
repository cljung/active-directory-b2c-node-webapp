// Select DOM elements to work with
const welcomeDiv = document.getElementById("welcomeMessage");
const signInButton = document.getElementById("signIn");
const signOutButton = document.getElementById('signOut');
const cardDiv = document.getElementById("card-div");
const apiButton = document.getElementById("callApi");
const profileButton = document.getElementById("seeProfile");
const profileDiv = document.getElementById("profile-div");
const popupDiv = document.getElementById("popup-div");
const respData = document.getElementById("responseData");


function showWelcomeMessage(account) {

    // Reconfiguring DOM elements
    cardDiv.classList.remove('d-none');
    welcomeDiv.innerHTML = `Welcome ${account.name}`;
    signInButton.classList.add('d-none');
    popupDiv.classList.add('d-none');
    signOutButton.classList.remove('d-none');
}
function signoutResetUI() {

  // Reconfiguring DOM elements
  cardDiv.classList.add('d-none');
  welcomeDiv.innerHTML = "";
  signInButton.classList.remove('d-none');
  popupDiv.classList.remove('d-none');
  signOutButton.classList.add('d-none');
}

function updateUI(data, endpoint) {
  console.log(endpoint + ' responded at: ' + new Date().toString());
  respData.innerHTML = JSON.stringify(data);
}