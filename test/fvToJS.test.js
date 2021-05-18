const {ons, fvToJS} = require('../src');


const USER_1_JS_STR = `ons().object({
  full_name: ons().string().min(1).max(64).required().tags(["test"]),
  email: ons().string().min(1).max(64).validator("email").required(),
  bio: ons().string().min(0).max(512),
  location: ons().object({
    city: ons().string().example("Shanghai"),
    state: ons().string(),
    country: ons().string().min(2).max(2).example("CN"),
  }),
  phone_number: ons().string().min(1).max(64).validator("mobile_number"),
  family_members: ons().arrayOf(ons().object({
    full_name: ons().string().required(),
    age: ons().float64().required().description("A user's age in years"),
  })).required(),
  lucky_numbers: ons().arrayOf(ons().int32().required()).required(),
  age:ons().float64()
})`;

const USER_2_JS_STR = `ons().object({
  email: ons().string().validator("email"),
  phone_number: ons().string().required().validator("mobile_number"),
  name: ons().string().min(1).required().description("A user's full name").example("Todd Smith"),
  age: ons().int32().min(0).required(),
  height: ons().float64().max(300).description("A user's height in cm"),
  gender: ons().bool(),
  location: ons().object({
    city: ons().string().required(),
  }),
  schools: ons().arrayOf(ons().object({
    schoolName: ons().string(),
    year: ons().int32()
  })).required()
})`;

const USER_3_JS_STR = `ons().object({
  id: ons().string().required().uuid(),
  email: ons().string().validator("email"),
  phone_number: ons().string().required().validator({"id": "mobile_number", "hello": "world"}),
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
  })).required()
})`;

const USER_1 = eval(USER_1_JS_STR);
const USER_2 = eval(USER_2_JS_STR);
const USER_3 = eval(USER_3_JS_STR);


function codeSpaceTrim(str) {
  return str.replace(/\s+/gm," ").replace(/\s*([\{|\}|\(|\)|\,|\.|\:|\;|\[|\]|\=])\s*/gm, "$1").replace(/\,(\}|\])/gm,"$1").trim();
}

test("ons.fvToJS.user: schema input JS is same output when eval'd and minified", ()=>{
  expect(codeSpaceTrim(fvToJS(USER_1))).toBe(codeSpaceTrim(USER_1_JS_STR));
});

test("ons.fvToJS.USER_2 string validator: schema input JS is same output when eval'd and minified", ()=>{
  expect(codeSpaceTrim(fvToJS(USER_2))).toBe(codeSpaceTrim(USER_2_JS_STR));
});

test("ons.fvToJS.USER_3 object settings validator: schema input JS is same as fvToJS output when eval'd and minified", ()=>{
  expect(codeSpaceTrim(fvToJS(USER_3))).toBe(codeSpaceTrim(USER_3_JS_STR));
});
