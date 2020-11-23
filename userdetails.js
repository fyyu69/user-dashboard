"use strict";
// Get the user ID from the URL
const ID_PATTERN = /userId=\d*/g;
const urlQuery = document.location.search;
const matchedStr = urlQuery.match(ID_PATTERN)[0];
const userId = matchedStr.slice('userId='.length);

const USER_DETAILS_URL = `http://jsonplaceholder.typicode.com/users/${userId}`;
const POSTS_URL = `http://jsonplaceholder.typicode.com/posts?userId=${userId}`;

// Fetch users data from API
fetch(USER_DETAILS_URL)
  .then((response) => response.json())
  .then((user) => {
    let { 
      name, 
      username, 
      email,
      phone,
      website,
      address,
      company 
    } = user;
    // console.log("User => ", user);
    
    // Convert a tel-link phone number format, +[country_code][phone_number][extension]
    // Check if the phone number has extension
    let formatedPhone = '';
    let extensionIndex = phone.indexOf('x');
    let phoneExtension = extensionIndex > -1 ? phone.slice(extensionIndex + 1).trim() : null;
    let phoneNumStr;
    if(extensionIndex > -1) {
      phoneNumStr = phone.slice(0, extensionIndex).trim();
    } else {
      phoneNumStr = phone;
    }
    let phoneNumsOnly = phoneNumStr.match(/\d/g).join('');

    // If phone numbers have more than 10 digits, includes country code
    if(phoneNumsOnly.length > 10) {
      formatedPhone = '+' + phoneNumsOnly;
    } else {
      formatedPhone = phoneNumsOnly;
    }

    // Add extension if necessary
    if(phoneExtension) {
      formatedPhone += 'p' + phoneExtension;
    }

    // Create HTML elements template to hold retrived values
    const CONTACT_INFO_TEMPLATE = `<p>Username: ${username}</p><p>Email: <a href="mailto:${email}" class="link">${email}</a></p><p>Phone: <a href="tel:${formatedPhone}">${phone}</a></p><p>Website: <a href="http://${website}" target="_blank">${website}</a></p>`;

    const ADDRESS_TEMPLATE = `<span class="nowrap">${address.suite}</span> <span class="nowrap">${address.street},</span> <span class="nowrap">${address.city},</span> <span class="nowrap">${address.zipcode}</span>`;

    const COMPANY_TEMPLATE = `<p>${company.name}</p><p>${company.bs}</p><p class="italic">"${company.catchPhrase}"</p>`;

    // Load HTML elements into the page's HTML code
    document.querySelectorAll('.header__username').forEach(elmt => {
      elmt.innerHTML = name;
    });
    document.querySelector('#details__contactInfo').innerHTML = CONTACT_INFO_TEMPLATE;
    document.querySelector('#details__address').innerHTML = ADDRESS_TEMPLATE;
    document.querySelector('#details__company').innerHTML = COMPANY_TEMPLATE;

    // For larger screens, set details boxes to the same height
    if(window.innerWidth > 480) {
      equalizeHeight('.details__container');
    } else {
      resetHeight('.details__container');
    }
  });

// Fetch posts data from API
fetch(POSTS_URL)
  .then((response) => response.json())
  .then((posts) => {
    // console.log("Posts => ", posts);
    
    posts.forEach(post => {
      let { id, title, body } = post;

      const POST_TEMPLATE = `<div id="post-${id}" class="post__container"><h3>${title}</h3><p>${body}</p></div>`;

      let postsContainer = document.createElement('DIV');
      postsContainer.id = `post-${id}`;
      postsContainer.classList.add("post__container");

      
      let postTitle = document.createElement('H3');
      let postBody = document.createElement('P');
      postTitle.innerHTML = title;
      postBody.innerHTML = body;

      postsContainer.appendChild(postTitle);
      postsContainer.appendChild(postBody);
      document.querySelector('#posts__wrapper').appendChild(postsContainer);
    });
    
    // For larger screens, set details boxes to the same height
    if(window.innerWidth > 480) {
      equalizeHeight('.post__container');
    } else {
      resetHeight('.post__container');
    }
  });

// Create a listener for window resizing events
let isWindowResizing = false;
window.addEventListener('resize', function() {
  isWindowResizing = true;
});

setInterval(function() {
  if(isWindowResizing) {
    isWindowResizing = false;

    if(window.innerWidth > 480) {
      equalizeHeight('.details__container');
      equalizeHeight('.post__container');
    } else {
      resetHeight('.details__container');
      resetHeight('.post__container');
    }
  }
}, 250);

function equalizeHeight(selector) {
  if(!selector) return; // If selector is an empty string, return.

  const targetElmts = document.querySelectorAll(selector);
  const countTargets = targetElmts.length;

  if(!countTargets) return; // If no targets found, return.

  // Reset all inline height values of targets
  resetHeight(selector);

  // Find Max height value among targets
  let maxHeight = 0;
  
  targetElmts.forEach(elmt => {
    let elmtHeight = elmt.offsetHeight;
    if(elmtHeight > maxHeight) {
      maxHeight = elmtHeight;
    }
  });

  // Set all target elements with the max height value
  targetElmts.forEach(elmt => {
    elmt.style.height = maxHeight + 'px';
  });
}

// A function for reseting inline style for height
function resetHeight(selector) {
  document.querySelectorAll(selector).forEach(elmt => {
    elmt.style.height = '';
  });
}