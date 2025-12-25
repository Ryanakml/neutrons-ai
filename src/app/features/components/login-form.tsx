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

const loginSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type LoginFormProps = React.ComponentProps<"div">;

export function LoginForm({ className, ...props }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formError, setFormError] = useState<string | null>(null);
  const [oauthPending, setOauthPending] = useState<"google" | "github" | null>(
    null
  );

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null);
    const callbackURL = searchParams.get("callbackUrl") ?? "/";

    try {
      const { data, error } = await authClient.signIn.email({
        ...values,
        callbackURL,
      });

      if (error) {
        setFormError(error.message ?? "Unable to login. Please try again.");
        return;
      }

      const redirectTo = data?.url ?? callbackURL;
      router.push(redirectTo);
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
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email and password to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
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
                      <div className="flex items-center">
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Link
                          href="#"
                          className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <FieldContent>
                        <FormControl>
                          <Input
                            {...field}
                            id="password"
                            type="password"
                            autoComplete="current-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FieldContent>
                    </Field>
                  )}
                />

                {formError ? (
                  <Alert variant="destructive">
                    <AlertTitle>Login failed</AlertTitle>
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                ) : null}

                <Field className="flex flex-col gap-4">
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Logging in..." : "Login"}
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
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/register"
                      className="underline-offset-4 hover:underline"
                    >
                      Sign up
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
