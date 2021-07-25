import {ons} from "../src";
const VALID_EMAILS = Object.freeze(["hello@o.co", "testtest@gmail.com", "alongemailaddress12345678@EXAMPLE.COM", "172397123@4.cn", "john.smith@gmail.com", "js@ex.a1.1234.co.uk","j.s@ex.a1.1234.co.uk"]);
const INVALID_EMAILS = Object.freeze(["@gmail.com", "test@test@gmail.com", "alongemailaddress12345678@", "172397123","a@.cn","@@blah.com", "example.com",""]);

const VALID_MOBILE_NUMBERS = Object.freeze(["+12124441234","+12345556666","+85212345555","+8613788886666","+8613888886666","+79216456742","+34611221444"]);
const INVALID_MOBILE_NUMBERS = Object.freeze(["+123","12124441234","112124441234","+1212444123a","+12124441234/","+1212444123","121244412349","+8521234555","+852123455555","+861378888666","+86137888866666","+7","+71234","+886123","test","+1abc123abcd","++8613888886666","+861388888666a",""]);

const VALID_URLS = Object.freeze([
  "https://www.google.com/",
  "https://google.com",
  "https://o.co",
  "https://1.1.1.1",
  "https://www.amazon.com/gp/product/B07T4ZH692?pf_rd_p=2d1ab404-3b11-4c97-b3db-48081e145e35&pf_rd_r=6EXT6XH00MGJZGG09S71",
  'http://189.123.14.13/'
]);
const INVALID_URLS = Object.freeze([
  "https://example.com/foo/<script>alert(\'XSS\')</script>/",
  "xyz://foobar.com",
  "hello",
  "https://",
  "https://^.com",
  "",
  "htps://a.com",
  "https://a.co%m",
]);


const VALID_IPV4 = Object.freeze([
  "1.1.1.1",
  "255.255.255.255",
  "1.100.200.200",
  "127.0.0.1",
  "192.168.1.4"
]);
const INVALID_IPV4 = Object.freeze([
  "1.1.1.1.5",
  "255.255.255",
  "1..2.200",
  "127.0.0.a",
  "192.168.-1.4",
  "hello",
  "a.b.c.d",
  ""
]);

const VALID_IPV6 = Object.freeze([
  "2606:4700:10::6814:8832",
  "2a01:4f8:161:42e4::2",
  "2a01:4f8:1c1c:365e::1",
  "2001:0db8:0000:0000:0000:ff00:0042:8329",
  "21DA:D3:0:2F3B:2AA:FF:FE28:9C4B",
]);
const INVALID_IPV6 = Object.freeze([
  "2001:0dz8:0000:0000:0000:ff00:0042:8329",
  "2a01:4f8:::1",
  "[2001:db8:0:1]:80",
  ""
]);
const VALID_IP_ADDRESS = VALID_IPV4.concat(VALID_IPV6);
const INVALID_IP_ADDRESS = INVALID_IPV4.concat(INVALID_IPV6);

const VALID_HEX_STRING = Object.freeze([
  "a1729abcdef9479abcdfffef124",
  "0123456789",
  "00000000000000000",
  "0123456789abcdef",
  "aaaaaaaaa",
  "babababaab",
  "a0a0a09f9f"
]);
const INVALID_HEX_STRING = Object.freeze([
  "aa832048234z",
  "000g000",
  "hello",
  "hh",
  "",
  "[000abc]"
]);
const VALID_NUMERIC_STRING = Object.freeze([
  "123",
  "0",
  "8",
  "9049",
  "0123456789",
  "99",
  "554433598340583405809438509880983"
]);
const INVALID_NUMERIC_STRING = Object.freeze([
  "aa832048234z",
  "000000a",
  "abc",
  "123abc",
  "-123",
  "[000abc]",
  "10.5",
  "50.0"
]);
const VALID_ALPHANUMERIC_STRING = Object.freeze([
  "123",
  "0",
  "8",
  "9049",
  "0123456789",
  "99",
  "554433598340583405809438509880983"
]);
const INVALID_ALPHANUMERIC_STRING = Object.freeze([
  "aa832048234!z",
  "0000 00a",
  "[]",
  "Hello!",
  "-123",
  "400.0",
  "[000abc]"
]);
const VALID_UUID = Object.freeze(["a09f283a-f0cc-4c0d-a062-915ca131d04f", "1c6673a0-f4b5-4d56-9c3a-615be3da6ccb", "cb6f810d-2dcb-4f58-a3d9-d69479cd26e1", "429c6647-4937-4281-8448-204e56419685", "3fdf48ca-7719-4bb8-84e1-b8f21ee3b1b5", "e22c38c2-870c-4ab9-b9e2-75607a763597", "aa96b813-68fe-4444-aa53-aa9537fef40a", "df8dc4db-9198-495b-90c9-a4c3168fc456", "44dadad8-2dee-4105-a10e-08c17358671c", "f54755d4-8cdb-4eab-b884-0584e4f8bd61"]);

