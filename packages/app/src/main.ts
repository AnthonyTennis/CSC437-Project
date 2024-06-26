import { Auth, Store, define } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model, init } from "./model";
import update from "./update";
import { TourViewElement } from "./views/tour-view";
import { BlazingHeaderElement } from "./components/blazing-header";

define({
  "mu-auth": Auth.Provider,
  "mu-store": class AppStore extends Store.Provider<
    Model,
    Msg
  > {
    constructor() {
      super(update, init, "blazing:auth");
    }
  },
  "blazing-header": BlazingHeaderElement,
  "tour-view": TourViewElement
});