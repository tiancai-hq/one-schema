import {ons} from "../src";
import {generateTypescriptInterface} from "../src/generators/typescript";

const createUserSchema1 = ons().object({
  full_name: ons().string().min(1).max(64).required(),
  email: ons().string().min(1).max(64).validator("email").required(),
  bio: ons().string().min(0).max(512),
  location: ons().object({
    city: ons().string(),
    state: ons().string(),
    country: ons().string().min(2).max(2),
  }),
  phone_number: ons().string().min(1).max(64).validator("mobile_number"),
  family_members: ons().arrayOf(ons().object({
    full_name: ons().string().required(),
    age: ons().float64().required()
  })),
  lucky_numbers: ons().arrayOf(ons().int32().required()).required(),
  age:ons().float64(),
  hair_color: ons().string().oneOf(["black", "brown", "red", "blond", "white", "grey", "other"]),
});

const createUserSchema1_RESULT = `interface s_createUser_sub_location {
  "city"?: string;
  "state"?: string;
  "country"?: string;
}

interface s_createUser_sub_family_members {
  "full_name": string;
  "age": number;
}

interface s_createUser {
  "full_name": string;
  "email": string;
  "bio"?: string;
  "location"?: s_createUser_sub_location;
  "phone_number"?: string;
  "family_members"?: s_createUser_sub_family_members[];
  "lucky_numbers": number[];
  "age"?: number;
  "hair_color"?: ("black" | "brown" | "red" | "blond" | "white" | "grey" | "other");
}`;


test("generateTypescriptDefinitions", () => {
  expect(generateTypescriptInterface(createUserSchema1, "s_createUser")).toBe(createUserSchema1_RESULT);
  expect(generateTypescriptInterface(JSON.parse(JSON.stringify(createUserSchema1)), "s_createUser")).toBe(createUserSchema1_RESULT);
});