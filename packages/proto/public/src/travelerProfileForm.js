import { prepareTemplate } from "./template.js";
import { Observer } from "@calpoly/mustang";

const template = document.createElement('template');
template.innerHTML = `
  <form autocomplete="off">
    <slot></slot>
    <button type="submit">Submit</button>
  </form>
  <style>
    form {
      display: grid;
      gap: 10px;
    }
  </style>
`;

export class TravelerProfileForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).appendChild(
      template.content.cloneNode(true)
    );
  }

  _authObserver = new Observer(this, "blazing:auth");

  get authorization() {
    return (
      this._user?.authenticated && {
        Authorization: `Bearer ${this._user.token}`
      }
    );
  }

  connectedCallback() {
    this._authObserver.observe(({ user }) => {
      this._user = user;
    });

    this.shadowRoot.querySelector('form').addEventListener('submit', this.handleSubmit.bind(this));
  }

  async handleSubmit(event) {
    event.preventDefault();

    const nameInput = this.querySelector('[name="name"]');
    const nicknameInput = this.querySelector('[name="nickname"]');
    const homeInput = this.querySelector('[name="home"]');
    const airportsInput = this.querySelector('[name="airports"]');

    console.log(nameInput);
    console.log(nicknameInput);
    console.log(homeInput);
    console.log(airportsInput);

    const json = {
      name: nameInput ? nameInput.value : null,
      nickname: nicknameInput ? nicknameInput.value : null,
      home: homeInput ? homeInput.value : null,
      airports: airportsInput ? airportsInput.value.split(',').map(airport => airport.trim()) : null
    };

    console.log("in handleSubmit");
    console.log(JSON.stringify(json));

    const response = await fetch(this.getAttribute('src'), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.authorization
      },
      body: JSON.stringify(json)
    });

    if (response.ok) {
      const updatedProfile = await response.json();
      this.updateForm(updatedProfile);
    }
  }

  updateForm(profile) {
    for (const key in profile) {
      const input = this.querySelector(`[name="${key}"]`);
      if (input) {
        input.value = Array.isArray(profile[key]) ? profile[key].join(', ') : profile[key];
      }
    }
  }
}

customElements.define("traveler-profile-form", TravelerProfileForm);