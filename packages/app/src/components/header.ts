// src/components/header.ts
import { LitElement, css, html } from "lit";
import { Events } from "@calpoly/mustang";

export class HeaderElement extends LitElement {
  render() {
    return html`
      <header>
        <h1><i class="fa fa-compass"></i>Travel Concept Map</h1>
        <nav>
          <div class="dropdown">
            <button class="dropbtn"><h1>Menu</h1></button>
            <div class="dropdown-content">
              <a href="index.html">Home</a>
              <a href="/profile/traveler_profile.html">Traveler Profile</a>
              <a href="budget_details.html">Budget Details</a>
              <a href="destination_details.html">Destination Details</a>
              <a href="transportation_method.html">Transportation Method</a>
              <a href="login.html">Login</a>
              <a @click=${this.signOut}>Sign out</a>
              <a>
                <label @change=${this.toggleDarkMode}>
                  <input type="checkbox" autocomplete="off" />
                  Dark Mode
                </label>
              </a>
            </div>
          </div>
        </nav>
      </header>
    `;
  }

  signOut(event: MouseEvent) {
    event.preventDefault();
    Events.relay(event, "auth:message", ["auth/signout"]);
  }

  toggleDarkMode(event: Event) {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;
    Events.relay(event, "dark-mode", { checked });
  }

  static styles = css`
  /* Reset styles */
  a {
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  h1 {
    font-family: "Merriweather", "Times New Roman", serif;
    font-weight: 900;
    margin: 0;
  }

  /* Page styles */
  header {
    color: var(--text-color);
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 10px;
    position: relative;
  }

  header nav {
    display: flex;
    align-items: center;
  }

  header nav a {
    margin-left: 20px;
  }

  i.fa {
    color: var(--primary-color);
    padding-right: 0.4rem;
  }

  /* Dropdown styles */
  .dropdown {
    position: static;
  }

  .dropdown:hover .dropdown-content {
    display: block;
    width: fit-content;
  }

  .dropbtn {
    background-color: transparent;
    color: var(--text-color);
    font-size: 16px;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
    padding: 10px;
    position: relative;
    z-index: 2;
    top: auto;
    outline: 2px solid var(--dropdown-hover);
    border-radius: 3px;
  }

  .dropbtn:hover {
    background-color: var(--dropdown-hover);
    border-radius: 3px;
  }

  .dropdown-content {
    display: none;
    position: absolute;
    right: 0;
    background-color: var(--benday-color);
    min-width: fit-content;
    animation: slideDown 0.3s ease-in-out;
    margin-top: 0;
    text-align: center;
    border-radius: 3px;
    padding: 0;
  }

  .dropdown-content a {
    color: white;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    transition: background-color 0.3s ease;
    margin: 0;
  }

  .dropdown-content a:hover {
    background-color: var(--primary-color);
    border-radius: 3px;
    margin: 0;
  }

  .dropdown:hover .dropdown-content {
    display: block;
  }

  @keyframes slideDown {
    0% {
      transform: translateY(-10px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;
}