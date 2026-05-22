import { customFetch } from "@/utils/customFetch";

// ─── Register ────────────────────────────────────────────────────────────────
export const registerUser = async ({ name, email, password }) => {
  const { data } = await customFetch.post("/auth/register", {
    name,
    email,
    password,
  });
  return data;
};

// ─── Login ───────────────────────────────────────────────────────────────────
export const loginUser = async ({ email, password }) => {
  const { data } = await customFetch.post("/auth/login", { email, password });
  return data;
};

// ─── Logout ──────────────────────────────────────────────────────────────────
export const customLogout = async () => {
  const { data } = await customFetch.get("/auth/logout");
  return data;
};

// ─── Check session ───────────────────────────────────────────────────────────
export const isUserLoggedIn = async () => {
  const { data } = await customFetch.get("/auth/is-user-logged-in");
  return data; // { success, message, user }
};

// ─── Change password (authenticated) ─────────────────────────────────────────
export const changePassword = async ({ oldPassword, newPassword }) => {
  const { data } = await customFetch.post("/auth/change-password", {
    oldPassword,
    newPassword,
  });
  return data;
};

// ─── Forgot password ─────────────────────────────────────────────────────────
export const forgotPassword = async ({ email }) => {
  const { data } = await customFetch.post("/auth/forgot-password", { email });
  return data;
};

// ─── Validate reset token (before showing reset form) ────────────────────────
export const validateResetToken = async ({ token, email }) => {
  const { data } = await customFetch.get("/auth/validate-reset-token", {
    params: { token, email },
  });
  return data;
};

// ─── Reset password ───────────────────────────────────────────────────────────
export const resetPassword = async ({ token, email, newPassword }) => {
  const { data } = await customFetch.post("/auth/reset-password", {
    token,
    email,
    newPassword,
  });
  return data;
};