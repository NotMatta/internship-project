import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import {GET as validateToken} from "../app/api/auth/validate/route"
import CryptoJS from "crypto-js";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function isValidEmail(email) {
  if (typeof email !== 'string') {
    return false;
  }
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

export function isValidIP(ip) {
  if (typeof ip !== 'string') {
    return false;
  }
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4Regex.test(ip)) {
    const parts = ip.split('.');
    for (const part of parts) {
      const num = parseInt(part, 10);
      if (isNaN(num) || num < 0 || num > 255 || (part.length > 1 && part.startsWith('0'))) {
        return false;
      }
    }
    return true;
  }
  const ipv6Regex = /^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$/;
    if (ipv6Regex.test(ip)) {
        return true;
    }
  return false;
}

export function isValidURL(url) {
  if (typeof url !== 'string') {
    return false;
  }
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

export function validatePassword(password) {
  if(!password) return {isValid:false,message:"Le mot de passe doit contenir au moins 10 caractères et au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial."};
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{10,}$/;

  if (regex.test(password)) {
    return {isValid:true,message:"Le mot de passe est valide."};
  } else {
    return {isValid:false,message:"Le mot de passe doit contenir au moins 10 caractères et au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial."};
  }
}

export function validateUsername(username) {
  if(!username) return {isValid:false,message:"Vous devez fournir un nom d'utilisateur."};
  const regex = /^(?=[a-zA-Z]{5})(?:[a-zA-Z]+(?:\s[a-zA-Z]+){0,2})$/;

  if (regex.test(username)) {
    return {isValid:true,message:"Le nom d'utilisateur est valide."};
  } else {
    return {isValid:false,message:"Le nom d'utilisateur doit contenir au moins 5 caractères alphabétiques et autoriser au maximum deux espaces."};
  }
}

export const validate = async (req) => {
  const res = await validateToken(req)
  const isValid = res.ok
  const status = res.status
  const body = await res.json()
  return {isValid,body,status}
}

export const handle = async (req, permissions, handleFn) => {
  try {
    const tokenRes = await validate(req);
    if (!tokenRes.isValid) {
      return Response.json(tokenRes.body, { status: tokenRes.status });
    }
    const userPermissions = tokenRes.body.user.role.permissions;

    const hasRequiredPermissions = userPermissions.includes("MASTER") || permissions.length === 0 || permissions.every(permission => userPermissions.includes(permission));

    if (!hasRequiredPermissions) {
      return Response.json("Non autorisé", { status: 401 });
    }

    return await handleFn({ tokenRes });
  } catch (err) {
    console.error(err);
    return Response.json("Erreur serveur interne", { status: 500 });
  }
};


export function calculateOverAllScore(passwords) {
  if(passwords.length == 0) return 0;
  let score = 0;
  passwords.forEach(password => {
    score += calculatePasswordScore(password);
  });
  return score/passwords.length;
}

export function calculatePasswordScore(password) {
  if (typeof password !== 'string') {
    throw new Error('Password must be a string.');
  }

  const lengthScore = calculateLengthScore(password);
  const complexityScore = calculateComplexityScore(password);

  const overallScore = Math.min(100, lengthScore + complexityScore);  return overallScore
}

export function calculatePasswordStrength(password, ageInDays, commonPasswords) {
  if (typeof password !== 'string') {
    throw new Error('Password must be a string.');
  }
  if (ageInDays !== undefined && typeof ageInDays !== 'number') {
      throw new Error("Age must be a number")
  }

  const lengthScore = calculateLengthScore(password);
  const complexityScore = calculateComplexityScore(password);
  const ageScore = calculateAgeScore(ageInDays);
  const occurrenceScore = calculateOccurrenceScore(password, commonPasswords);


  const overallScore = Math.max(0, Math.min(100, lengthScore + complexityScore + ageScore - occurrenceScore));

  let strengthLabel = '';
  if (overallScore < 30) {
    strengthLabel = 'Très faible';
  } else if (overallScore < 50) {
    strengthLabel = 'Faible';
  } else if (overallScore < 70) {
    strengthLabel = 'Moyen';
  } else if (overallScore < 90) {
    strengthLabel = 'Fort';
  } else {
    strengthLabel = 'Très fort';
  }

  return strengthLabel
}

function calculateLengthScore(password) {
  const length = password.length;
  if (length < 8) {
    return 0;
  } else if (length < 12) {
    return 20;
  } else if (length < 16) {
    return 40;
  } else {
    return 60;
  }
}

function calculateComplexityScore(password) {
  let score = 0;

  if (/[a-z]/.test(password)) {
    score += 10;
  }
  if (/[A-Z]/.test(password)) {
    score += 10;
  }
  if (/[0-9]/.test(password)) {
    score += 10;
  }
  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 20;
  }

  return score;
}

function calculateAgeScore(ageInDays) {
    if (ageInDays === undefined) return 0;
    if (ageInDays < 90) return -20;
    if (ageInDays < 365) return -10;
    return 0;
}

function calculateOccurrenceScore(password, commonPasswords) {
    if (!commonPasswords || !Array.isArray(commonPasswords) || commonPasswords.length == 0) return 0;
    if (commonPasswords.includes(password)) return 50;
    return 0;
}

export function getAgeInDays(dateString) {
  if (typeof dateString !== 'string') {
    throw new Error('Date string must be a string.');
  }

  try {
    const inputDate = new Date(dateString);
    const currentDate = new Date();

    const timeDifference = currentDate.getTime() - inputDate.getTime();

    const ageInDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    return ageInDays;
  } catch (error) {
    throw new Error('Invalid date string format.');
  }
}

export function encryptData(data, secretKey) {
    try {
        const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
        return ciphertext;
    } catch (error) {
        console.error("Encryption error:", error);
        return null;
    }
}

export function decryptData(ciphertext, secretKey) {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decryptedData;
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
}

export function formatISODate(isoDateString, options = {}) {
  try {
    const date = new Date(isoDateString);

    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    const combinedOptions = { ...defaultOptions, ...options };
    const formatter = new Intl.DateTimeFormat(undefined, combinedOptions);
    return formatter.format(date);
  } catch (error) {
    console.error("Invalid date string:", error);
    return "Invalid Date";
  }
}