const INVALID_UUID = Object.freeze(["a09f283a-f0cc-4c0d-a062", "1c6673a0-f4b5-9c3a-615be3da6ccb", "cb6f810d-4f58-a3d9-d69479cd26e1", "-4937-4281-8448-204e56419685", "3fdf48ca-7719-4bb8-84e1-b8f21ee3b1b57", "e22c38c2------4ab9-b9e2-75607a763597", "hello", "", null, 123, "123", "df8zc4db-9198-495b-90c9-a4c3168fc456", "44dadad82dee4105a10e08c17358671c", "f54755d48cdb4eab"]);

const VALID_DATETIME = Object.freeze(['2009-05-19 14:39:22-06:00', '2009-05-19', '20090519', '2010-02-18T16:23:48.5', '2010-02-18T16:23:48,444', '2009-05-19T14:39:12Z']);
const INVALID_DATETIME = Object.freeze(['100000','abcd', '', '2009-05-19 14:39:22+06a00', '2007-04-05T24:50', '2009-0519', '2009-05-19 14.5.44', '2009-05-1914:39', '2009-05-19 146922.500', '2009-05-19T14:3924']);

const VALID_INT64_STRING = Object.freeze([
  "-3642342507247777985",
  "-2975742547068585235",
  "7254850939994515736",
  "-8556304026405624745",
  "-3772001869061542546",
  "7366722871941940226",
  "1900890322139207405",
  "-5893478629215126568",
  "-2473581714055560321",
  "5626934689865447990",
  "0",
  "1000",
  "-1337",
  "9223372036854775807",
  "-9223372036854775808",
  "124124124124124124",
  "1000010000010009",
  "8223372036854775809",
  "-7223372036854775899",
  "1000001000",
  "1000000000000",
  "99999999999999"
]);
const INVALID_INT64_STRING = Object.freeze([
  "10.5",
  "10.0",
  "0.0",
  "-",
  "--1",
  "--",
  "-.05",
  "-0.1",
  "9223372036854775808",
  "-9223372036854775809",
  "124124a0",
  "123 123",
  "123,123",
  "123Z",
  "1-",
  "+1",
  "a1",
  "-a1",
  "92233720368547758089",
  "9223372036854775808999",
  "0x123",
  "0xabc",
  "abc",
  ",",
  "-1a1",
  "-0x123"
])


VALID_EMAILS.forEach(s=>{
  test(`ons.builtinValidators.email: ${s} is a valid email`, ()=>{
    expect(ons.validate(s, ons().string().validator("email")).success).toBe(true)
    expect(ons.validate({example: s}, ons().object({example: ons().string().validator("email")})).success).toBe(true)
  })
})

INVALID_EMAILS.forEach(s=>{
  test(`ons.builtinValidators.email: ${s} is NOT a valid email`, ()=>{
    expect(ons.validate(s, ons().string().validator("email")).success).toBe(false)
    expect(ons.validate({example: s}, ons().object({example: ons().string().validator("email")})).success).toBe(false)
  })
})



