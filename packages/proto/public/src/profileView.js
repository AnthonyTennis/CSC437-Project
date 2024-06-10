import { prepareTemplate } from "./template.js";
import { loadJSON } from "./jsonLoader.js";
import { Auth, Observer } from "@calpoly/mustang";

export class ProfileViewElement extends HTMLElement {

  static template = prepareTemplate(`
    <template>
      <section>
        <div class="profile-header">
          <div class="profile-info">
            <h1 class="profile-name"><slot name="name"></slot></h1>
            <p class="profile-nickname"><slot name="nickname"></slot></p>
          </div>
        </div>
        <dl class="profile-details">
          <dt>Home</dt>
          <dd><slot name="home"></slot></dd>
        </dl>
      </section>
      <style>
        :host {
          display: block;
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 20px;
          border-radius: 8px;
        }
        .profile-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
        .avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          margin-right: 20px;
        }
        .profile-info {
          flex: 1;
        }
        .profile-name {
          font-size: 24px;
          margin: 0;
        }
        .profile-nickname {
          font-size: 16px;
          color: #888;
          margin: 0;
        }
        .profile-details {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .profile-details dt {
          font-weight: bold;
          margin-top: 10px;
        }
        .profile-details dd {
          margin: 0;
          margin-bottom: 10px;
        }
      </style>
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

    if (this.src && user.authenticated) {
      loadJSON(this.src, this, renderSlots, this.authorization);
    }
  });
}
}

export function renderSlots(json) {
  console.log("RenderingSlots:", json);
  const entries = Object.entries(json);
  const slot = ([key, value]) => {
    let type = typeof value;

    if (type === "object") {
      if (Array.isArray(value)) type = "array";
    }

    if (key === "avatar") {
      type = "avatar";
    }

    switch (type) {
      case "array":
        return `<ul slot="${key}">
          ${value.map((s) => `<li>${s}</li>`).join("")}
          </ul>`;
      case "avatar":
        return `<profile-avatar slot="${key}"
          color="${json.color}"
          src="${value}">
        </profile-avatar>`;
      default:
        return `<span slot="${key}">${value}</span>`;
    }
  };

  return entries.map(slot).join("\n");
}

customElements.define("profile-view", ProfileViewElement);