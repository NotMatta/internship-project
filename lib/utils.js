import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import {GET as validateToken} from "../app/api/auth/validate/route"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function validatePassword(password) {
  if(!password) return "Password is valid.";
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{10,}$/;

  if (regex.test(password)) {
    return "Password is valid.";
  } else {
    return "Password must be at least 10 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
  }
}

export function validateUsername(username) {
  if(!username) return "Username is valid.";
  const regex = /^(?=[a-zA-Z]{5})(?:[a-zA-Z]+(?:\s[a-zA-Z]+){0,2})$/;

  if (regex.test(username)) {
    return "Username is valid.";
  } else {
    return "Username must contain at least 5 alphabetic characters and allow at most two spaces.";
  }
}

export const validate = async (req) => {
  const res = await validateToken(req)
  const isValid = res.ok
  const status = res.status
  const body = await res.json()
  return {isValid,body,status}
}

