"use strict";
const USERS_URL = "https://jsonplaceholder.typicode.com/users";

let totalUsers = 0;
let userIDsToHide = [];

// Fetch users data from API
fetch(USERS_URL)
  .then((response) => response.json())
  .then((users) => {
    totalUsers = users.length;

    // Load all users retrived from API
    let sortKey = 'name';
    let sortedUsers = sortUsers(users, sortKey);
    let filteredUsers = sortedUsers.slice();
    
    loadUsersData(sortedUsers);

    // Register event listeners to the Search input
    const EVENTS_TO_LISTEN = ['change', 'input', 'paste'];
    const SEARCH_INPUT = document.querySelector('#search');
    const SORT_INPUT = document.querySelector('#sort');

    EVENTS_TO_LISTEN.forEach(event => {
      SEARCH_INPUT.addEventListener(event, ev => {
        const searchKey = ev.target.value;
        filteredUsers = filterUsers(sortedUsers, searchKey);

        // Update the users to show in the list
        loadUsersData(filteredUsers);
    })});

    // Register event listeners to the Sort input
    SORT_INPUT.addEventListener('change', ev => {
      sortKey = ev.target.value;
      sortedUsers = sortUsers(sortedUsers, sortKey);

      // Update the users to show in the list
      loadUsersData(sortedUsers);
    });
  })
  .catch(error => {
    console.error(error);
    loadUsersData([]);
  });

function loadUsersData(users) {
  // console.log("Users => ", users);
  // console.log('userIDsToHide => ', userIDsToHide);

  // Clear all existing items in the list
  const USERS_LIST = document.querySelector("#usersList");
  USERS_LIST.innerHTML = ''; // Reset <ul> innerHTML
  
  if(users.length > 0 && userIDsToHide.length < totalUsers) {
    users.forEach((user) => {
      const { id, name, username, email } = user;
  
      if(!userIDsToHide.includes(id)) {
        const LIST_TEMPLATE = `<li id="user-${id}" class="user"> <div class="user__avatar"></div><div class="user__info"> <div> <div class="user__name">${name}</div><div class="user__username">${username}</div></div><div> <a href="mailto:${email}" class="user__email">${email}</a> </div></div></li>`;
    
        let userListItem = document.createElement("LI");
        USERS_LIST.appendChild(userListItem);
        userListItem.outerHTML = LIST_TEMPLATE;

        document.querySelector(`#user-${id}`).addEventListener('click', event => {
          const emailLinkNode = document.querySelector(`#user-${id} .user__email`);
          if(event.target != emailLinkNode) {
            // Go to users details page with the user id parameter
            document.location.href = `userdetails.html?userId=${id}`;
          }
        });
      }
    });

  } else {
    USERS_LIST.innerHTML = '<li class="user">No user found.</li>';
  }
}

function filterUsers(users, searchKey) {
  userIDsToHide = [];
  searchKey = searchKey.trim().toLowerCase();

  return users.filter((user) => {
    let { id, name, username, email } = user;
    name = name.toLowerCase();
    username = username.toLowerCase();
    email = email.toLowerCase();

    const result = name.indexOf(searchKey) > -1 || username.indexOf(searchKey) > -1 || email.indexOf(searchKey) > -1;

    if(!result) {
      userIDsToHide.push(id);
    }
    
    return result;
  });
}

function sortUsers(users, sortKey) {
  sortKey = sortKey.trim().toLowerCase();

  return users.sort((userA, userB) => {
    let valueA = userA[sortKey].toLowerCase();
    let valueB = userB[sortKey].toLowerCase();

    if (valueA < valueB) {
      return -1;
    }

    if (valueA > valueB) {
      return 1;
    }
  
    // values must be equal
    return 0;
  });
}