import { ons } from "../src";

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
const userSchemaPlain = { "settings": { "type": "object", "schema": { "email": { "settings": { "type": "string", "validator": { "id": "email" } } }, "name": { "settings": { "type": "string", "min": 1, "required": true } }, "age": { "settings": { "type": "int32", "min": 0, "required": true } }, "height": { "settings": { "type": "float64", "max": 300 } }, "gender": { "settings": { "type": "bool" } }, "location": { "settings": { "type": "object", "schema": { "city": { "settings": { "type": "string", "required": true } } } } }, "schools": { "settings": { "type": "array", "arrayOf": { "settings": { "type": "object", "schema": { "schoolName": { "settings": { "type": "string" } }, "year": { "settings": { "type": "int32" } } } } }, "required": true } } } } }


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

const VALID_UUIDS = ["a09f283a-f0cc-4c0d-a062-915ca131d04f", "1c6673a0-f4b5-4d56-9c3a-615be3da6ccb", "cb6f810d-2dcb-4f58-a3d9-d69479cd26e1", "429c6647-4937-4281-8448-204e56419685", "3fdf48ca-7719-4bb8-84e1-b8f21ee3b1b5", "e22c38c2-870c-4ab9-b9e2-75607a763597", "aa96b813-68fe-4444-aa53-aa9537fef40a", "df8dc4db-9198-495b-90c9-a4c3168fc456", "44dadad8-2dee-4105-a10e-08c17358671c", "f54755d4-8cdb-4eab-b884-0584e4f8bd61"];
const INVALID_UUIDS = ["a09f283a-f0cc-4c0d-a062", "1c6673a0-f4b5-9c3a-615be3da6ccb", "cb6f810d-4f58-a3d9-d69479cd26e1", "-4937-4281-8448-204e56419685", "3fdf48ca-7719-4bb8-84e1-b8f21ee3b1b57", "e22c38c2------4ab9-b9e2-75607a763597", "hello", "", null, 123, "123", "df8zc4db-9198-495b-90c9-a4c3168fc456", "44dadad82dee4105a10e08c17358671c", "f54755d48cdb4eab"];


test("ons", () => {
  expect(JSON.stringify(ons())).toBe(JSON.stringify({ settings: {} }));
  expect(JSON.stringify(userSchema)).toBe(JSON.stringify(userSchemaPlain));
  expect(JSON.stringify(userSchema)).toBe(JSON.stringify(userSchema2));
  expect(JSON.stringify(userSchemaPlain)).toBe(JSON.stringify(userSchema2));
});

test("ons.validate", () => {
  expect(ons.validate(VALID_USER_1, userSchema).success).toBe(true);
  expect(ons.validate(INVALID_USER_1, userSchema).success).toBe(false);

  expect(JSON.stringify(ons.validate(INVALID_USER_1, userSchema))).toBe(JSON.stringify(ons.validate(INVALID_USER_1, userSchemaPlain)));
});
test("ons.validate2", () => {
  expect(ons.validate(VALID_USER_1, userSchema2).success).toBe(true);
  expect(ons.validate(INVALID_USER_1, userSchema2).success).toBe(false);

  expect(JSON.stringify(ons.validate(INVALID_USER_1, userSchema2))).toBe(JSON.stringify(ons.validate(INVALID_USER_1, userSchema)));
});
test("ons.validatePlain", () => {
  expect(ons.validate(VALID_USER_1, userSchemaPlain).success).toBe(true);
  expect(ons.validate(INVALID_USER_1, userSchemaPlain).success).toBe(false);

  expect(JSON.stringify(ons.validate(INVALID_USER_1, userSchema2))).toBe(JSON.stringify(ons.validate(INVALID_USER_1, userSchemaPlain)));
});



VALID_UUIDS.forEach(s => {
  test(`ons.test.uuid: ${s} is a valid uuid`, () => {
    expect(ons.validate(s, ons().string().uuid().required()).success).toBe(true)
    expect(ons.validate({ example: s }, ons().object({ example: ons().string().uuid().required() })).success).toBe(true)
  })
})
INVALID_UUIDS.forEach(s => {
  test(`ons.test.uuid: ${s} is NOT a valid uuid`, () => {
    expect(ons.validate(s, ons().string().uuid().required()).success).toBe(false)
    expect(ons.validate({ example: s }, ons().object({ example: ons().string().uuid().required() })).success).toBe(false)
  })
})
