import { prepareTemplate } from "./template.js";
import { loadJSON } from "./jsonLoader.js";
import { Auth, Observer } from "@calpoly/mustang";

export class ProfileViewElement extends HTMLElement {

  static template = prepareTemplate(`
    <template>
      <section>
        <img slot="avatar" />
        <h1><slot name="name"></slot></h1>
        <dl>
          <dt>Home</dt>
          <dd><slot name="home"></slot></dd>
          <dt>Nickname</dt>
          <dd><slot name="nickname"></slot></dd>
          <dt>Airports</dt>
          <dd><slot name="airports"></slot></dd>
        </dl>
      </section>
      <style>${ProfileViewElement.styles}</style>
    </template>
  `);

  get src() {
    return this.getAttribute("src");
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" }).appendChild(
      ProfileViewElement.template.cloneNode(true)
    );
  }

  _authObserver = new Observer(this, "blazing:auth");

  get authorization() {
    console.log("Authorization for user, ", this._user);
    return (
      this._user?.authenticated && {
        Authorization: `Bearer ${this._user.token}`
      }
    );
  }

  connectedCallback() {
    this._authObserver.observe(({ user }) => {
      this._user = user;

      if (this.src) {
        loadJSON(this.src, this, renderSlots, this.authorization);
      }
    });
  }
}

export function renderSlots(json) {
  const entries = Object.entries(json);
  const slot = ([key, value]) => {
    if (key === "avatar") {
      return `<img slot="${key}" src="${value}" />`;
    } else if (Array.isArray(value)) {
      return `
        <ul slot="${key}">
          ${value.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      `;
    } else {
      return `<span slot="${key}">${value}</span>`;
    }
  };

  return entries.map(slot).join("\n");
}

customElements.define("profile-view", ProfileViewElement);