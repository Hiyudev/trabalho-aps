import { useForm } from "react-hook-form";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { type Dispatch, type SetStateAction, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import { api } from "../../../../utils/api";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../ui/form";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { type Team } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../ui/dialog";

const formSchema = z.object({
  name: z.string().min(5, {
    message: "Nome precisa ser pelo menos 5 caracteres",
  }),
  description: z.string(),
});

type ConfigTeamProps = {
  onDeleteTeam: () => void;
  onCancel: () => void;
  onUpdate: () => void;
  team: Team;
  setTeam: Dispatch<SetStateAction<Team>>;
};

export default function ConfigTeam({
  onDeleteTeam,
  onCancel,
  onUpdate,
  team,
  setTeam,
}: ConfigTeamProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const { data } = useSession();

  const mutateUpdate = api.team.update.useMutation();
  const mutateRemove = api.team.remove.useMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: team?.name,
      description: team?.description,
    },
  });

  const onSubmitUpdate = async (values: z.infer<typeof formSchema>) => {
    if (!data?.user?.id) return;

    await mutateUpdate.mutateAsync({
      userId: data?.user?.id,
      team: {
        id: team?.id ?? "",
        name: values.name,
        description: values.description,
      },
    });

    setTeam({
      id: team?.id ?? "",
      name: values.name,
      description: values.description,
      createdAt: team?.createdAt ?? new Date(),
      updatedAt: new Date(),
      invite: team?.invite ?? "",
    });
  };

  const onSubmitForm = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();

    setIsLoading(true);

    await form.handleSubmit(onSubmitUpdate)(e);

    setIsLoading(false);

    onUpdate();
  };

  const handleDeleteTeam = async () => {
    if (!data?.user?.id) return;

    setIsLoading(true);

    await mutateRemove.mutateAsync({
      userId: data?.user?.id,
      teamId: team?.id ?? "",
    });

    setTeam({} as Team);

    setIsLoading(false);
    onDeleteTeam();
  };

  const handleCancel = (open: boolean) => {
    setConfirm(open);
  };

  if (!team)
    return (
      <>
        <Loader2Icon />
      </>
    );

  return (
    <>
      <Dialog onOpenChange={handleCancel} open={confirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tem certeza?</DialogTitle>
            <DialogDescription>
              O time será deletado permanentemente, e não será possível reverter
              esta ação.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-between">
            <Button onClick={() => setConfirm(false)} variant={"ghost"}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setConfirm(false);
                void handleDeleteTeam();
              }}
              variant={"destructive"}
            >
              Sim, deletar time
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <section>
        <h1 className="mb-4 text-xl font-bold">Visão geral</h1>

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
                {isLoading ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  "Atualizar"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </section>

      <hr className="my-8" />

      <section className="flex flex-col gap-4">
        <div>
          <h1 className="mb-4 text-xl font-bold">Zona de perigo</h1>
          <p>Tenha cuidado das ações tomadas desta seção.</p>
        </div>
        <Button
          onClick={() => setConfirm(true)}
          variant={"destructive"}
          type="button"
        >
          {isLoading ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            "Deletar time"
          )}
        </Button>
      </section>
    </>
  );
}
