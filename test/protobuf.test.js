import {ons} from "../src";
import {generateProtobuf} from "../src/generators/protobuf";

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
  })).required(),
  lucky_numbers: ons().arrayOf(ons().int32().required()).required(),
  age:ons().float64()
});
const createUserSchema1_RESULT = `message CreateUser {
  string full_name = 1;
  string email = 2;
  google.protobuf.StringValue bio = 3;
  message CreateUser_location {
    google.protobuf.StringValue city = 1;
    google.protobuf.StringValue state = 2;
    google.protobuf.StringValue country = 3;
  }
  CreateUser_location location = 4;
  google.protobuf.StringValue phone_number = 5;
  message CreateUser_family_members {
    string full_name = 1;
    double age = 2;
  }
  repeated CreateUser_family_members family_members = 6;
  repeated int32 lucky_numbers = 7;
  google.protobuf.DoubleValue age = 8;
}`;


test("generateProtobuf", () => {
  expect(generateProtobuf(createUserSchema1, "CreateUser").definitions).toBe(createUserSchema1_RESULT);
  expect(generateProtobuf(JSON.parse(JSON.stringify(createUserSchema1)), "CreateUser").definitions).toBe(createUserSchema1_RESULT);
});