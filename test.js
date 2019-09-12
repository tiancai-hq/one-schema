
const { ons } = require('./dist');

const userSchema = ons().object({
  _id: ons().int32().min(0),
  name: ons().string().max(48).required(),
  email: ons().string().validator('email').required(),
  bio: ons().string().min(0).max(128)
    .defaultValue('This is my bio'),
  image_url: ons().string().min(10).max(1024)
    .allowNull(),
  location: ons().object({
    city: ons().string(),
    country: ons().string(),
  }),
  pets: ons().arrayOf(
    ons().object({
      animal: ons().string().oneOf(['cat', 'dog', 'fish', 'frog']).required(),
      color: ons().string().max(12),
      age: ons().int32().min(0).max(500),
    })
  ),
});

const sampleUser1 = {
  _id: 1,
  name: 'Sam',
  email: 'sam@email.com',
  location: {
    country: 'Germany',
  },
  pets: [
    {
      animal: 'cat',
      color: 'black',
      age: 8,
    },
    {
      animal: 'fish',
      color: 'orange',
      age: 2,
    },
  ],
};

const sampleUser2 = {
  _id: 2,
  email: 'BADemail.com',
  location: {
    inmyhouse: 'yup',
  },
  pets: [
    {
      animal: 'cheetah',
      color: 'black',
      age: 1337,
    },
  ],
};

function printResult(name, result) {
  if (result.success) {
    console.log(`Validation for ${name} passed successfully, object is valid.`);
  } else {
    console.error(`Validation for ${name} FAILED: ${result.error}!`);
  }
}

// line below prints: 'Validation for User 1 Passed successfully, object is valid.'
printResult('User 1', ons.validate(sampleUser1, userSchema));

// line below prints: 'Validation for User 1 (JSON) Passed successfully, object is valid.'
printResult('User 1 (JSON)', ons.validate(sampleUser1, JSON.parse(JSON.stringify(userSchema))));


// line below prints: 'Validation for User 2 FAILED, object is valid.'
printResult('User 2', ons.validate(sampleUser2, userSchema));

// line below prints: 'Validation for User 1 (JSON) Passed successfully, object is valid.'
printResult('User 2 (JSON)', ons.validate(sampleUser2, JSON.parse(JSON.stringify(userSchema))));
