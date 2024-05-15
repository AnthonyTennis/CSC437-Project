function toggleDarkMode(event) {
    // Convert the localStorage string value to boolean
    var isDarkMode = localStorage.getItem('darkMode') === 'true';
  
    // Determine the dark mode state either from the event or localStorage
    if (isDarkMode || event.detail) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'true');
        console.log('Dark mode is on');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'false');
        console.log('Dark mode is off');
    }
}

function relayEvent(event) {
    const isChecked = event.target.checked;
  
    // Update the local storage right here based on the checkbox state
    localStorage.setItem('darkMode', isChecked.toString());

    const newEvent = new CustomEvent('darkmode:toggle', {
        bubbles: true,
        detail: isChecked
    });
    event.target.dispatchEvent(newEvent);
    event.stopPropagation();
}

document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.addEventListener('change', relayEvent);
    document.body.addEventListener('darkmode:toggle', toggleDarkMode);

    // Check the state of dark mode on page load and update the checkbox state accordingly
    var isDarkMode = localStorage.getItem('darkMode') === 'true';
    darkModeToggle.checked = isDarkMode;
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
});
