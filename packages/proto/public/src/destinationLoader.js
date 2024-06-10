function loadDestination(url, container) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            container.innerHTML = html;
        })
        .catch(error => {
            console.error('Error loading the destination details:', error);
            container.innerHTML = "<p>Error loading details. Please try again later.</p>";
        });
}
