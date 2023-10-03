import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from '../../components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form";
import * as z from "zod"
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

export default function SignInPage() {
  const formSchema = z.object({
    email: z.string().email({
      message: "O campo 'email' deve ser um email válido"
    }),
    password: z.string()
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <>
      <main className="min-w-screen min-h-screen bg-zinc-900 flex justify-center items-center">
        <Tabs defaultValue="login" className="dark p-4 border rounded-md">
          <TabsList>
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input className="dark" placeholder="joao@mail.com" {...field} />
                      </FormControl>
                      <FormDescription>Seu e-mail</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
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

                <Button variant={"default"} type="submit">Submit</Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="register">
            Change your password here.
          </TabsContent>
        </Tabs>


      </main>
    </>
  )
}
