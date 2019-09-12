import {ons, validateObject } from "../src";


const userSchema = ons()
  .type("object")
  .schema({
    email: ons()
      .string()
      .validator({ id: "email" }),
    name: ons()
      .string()
      .min(1)
      .required(),
    age: ons()
      .int32()
      .min(0)
      .required(),
    height: ons()
      .float64()
      .max(300),
    gender: ons().bool(),
    location: ons()
      .object()
      .schema({
        city: ons()
          .string()
          .required()
      }),
    schools: ons()
      .array()
      .arrayOf({
        schoolName: ons().string(),
        year: ons().int32()
      })
      .required()
  });
const userSchemaPlain = {"settings":{"type":"object","schema":{"email":{"settings":{"type":"string","validator":{"id":"email"}}},"name":{"settings":{"type":"string","min":1,"required":true}},"age":{"settings":{"type":"int32","min":0,"required":true}},"height":{"settings":{"type":"float64","max":300}},"gender":{"settings":{"type":"bool"}},"location":{"settings":{"type":"object","schema":{"city":{"settings":{"type":"string","required":true}}}}},"schools":{"settings":{"type":"array","arrayOf":{"settings":{"type":"object","schema":{"schoolName":{"settings":{"type":"string"}},"year":{"settings":{"type":"int32"}}}}},"required":true}}}}};

const VALID_USER_1 = {
  email: "hello@hello.com",
  name: "min",
  location: { city: "chicago" },
  age: 3,
  height: 180.3,
  gender: false,
  schools: [
    { schoolName: "hi", year: 2001 },
    { schoolName: "yoho", year: 1993 }
  ]
};
const INVALID_USER_1 = {
  email: "hello@hello.com",
  name: "min",
  location: { city: "chicago" },
  age: 3,
  height: 180.3,
  gender: false,
  schools: [
    { schoolName: 1337, year: 2001 },
    { schoolName: "yoho", year: 1993 }
  ]
};
test("ons", () => {
  expect(JSON.stringify(ons())).toBe(JSON.stringify({settings:{}}));
  expect(JSON.stringify(userSchema)).toBe(JSON.stringify(userSchemaPlain));
});

test("validateObject", () => {
  expect(validateObject(VALID_USER_1, userSchema).validated).toBe(true);
  expect(validateObject(VALID_USER_1, userSchemaPlain).validated).toBe(true);

  expect(validateObject(INVALID_USER_1, userSchema).validated).toBe(false);
  expect(validateObject(INVALID_USER_1, userSchemaPlain).validated).toBe(false);

  expect(JSON.stringify(validateObject(INVALID_USER_1, userSchema))).toBe(JSON.stringify(validateObject(INVALID_USER_1, userSchemaPlain)));
});