import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../../ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "../../../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../../ui/input";
import { useState, type MouseEventHandler, Dispatch, SetStateAction } from "react";
import { CalendarIcon, Loader2Icon } from "lucide-react";
import { api } from "../../../../utils/api";
import { RadioGroup, RadioGroupItem } from "../../../ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "../../../ui/popover";
import { cn } from "../../../../lib/utils";
import { format } from "date-fns";
import { Calendar } from "../../../ui/calendar";
import { type Event } from "@prisma/client";

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Nome precisa ser pelo menos 5 caracteres",
  }),
  description: z.string(),
  type: z.enum(["treino", "jogo", "campeonato"], {
    required_error: "Tipo de evento é obrigatório",
  }),
  startAt: z.date(),
  endAt: z.date(),
});

type CreateEventProps = {
  onCancel: MouseEventHandler<HTMLButtonElement>;
  onCreate: () => void;
  teamId: string;
  setEvents: Dispatch<SetStateAction<Event[]>>;
};

export default function CreateEvent({
  onCancel,
  onCreate,
  teamId,
  setEvents,
}: CreateEventProps) {
  const [isLoading, setIsLoading] = useState(false);
  const mutate = api.event.create.useMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      startAt: new Date(),
      endAt: new Date(),
      type: "treino",
    },
  });

  const onSubmitCreate = async (values: z.infer<typeof formSchema>) => {
    await mutate.mutateAsync({
      title: values.title,
      description: values.description,
      startAt: values.startAt,
      endAt: values.endAt,
      type: values.type as string,
      teamId,
    });

    console.log("??")
    setEvents((events) => {
      const newEvents = [...events];
      newEvents.push({
        title: values.title,
        description: values.description,
        startAt: values.startAt,
        endAt: values.endAt,
        type: values.type as string,
        teamId,
      });
      return newEvents;
    })

    onCreate();
  };

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
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titulo</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Titulo do evento</FormDescription>
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
                <FormDescription>Descrição do evento</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Tipo do evento</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="treino" />
                      </FormControl>
                      <FormLabel className="font-normal">Treino</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="campeonato" />
                      </FormControl>
                      <FormLabel className="font-normal">Campeonato</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="amistoso" />
                      </FormControl>
                      <FormLabel className="font-normal">Amistoso</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startAt"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de inicio do evento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Escolha uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>Data que começa o evento.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endAt"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data do fim do evento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Escolha uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date.getTime() < form.getValues("startAt").getTime()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>Data que o evento acaba.</FormDescription>
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
