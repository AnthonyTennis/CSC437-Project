import { Profile } from "../models/profile";

// in-memory DB
let profiles: Array<Profile> = [
  {
    id: "blaze",
    name: "Blaze Pasquale",
    nickname: undefined,
    home: "Oakland, CA",
    airports: ["SFO", "OAK", "SJC"],
    color: "#8A81BE",
    avatar: "/data/avatars/Blaze Pasquale.png"
  }
  // add a few more profile objects here
];

export function get(id: String): Profile | undefined {
  return profiles.find((t) => t.id === id);
}

export default { get };