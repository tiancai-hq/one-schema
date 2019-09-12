import {ons, validateObject } from "../src";

const userSchema2 = ons().object({
  email: ons().string().validator("email"),
  name: ons().string().min(1).required(),
  age: ons().int32().min(0).required(),
  height: ons().float64().max(300),
  gender: ons().bool(),
  location: ons().object({
    city: ons().string().required(),
  }),
  schools: ons().arrayOf(ons().object({
    schoolName: ons().string(),
    year: ons().int32()
  })).required(),
})

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
    location: ons().object().schema({
      city: ons().string()
        .required()
    }),
    schools: ons()
      .array()
      .arrayOf(ons().object({
        schoolName: ons().string(),
        year: ons().int32() 
      }))
      .required()
  });
const userSchemaPlain = {"settings":{"type":"object","schema":{"email":{"settings":{"type":"string","validator":{"id":"email"}}},"name":{"settings":{"type":"string","min":1,"required":true}},"age":{"settings":{"type":"int32","min":0,"required":true}},"height":{"settings":{"type":"float64","max":300}},"gender":{"settings":{"type":"bool"}},"location":{"settings":{"type":"object","schema":{"city":{"settings":{"type":"string","required":true}}}}},"schools":{"settings":{"type":"array","arrayOf":{"settings":{"type":"object","schema":{"schoolName":{"settings":{"type":"string"}},"year":{"settings":{"type":"int32"}}}}},"required":true}}}}}


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
  expect(JSON.stringify(userSchema)).toBe(JSON.stringify(userSchema2));
  expect(JSON.stringify(userSchemaPlain)).toBe(JSON.stringify(userSchema2));
});

test("validateObject", () => {
  expect(validateObject(VALID_USER_1, userSchema).success).toBe(true);
  expect(validateObject(INVALID_USER_1, userSchema).success).toBe(false);

  expect(JSON.stringify(validateObject(INVALID_USER_1, userSchema))).toBe(JSON.stringify(validateObject(INVALID_USER_1, userSchemaPlain)));
});
test("validateObject2", () => {
  expect(validateObject(VALID_USER_1, userSchema2).success).toBe(true);
  expect(validateObject(INVALID_USER_1, userSchema2).success).toBe(false);

  expect(JSON.stringify(validateObject(INVALID_USER_1, userSchema2))).toBe(JSON.stringify(validateObject(INVALID_USER_1, userSchema)));
});
test("validateObjectPlain", () => {
  expect(validateObject(VALID_USER_1, userSchemaPlain).success).toBe(true);
  expect(validateObject(INVALID_USER_1, userSchemaPlain).success).toBe(false);

  expect(JSON.stringify(validateObject(INVALID_USER_1, userSchema2))).toBe(JSON.stringify(validateObject(INVALID_USER_1, userSchemaPlain)));
});