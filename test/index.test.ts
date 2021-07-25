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
  onlyAllowFalse: ons().bool().oneOf([false])
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
      .required(),
    onlyAllowFalse: ons().bool().oneOf([false])
  });
const userSchemaPlain: any = { "settings": { "type": "object", "schema": { "email": { "settings": { "type": "string", "validator": { "id": "email" } } }, "name": { "settings": { "type": "string", "min": 1, "required": true } }, "age": { "settings": { "type": "int32", "min": 0, "required": true } }, "height": { "settings": { "type": "float64", "max": 300 } }, "gender": { "settings": { "type": "bool" } }, "location": { "settings": { "type": "object", "schema": { "city": { "settings": { "type": "string", "required": true } } } } }, "schools": { "settings": { "type": "array", "arrayOf": { "settings": { "type": "object", "schema": { "schoolName": { "settings": { "type": "string" } }, "year": { "settings": { "type": "int32" } } } } }, "required": true } }, "onlyAllowFalse": { "settings": { "type": "bool", "oneOf": [false] } } } } };



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
  ],
  onlyAllowFalse: false
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
  ],
  onlyAllowFalse: false
};

const VALID_UUIDS = ["a09f283a-f0cc-4c0d-a062-915ca131d04f", "1c6673a0-f4b5-4d56-9c3a-615be3da6ccb", "cb6f810d-2dcb-4f58-a3d9-d69479cd26e1", "429c6647-4937-4281-8448-204e56419685", "3fdf48ca-7719-4bb8-84e1-b8f21ee3b1b5", "e22c38c2-870c-4ab9-b9e2-75607a763597", "aa96b813-68fe-4444-aa53-aa9537fef40a", "df8dc4db-9198-495b-90c9-a4c3168fc456", "44dadad8-2dee-4105-a10e-08c17358671c", "f54755d4-8cdb-4eab-b884-0584e4f8bd61"];
const INVALID_UUIDS = ["a09f283a-f0cc-4c0d-a062", "1c6673a0-f4b5-9c3a-615be3da6ccb", "cb6f810d-4f58-a3d9-d69479cd26e1", "-4937-4281-8448-204e56419685", "3fdf48ca-7719-4bb8-84e1-b8f21ee3b1b57", "e22c38c2------4ab9-b9e2-75607a763597", "hello", "", null, 123, "123", "df8zc4db-9198-495b-90c9-a4c3168fc456", "44dadad82dee4105a10e08c17358671c", "f54755d48cdb4eab"];


const companySchema = ons().object({
  name: ons().string().min(1).max(64),
  employees: ons().arrayOf(ons().object({
    name: ons().string().required(),
    age: ons().int32().required(),
    hairColor: ons().string(),
  }).required()).required().min(1).max(4)
});

const VALID_COMPANY_1 = {
  name: "Acme LLC",
  employees: [
    {name: "Ted Smith", age: 28, hairColor: "black"},
    {name: "Sandra Wang", age: 26, hairColor: "black"},
    {name: "Johnny Cash", age: 30, hairColor: "brown"}
  ]
};

const INVALID_COMPANY_1 = {
  name: "Acme LLC",
  employees: [
    {name: "Ted Smith", age: 28, hairColor: "black"},
    {name: "Sandra Wang", age: 26, hairColor: "black"},
    {name: "Johnny Cash", age: 30, hairColor: "brown"},
    {name: "Blake Goldman", age: 32, hairColor: "brown"},
    {name: "Kyle Jones", age: 30, hairColor: "red"}
  ]
};

const INVALID_COMPANY_2 = {
  name: "Acme LLC",
  employees: [
  ],
};
const INVALID_COMPANY_3 = {
  name: "Acme LLC",
};


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

test("ons.validate_company_1", () => {
  expect(ons.validate(VALID_COMPANY_1, companySchema).success).toBe(true);
  expect(ons.validate(INVALID_COMPANY_1, companySchema).success).toBe(false);
});
test("ons.validate_company_2", () => {
  expect(ons.validate(INVALID_COMPANY_2, companySchema).success).toBe(false);
});
test("ons.validate_company_3", () => {
  expect(ons.validate(INVALID_COMPANY_3, companySchema).success).toBe(false);
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
