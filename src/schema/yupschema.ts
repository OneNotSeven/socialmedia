import * as Yup from "yup"

export const formSignUpSchema = Yup.object({
    name: Yup.string().required("enter your name"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(4).required("password required"),
    c_password: Yup.string().required("confirm password required").oneOf([Yup.ref("password")], "password not match"),
})

export const LoginSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("password required")
})

export const validateProfile= Yup.object({
    name: Yup.string().required("Name is required"),
    username: Yup.string().required("Username is required"),
    bio: Yup.string().max(160, "Bio must be 160 characters or less"),
    website: Yup.string().url("Invalid URL format"),
    profession: Yup.string(),
    
})

export const emailVerifySchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
   
})

export const passwordChecking = Yup.object({
    password: Yup.string().min(4).required("password required"),
    c_password: Yup.string().required("confirm password required").oneOf([Yup.ref("password")], "password not match"),
   
})