import {ons} from "../src";
const VALID_EMAILS = Object.freeze(["hello@o.co", "testtest@gmail.com", "alongemailaddress12345678@EXAMPLE.COM", "172397123@4.cn", "john.smith@gmail.com", "js@ex.a1.1234.co.uk","j.s@ex.a1.1234.co.uk"]);
const INVALID_EMAILS = Object.freeze(["@gmail.com", "test@test@gmail.com", "alongemailaddress12345678@", "172397123","a@.cn","@@blah.com", "example.com"]);

const VALID_MOBILE_NUMBERS = Object.freeze(["+12124441234","+12345556666","+85212345555","+8613788886666","+8613888886666","+79216456742","+34611221444"]);
const INVALID_MOBILE_NUMBERS = Object.freeze(["+123","12124441234","112124441234","+1212444123a","+12124441234/","+1212444123","121244412349","+8521234555","+852123455555","+861378888666","+86137888866666","+7","+71234","+886123","test","+1abc123abcd","++8613888886666","+861388888666a"]);



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