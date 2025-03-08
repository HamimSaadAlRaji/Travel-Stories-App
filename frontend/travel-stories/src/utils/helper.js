export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
export const getInitials = (name) => {
  if (!name) return ""; // Check if the name is invalid or empty
  const words = name.split(" "); // Split the name into an array of words
  let initials = "";

  // Loop through the first two words and collect their first letters
  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }

  return initials.toUpperCase(); // Convert initials to uppercase and return
};
