/*
    File: main.js
    Purpose: Demonstrates DOM manipulation and event handling
    Course: IST 256 Programming for the Web | Mr. Ri 
*/

document.addEventListener("DOMContentLoaded", function(){
    
    const form = document.querySelector("form");
    
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        alert("Thank you! Your message has been sent.");
        form.reset();
    });
});