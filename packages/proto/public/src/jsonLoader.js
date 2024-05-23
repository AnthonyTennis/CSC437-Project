import { addFragment } from "./htmlLoader.js";
import { prepareTemplate } from "./template.js";
import { relayEvent } from "./relayEvent.js";

export class JsonObjectElement extends HTMLElement {
  static template = prepareTemplate(`<template>
      <dl>
        <slot></slot>
      </dl>
      <style>
        dl {
          display: grid;
          grid-template-columns: 1fr 3fr;
        }
        ::slotted(dt) {
          color: var(--color-accent);
          grid-column-start: 1;
        }
        ::slotted(dd) {
          grid-column-start: 2;
        }
      </style>
    </template>`);

  get dl() {
    return this.shadowRoot.querySelector("dl");
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" }).appendChild(
      JsonObjectElement.template.cloneNode(true)
    );
  }

  connectedCallback() {
    console.log('we are trying to connect JSON');
    const src = this.getAttribute("src");
    const open = this.hasAttribute("open");

    if (open) loadJSON(src, this, renderJSON);

    this.addEventListener("json-object:open", () =>
      loadJSON(src, this, renderJSON)
    );

    const anchor = this.querySelector("a");
    anchor.addEventListener("click", (event) => {
      relayEvent(event, "json-object:open");
    });
  }
}

customElements.define("json-object", JsonObjectElement);

export function loadJSON(src, container, render) {
  console.log('we are trying to load JSON');
  container.replaceChildren();
  fetch(src)
    .then((response) => {
      if (response.status !== 200) {
        throw `Status: ${response.status}`;
      }
      return response.json();
    })
    .then((json) => addFragment(render(json), container))
    .catch((error) =>
      addFragment(
        `<dt class="error">Error</dt>
         <dd>${error}</dd>
         <dt>While Loading</dt>
         <dd>${src}</dd>
        `,
        container
      )
    );
}

function renderJSON(json) {
  console.log('we are trying to render JSON');
  const entries = Object.entries(json);
  const dtdd = ([key, value]) => {
    if (Array.isArray(value)) {
      return `
        <dt>${key}</dt>
        <dd>${value.join(", ")}</dd>
      `;
    } else if (typeof value === "object") {
      return `
        <dt>${key}</dt>
        <dd>${JSON.stringify(value)}</dd>
      `;
    } else {
      return `
        <dt>${key}</dt>
        <dd>${value}</dd>
      `;
    }
  };
  return entries.map(dtdd).join("\n");
}