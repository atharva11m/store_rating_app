exports.validateUser = ({ name, email, address, password }) => {
  const errors = [];

  if (!name || name.length < 5 || name.length > 60) {
    errors.push("Name must be between 20 and 60 characters");
  }

  if (!address || address.length > 400) {
    errors.push("Address must not exceed 400 characters");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push("Invalid email format");
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
  if (!password || !passwordRegex.test(password)) {
    errors.push(
      "Password must be 8-16 chars, include 1 uppercase and 1 special char"
    );
  }

  return errors;
};
