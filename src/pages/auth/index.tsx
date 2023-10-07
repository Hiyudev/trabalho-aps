import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import * as z from "zod";
import { Button } from "../../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";
import { api } from "../../utils/api";
import React from "react";

export default function SignInPage() {
  const { data } = useSession();
  const mutation = api.user.register.useMutation();

  const formLoginSchema = z.object({
    email: z.string().email({
      message: "O campo 'email' deve ser um email válido",
    }),
    password: z.string(),
  });

  const loginForm = useForm<z.infer<typeof formLoginSchema>>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onLogin = async (values: z.infer<typeof formLoginSchema>) => {
    await signIn("credentials", {
      redirect: true,
      callbackUrl: "/",
    });
  }

  const submitLogin = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();

    await loginForm.handleSubmit(onLogin)(e);
  }

  const formRegisterSchema = z.object({
    name: z.string(),
    email: z.string().email({
      message: "O campo 'email' deve ser um email válido",
    }),
    password: z.string(),
  });

  const registerForm = useForm<z.infer<typeof formRegisterSchema>>({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onRegister = async (values: z.infer<typeof formRegisterSchema>) => {
    await mutation.mutateAsync({
      ...values,
    });

    await signIn("credentials");
  };

  console.log(data)

  const submitRegister = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();

    await registerForm.handleSubmit(onRegister)(e);
  };

  return (
    <>
      <Head>
        <title>Atletou</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-w-screen flex min-h-screen items-center justify-center">
        <Tabs
          defaultValue="login"
          className="dark m-4 w-full rounded-md border p-4 sm:w-96"
        >
          <TabsList>
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Form {...loginForm}>
              <form
                className="space-y-4"
                onSubmit={submitLogin}
              >
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="joao@mail.com" {...field} />
                      </FormControl>
                      <FormDescription>Seu e-mail</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input placeholder="*********" {...field} />
                      </FormControl>
                      <FormDescription>Sua senha</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button variant={"default"} type="submit">
                  Submit
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="register">
            <Form {...registerForm}>
              <form className="space-y-4" onSubmit={submitRegister}>
                <FormField
                  control={registerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="joao" {...field} />
                      </FormControl>
                      <FormDescription>Seu nome</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="joao@mail.com" {...field} />
                      </FormControl>
                      <FormDescription>Seu e-mail</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input placeholder="*********" {...field} />
                      </FormControl>
                      <FormDescription>Sua senha</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button variant={"default"} type="submit">
                  Register
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
