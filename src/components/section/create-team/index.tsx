import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "../../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../ui/input";
import { useState, type MouseEventHandler } from "react";
import { Loader2Icon } from "lucide-react";
import { api } from "../../../utils/api";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  name: z.string().min(5, {
    message: "Nome precisa ser pelo menos 5 caracteres",
  }),
  description: z.string(),
});

type CreateTeamProps = {
  onCancel: MouseEventHandler<HTMLButtonElement>;
  onCreate: () => void;
};

export default function CreateTeam({
  onCancel,
  onCreate,
}: CreateTeamProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { data } = useSession();
  const mutate = api.team.create.useMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmitCreate = async (values: z.infer<typeof formSchema>) => {
    await mutate.mutateAsync({
      name: values.name,
      description: values.description,
      userId: data?.user.id ?? "",
    })

    onCreate();
  }

  const onSubmitForm = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();

    setIsLoading(true);

    await form.handleSubmit(onSubmitCreate)(e);

    setIsLoading(false);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={onSubmitForm} className="w-full space-y-8 rounded-md">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Nome do time</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Descrição do time</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-row justify-between">
            <Button
              disabled={isLoading}
              onClick={onCancel}
              type="button"
              variant={"ghost"}
            >
              {"Voltar"}
            </Button>
            <Button disabled={isLoading} type="submit">
              {isLoading ? <Loader2Icon className="animate-spin" /> : "Criar"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
