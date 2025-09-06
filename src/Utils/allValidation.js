export const lowerCaseValue = (value) => {
  return value.toLowerCase();
};

export const start_with_char_or_number = /^[^a-zA-Z0-9]/;
export const start_with_char = /^[^a-zA-Z]/;

export const sanitizeInput = (value) => {
  if (/^[^A-Za-z0-9]/.test(value.charAt(0))) {
    value = value.slice(1);
  }
  const sanitizedValue = value.replace(/[`'"<>]/g, "").replace(/ {2,}/g, " ");
  return sanitizedValue;
};

export const verifyDoubleSpace = (value) => {
  let regex = /\s{2,}/;
  return regex.test(value);
};

export const verifyStartingOrEndingCharacters = (value) => {
  let regex = /^[A-Za-z0-9].*[A-Za-z0-9]$/;
  return regex.test(value);
};
export const convertToCamelCase = (value) => {
  return value
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
export const capitalizeWords = (input) => {
  return input
    .split(" ")
    .map((word, index) => {
      if (index === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      return word.toLowerCase();
    })
    .join(" ");
};
export const removeLeadingZeros = (value) => {
  if (value) {
    return value.replace(/^0+/, "") || "0";
  }
};

export const specialCharRegex = /[!@#$%^&*(),./`~\-=?":{}|<>+_ ]$/;
export function allowOnlyNumbersFilter(input) {
  const regex = /[^0-9.]/g;
  return input?.replace(regex, "");
}
export const sanitizeMobileNumber = (value, maxLength) => {
  if (/^[a-zA-Z. ]*$/.test(value)) {
    return "";
  }
  let sanitizedMobileNumber = value.replace(/[^0-9]/g, "");
  sanitizedMobileNumber = sanitizedMobileNumber.slice(0, maxLength || 10);
  return sanitizedMobileNumber.replace(/^0+/, "") || "0";
};

export const validatePersonName = (name) => {
  let sanitizedName = name
    .replace(/[^A-Za-z0-9,.\-/\\()&\s]/g, "")
    .replace(/([,.\-/\\()&])\1+/g, "$1");
  sanitizedName = sanitizedName.split(/\s+/).slice(0, 2).join(" ");
  return convertToCamelCase(sanitizedName);
};

export const sanitizeEmail = (value) => {
  let sanitizedEmail = value
    .replace(/[^A-Za-z0-9._\-@]/g, "")
    .replace(/([._-])\1+/g, "$1")
    .slice(0, 254);
  if ((sanitizedEmail.match(/@/g) || []).length > 1) {
    sanitizedEmail = sanitizedEmail.replace(/@([^@]*)$/, "$1");
  }

  return lowerCaseValue(sanitizedEmail);
};

export const verifyEmail = (value) => {
  const regex =
    /^(?!.*\.\.)(?!.*--)(?!.*__)[a-zA-Z0-9][a-zA-Z0-9._-]*[a-zA-Z0-9]@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,6})+$/;
  return value.length <= 254 && regex.test(value);
};

export const sanitizePassword = (value) => {
  const sanitizedValue = value
    .replace(/[^A-Za-z0-9!@#$%^&*()-_=+?]/g, "")
    .slice(0, 16);
  return sanitizedValue;
};

export const validatePassword = (value) => {
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+?])[A-Za-z!@#$%^&*()-_=+?]{8,}$/;
  return passwordPattern.test(value);
};

export const validateLength = (value, min, max) => {
  return value.length >= min && value.length <= max;
};

export const validateDateOfBirthField = (dob) => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const dateOfBirth = new Date(dob);
  dateOfBirth.setHours(0, 0, 0, 0);

  const minDate = new Date("1930-01-01");

  return dateOfBirth <= currentDate && dateOfBirth >= minDate;
};

export const removeConsecutiveSpecialCharactersWithAllowedSpaceAfter = (
  value
) => {
  return value.replace(/[^a-zA-Z0-9][^a-zA-Z0-9 ]*/g, (match) => match[0]);
};

export const sanitizeAddress = (value) => {
  let sanitizedAddress = value.replace(/[^A-Za-z0-9,.\-()/&#\s]/g, "");
  return removeConsecutiveSpecialCharactersWithAllowedSpaceAfter(
    convertToCamelCase(sanitizedAddress)
  );
};

export const sanitizeZipCode = (value, length) => {
  let sanitizedZipCode = value.replace(/[^0-9]/g, "");
  sanitizedZipCode = sanitizedZipCode.slice(0, length);
  return removeLeadingZeros(sanitizedZipCode);
};

export const verifyPasteData = (value) => {
  if (start_with_char_or_number.test(value)) {
    return { valid: false, error: "Invalid paste data." };
  }

  const containsSpecialChar =
    /[^a-zA-Z0-9.!@#$%^&*()_+\-={}[\]:;"'<>,.?/\\|~` ]/;
  if (containsSpecialChar.test(value)) {
    return { valid: false, error: "Invalid paste data." };
  }

  const endWithSpecialChar =
    /[^a-zA-Z0-9.!@#$%^&*()_+\-={}[\]:;"'<>,.?/\\|~` ]$/;
  if (endWithSpecialChar.test(value)) {
    return { valid: false, error: "Invalid paste data." };
  }

  const invalidPattern = /([!@#$%^&*()_+><?{}[\]|~`=/:;"\\]{2,})|\s{2,}/;
  if (invalidPattern.test(value)) {
    return { valid: false, error: "Invalid paste data." };
  }

  const repeatedSpecialCharPattern =
    /([!@#$%^&*()_+={}[\]:;"'<>,.?/\\|~`-])\1+/;
  if (repeatedSpecialCharPattern.test(value)) {
    return { valid: false, error: "Invalid paste data." };
  }
  const validPattern = /^[A-Za-z0-9.!@#$%^&*()_+\-={}[\]:;"'<>,.?/\\|~` ]*$/;
  if (!validPattern.test(value)) {
    return { valid: false, error: "Invalid paste data." };
  }
  return { valid: true };
};
