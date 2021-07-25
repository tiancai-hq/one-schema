import {ons} from "../src";
import {onsFieldToSwagger} from "../src/generators/swagger";

const testUserSchema1 = ons().object({
  id: ons().string().uuid().required(),
  full_name: ons().string().min(1).max(64).required().description("A user's full name").example("Todd Smith"),
  age: ons().float64().required().min(0).max(200).description("A user's age in years").example(50),
  created_at: ons().string().validator("datetime").required(),
  location: ons().object({
    city: ons().string().example("Shanghai"),
    state: ons().string(),
    country: ons().string().min(2).max(2),
  }),
  pets: ons().arrayOf(ons().object({
    name: ons().string().required().description("The pet's name"),
    animal: ons().string().required().oneOf(["cat","dog","fish"]),
    age: ons().float64().min(0).max(200),
  })).required(),
  hair_color: ons().string().oneOf(["black","brown","blond","red","white","grey"]),
});

const testUserSchema1_RESULT = "{\"type\":\"object\",\"properties\":{\"id\":{\"type\":\"string\"},\"full_name\":{\"type\":\"string\",\"example\":\"Todd Smith\",\"description\":\"A user's full name\",\"minLength\":1,\"maxLength\":64},\"age\":{\"type\":\"number\",\"format\":\"double\",\"example\":50,\"description\":\"A user's age in years\",\"minimum\":0,\"maximum\":200},\"created_at\":{\"type\":\"string\",\"format\":\"date-time\"},\"location\":{\"type\":\"object\",\"properties\":{\"city\":{\"type\":\"string\",\"example\":\"Shanghai\"},\"state\":{\"type\":\"string\"},\"country\":{\"type\":\"string\",\"minLength\":2,\"maxLength\":2}}},\"pets\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"name\":{\"type\":\"string\",\"description\":\"The pet's name\"},\"animal\":{\"type\":\"string\",\"enum\":[\"cat\",\"dog\",\"fish\"]},\"age\":{\"type\":\"number\",\"format\":\"double\",\"minimum\":0,\"maximum\":200}},\"required\":[\"name\",\"animal\"]}},\"hair_color\":{\"type\":\"string\",\"enum\":[\"black\",\"brown\",\"blond\",\"red\",\"white\",\"grey\"]}},\"required\":[\"id\",\"full_name\",\"age\",\"created_at\",\"pets\"]}";

test("generateUserSwagger", () => {
  expect(JSON.stringify(onsFieldToSwagger(testUserSchema1))).toBe(testUserSchema1_RESULT);
});