VALID_MOBILE_NUMBERS.forEach(s=>{
  test(`ons.builtinValidators.mobile_number: ${s} is a valid mobile_number`, ()=>{
    expect(ons.validate(s, ons().string().validator("mobile_number")).success).toBe(true)
    expect(ons.validate({example: s}, ons().object({example: ons().string().validator("mobile_number")})).success).toBe(true)
  })
})

INVALID_MOBILE_NUMBERS.forEach(s=>{
  test(`ons.builtinValidators.mobile_number: ${s} is NOT a valid mobile_number`, ()=>{
    expect(ons.validate(s, ons().string().validator("mobile_number")).success).toBe(false)
    expect(ons.validate({example: s}, ons().object({example: ons().string().validator("mobile_number")})).success).toBe(false)
  })
})

VALID_URLS.forEach(s => {
  test(`ons.builtinValidators.url: ${s} is a valid url`, ()=>{
    expect(ons.validate(s, ons().string().validator("url")).success).toBe(true)
    expect(ons.validate({example: s}, ons().object({example: ons().string().validator("url")})).success).toBe(true)
  })
});

INVALID_URLS.forEach(s => {
  test(`ons.builtinValidators.url: ${s} is NOT a valid url`, ()=>{
    expect(ons.validate(s, ons().string().validator("url")).success).toBe(false)
    expect(ons.validate({example: s}, ons().object({example: ons().string().validator("url")})).success).toBe(false)
  })
});


VALID_IPV4.forEach(s => {
  test(`ons.builtinValidators.ipv4: ${s} is a valid ipv4 address`, ()=>{
    expect(ons.validate(s, ons().string().validator("ipv4")).success).toBe(true)
    expect(ons.validate({example: s}, ons().object({example: ons().string().validator("ipv4")})).success).toBe(true)
  })
});

INVALID_IPV4.concat(VALID_IPV6).forEach(s => {
  test(`ons.builtinValidators.ipv4: ${s} is NOT a valid ipv4 address`, ()=>{
    expect(ons.validate(s, ons().string().validator("ipv4")).success).toBe(false)
    expect(ons.validate({example: s}, ons().object({example: ons().string().validator("ipv4")})).success).toBe(false)
  })
});

VALID_IPV6.forEach(s => {
  test(`ons.builtinValidators.ipv6: ${s} is a valid ipv6 address`, ()=>{
    expect(ons.validate(s, ons().string().validator("ipv6")).success).toBe(true)
    expect(ons.validate({example: s}, ons().object({example: ons().string().validator("ipv6")})).success).toBe(true)
  })
});

INVALID_IPV6.concat(VALID_IPV4).forEach(s => {
  test(`ons.builtinValidators.ipv6: ${s} is NOT a valid ipv6 address`, ()=>{
    expect(ons.validate(s, ons().string().validator("ipv6")).success).toBe(false)
    expect(ons.validate({example: s}, ons().object({example: ons().string().validator("ipv6")})).success).toBe(false)
  })
});


VALID_IP_ADDRESS.forEach(s => {
  test(`ons.builtinValidators.ip_address: ${s} is a valid ip address`, ()=>{
    expect(ons.validate(s, ons().string().validator("ip_address")).success).toBe(true)
    expect(ons.validate({example: s}, ons().object({example: ons().string().validator("ip_address")})).success).toBe(true)
  })
});

INVALID_IP_ADDRESS.forEach(s => {
  test(`ons.builtinValidators.ip_address: ${s} is NOT a valid ip address`, ()=>{
    expect(ons.validate(s, ons().string().validator("ip_address")).success).toBe(false)
    expect(ons.validate({example: s}, ons().object({example: ons().string().validator("ip_address")})).success).toBe(false)
  })
});



VALID_HEX_STRING.forEach(s=>{
  test(`ons.builtinValidators.hex_string: ${s} is a valid hex string`, ()=>{
    expect(ons.validate(s, ons().string().validator("hex_string")).success).toBe(true)
    expect(ons.validate({example: s}, ons().object({example: ons().string().validator("hex_string")})).success).toBe(true)
  })
})

