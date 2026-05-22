"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { changePassword } from "@/services/authservices";

const changeSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[0-9]/, "Must include at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "New password must differ from current password",
    path: ["newPassword"],
  });

type ChangeFormData = z.infer<typeof changeSchema>;

export default function ChangePasswordPage() {
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangeFormData>({
    resolver: zodResolver(changeSchema),
  });

  const onSubmit = async (data: ChangeFormData) => {
    try {
      setLoading(true);
      setServerError("");
      await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      setSuccess(true);
      reset();
    } catch (err: any) {
      setServerError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Change password
          </h1>
          <p className="text-muted-foreground text-base">
            Update the password for your account
          </p>
        </div>

        {/* Form card */}
        <div className="border border-border rounded-lg p-8 bg-card">
          {/* Inline success banner */}
          {success && (
            <div className="mb-5 flex items-center gap-2 text-sm text-foreground bg-muted px-3 py-2.5 rounded-md border border-border">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Password updated successfully.
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Current password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Current password
              </label>
              <input
                {...register("oldPassword")}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
              />
              {errors.oldPassword && (
                <p className="text-xs text-destructive">
                  {errors.oldPassword.message}
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* New password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                New password
              </label>
              <input
                {...register("newPassword")}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
              />
              {errors.newPassword && (
                <p className="text-xs text-destructive">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Confirm new password
              </label>
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Password rules hint */}
            <ul className="text-xs text-muted-foreground space-y-0.5 list-disc list-inside">
              <li>At least 8 characters</li>
              <li>One uppercase letter</li>
              <li>One number</li>
            </ul>

            {serverError && (
              <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-foreground text-background rounded-md text-sm font-semibold hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update password"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link
            href="/dashboard"
            className="text-foreground font-medium hover:underline underline-offset-4"
          >
            ← Back to dashboard
          </Link>
        </p>
      </div>
    </main>
  );
}