export const LogSuccess = (text: string) => {
  console.log(`Success: ${text}`);
};

export const LogInfo = (text: string) => {
  console.log(`Info: ${text}`);
};

export const LogWarning = (text: string) => {
  console.log(`Warning: ${text}`);
};

export const LogError = (text: string | unknown) => {
  console.log(`Error: ${text}`);
};
