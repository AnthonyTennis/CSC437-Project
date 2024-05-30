import { Schema, Model, Document, model } from "mongoose";
import { Profile } from "../models/profile";

// // in-memory DB
// let profiles: Array<Profile> = [
//   {
//     id: "blaze",
//     name: "Blaze Pasquale",
//     nickname: undefined,
//     home: "Oakland, CA",
//     airports: ["SFO", "OAK", "SJC"],
//     color: "#8A81BE",
//     avatar: "/data/avatars/Blaze Pasquale.png"
//   }
//   // add a few more profile objects here
// ];

const ProfileSchema = new Schema<Profile>(
  {
    id: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    nickname: { type: String, trim: true },
    home: { type: String, trim: true },
    airports: [String],
    avatar: String,
    color: String,
  },
  { collection: "user_profiles" }
);

const ProfileModel = model<Profile>("Profile", ProfileSchema);

function index(): Promise<Profile[]> {
  return ProfileModel.find();
}

function get(id: String): Promise<Profile> {
  console.log(`get(${id})`);
  return ProfileModel.find({ id })
    .then((list) => list[0])
    .catch((err) => {
      throw `${id} Not Found`;
    });
}

function create(profile: Profile): Promise<Profile> {
  const p = new ProfileModel(profile);
  return p.save();
}

function update(id: String, profile: Partial<Profile>): Promise<Profile> {
  return ProfileModel.findOneAndUpdate({ id }, profile, { new: true })
    .then((updated) => {
      if (!updated) throw `${id} not updated`;
      else return updated as Profile;
    });
}

export default { index, get, create, update };
