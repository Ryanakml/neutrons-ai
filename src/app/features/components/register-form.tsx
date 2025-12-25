"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { authClient } from "@/lib/auth-client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name is required."),
    email: z.email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(8, "Please confirm your password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

type RegisterFormProps = React.ComponentProps<"div">;

export function RegisterForm({ className, ...props }: RegisterFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formError, setFormError] = useState<string | null>(null);
  const [oauthPending, setOauthPending] = useState<"google" | "github" | null>(
    null
  );

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setFormError(null);
    const callbackURL = searchParams.get("callbackUrl") ?? "/";

    try {
      const { confirmPassword, ...payload } = values;
      const { error } = await authClient.signUp.email({
        ...payload,
        callbackURL,
      });

      if (error) {
        setFormError(
          error.message ?? "Unable to create your account. Please try again."
        );
        return;
      }

      router.push(callbackURL);
      router.refresh();
    } catch (error) {
      setFormError("Something went wrong. Please try again.");
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setFormError(null);
    setOauthPending(provider);
    const callbackURL = searchParams.get("callbackUrl") ?? "/";

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL,
        requestSignUp: true,
      });

      if (error) {
        setFormError(error.message ?? "Unable to continue with OAuth.");
        setOauthPending(null);
      }
    } catch (error) {
      setFormError("Something went wrong. Please try again.");
      setOauthPending(null);
    }
  };

  const isPending = form.formState.isSubmitting;

  return (
    <div
      className={cn("flex w-full max-w-md flex-col gap-6", className)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your information to sign up and start using the app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor="name">Full name</FieldLabel>
                      <FieldContent>
                        <FormControl>
                          <Input
                            {...field}
                            id="name"
                            placeholder="John Doe"
                            autoComplete="name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FieldContent>
                    </Field>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <FieldContent>
                        <FormControl>
                          <Input
                            {...field}
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            autoComplete="email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FieldContent>
                    </Field>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <FieldContent>
                        <FormControl>
                          <Input
                            {...field}
                            id="password"
                            type="password"
                            autoComplete="new-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FieldContent>
                    </Field>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor="confirmPassword">
                        Confirm password
                      </FieldLabel>
                      <FieldContent>
                        <FormControl>
                          <Input
                            {...field}
                            id="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FieldContent>
                    </Field>
                  )}
                />

                {formError ? (
                  <Alert variant="destructive">
                    <AlertTitle>Registration failed</AlertTitle>
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                ) : null}

                <Field className="flex flex-col gap-4">
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Creating account..." : "Create account"}
                  </Button>
                  <FieldSeparator>or continue with</FieldSeparator>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={!!oauthPending}
                      onClick={() => handleOAuth("google")}
                    >
                      <Image
                        src="/google.png"
                        alt="Google"
                        width={18}
                        height={18}
                        className="mr-2"
                      />
                      Google
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={!!oauthPending}
                      onClick={() => handleOAuth("github")}
                    >
                      <Image
                        src="/github.png"
                        alt="GitHub"
                        width={18}
                        height={18}
                        className="mr-2"
                      />
                      GitHub
                    </Button>
                  </div>
                  <FieldDescription className="text-center">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="underline-offset-4 hover:underline"
                    >
                      Log in
                    </Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