INVALID_HEX_STRING.forEach(s=>{
  test(`ons.builtinValidators.hex_string: ${s} is NOT a valid hex string`, ()=>{
    expect(ons.validate(s, ons().string().validator("hex_string")).success).toBe(false)
    expect(ons.validate({example: s}, ons().object({example: ons().string().validator("hex_string")})).success).toBe(false)
  })
})

VALID_NUMERIC_STRING.forEach(s=>{
  test(`ons.builtinValidators.numeric_string: ${s} is a valid numeric string`, ()=>{
    expect(ons.validate(s, ons().string().validator("numeric_string")).success).toBe(true)
    expect(ons.validate({example: s}, ons().object({example: ons().string().validator("numeric_string")})).success).toBe(true)
  })
})

INVALID_NUMERIC_STRING.forEach(s=>{
  test(`ons.builtinValidators.numeric_string: ${s} is NOT a valid numeric string`, ()=>{
    expect(ons.validate(s, ons().string().validator("numeric_string")).success).toBe(false)
    expect(ons.validate({example: s}, ons().object({example: ons().string().validator("numeric_string")})).success).toBe(false)
  })
})

VALID_ALPHANUMERIC_STRING.forEach(s=>{
  test(`ons.builtinValidators.alphanumeric: ${s} is a valid alphanumeric string`, ()=>{
    expect(ons.validate(s, ons().string().validator("alphanumeric")).success).toBe(true)
    expect(ons.validate({example: s}, ons().object({example: ons().string().validator("alphanumeric")})).success).toBe(true)
  })
})

INVALID_ALPHANUMERIC_STRING.forEach(s=>{
  test(`ons.builtinValidators.alphanumeric: ${s} is NOT a valid alphanumeric string`, ()=>{
    expect(ons.validate(s, ons().string().validator("alphanumeric")).success).toBe(false)
    expect(ons.validate({example: s}, ons().object({example: ons().string().validator("alphanumeric")})).success).toBe(false)
  })
})


VALID_UUID.forEach(s=>{
  test(`ons.builtinValidators.uuid: ${s} is a valid uuid`, ()=>{
    expect(ons.validate(s, ons().string().validator("uuid")).success).toBe(true)
    expect(ons.validate({example: s}, ons().object({example: ons().string().validator("uuid")})).success).toBe(true)
  })
})

INVALID_UUID.forEach(s=>{
  test(`ons.builtinValidators.uuid: ${s} is NOT a valid uuid`, ()=>{
    expect(ons.validate(s, ons().string().validator("uuid")).success).toBe(false)
    expect(ons.validate({example: s}, ons().object({example: ons().string().validator("uuid")})).success).toBe(false)
  })
})

VALID_DATETIME.forEach(s=>{
  test(`ons.builtinValidators.datetime: ${s} is a valid datetime`, ()=>{
    expect(ons.validate(s, ons().string().validator("datetime")).success).toBe(true)
    expect(ons.validate({example: s}, ons().object({example: ons().string().validator("datetime")})).success).toBe(true)
  })
})

INVALID_DATETIME.forEach(s=>{
  test(`ons.builtinValidators.datetime: ${s} is NOT a valid datetime`, ()=>{
    expect(ons.validate(s, ons().string().validator("datetime")).success).toBe(false)
    expect(ons.validate({example: s}, ons().object({example: ons().string().validator("datetime")})).success).toBe(false)
  })
})


VALID_INT64_STRING.forEach(s=>{
  test(`ons.builtinValidators.int64_string: ${s} is a valid int64 string`, ()=>{
    expect(ons.validate(s, ons().string().validator("int64_string")).success).toBe(true)
    expect(ons.validate({example: s}, ons().object({example: ons().string().validator("int64_string")})).success).toBe(true)
  })
})

INVALID_INT64_STRING.forEach(s=>{
  test(`ons.builtinValidators.int64_string: ${s} is NOT a valid int64 string`, ()=>{
    expect(ons.validate(s, ons().string().validator("int64_string")).success).toBe(false)
    expect(ons.validate({example: s}, ons().object({example: ons().string().validator("int64_string")})).success).toBe(false)
  })
})