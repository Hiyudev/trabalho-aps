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
import { type Receipt, type Event } from "@prisma/client";

const formSchema = z.object({
  money: z.number(),
  startAt: z.date(),
  endAt: z.date(),
});

type CreateEventProps = {
  onCancel: MouseEventHandler<HTMLButtonElement>;
  onCreate: () => void;
  teamId: string;
  setReceipts: Dispatch<SetStateAction<Receipt[]>>;
};

export default function CreateReceipt({
  onCancel,
  onCreate,
  teamId,
  setReceipts,
}: CreateEventProps) {
  const [isLoading, setIsLoading] = useState(false);
  const mutate = api.receipt.createForAllUserMembers.useMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      money: 0,
      startAt: new Date(),
      endAt: new Date(),
    },
  });

  const onSubmitCreate = async (values: z.infer<typeof formSchema>) => {
    await mutate.mutateAsync({
      money: values.money,
      startAt: values.startAt,
      endAt: values.endAt,
      createdAt: new Date(),
      updatedAt: new Date(),
      teamId,
    }).then((receipt) => {
      setReceipts((receipt) => {
        const newReceipt = [...receipt];
        newReceipt.push({
          startAt: values.startAt,
          endAt: values.endAt,
          teamId,
          id: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          money: values.money,
          userId: "",
          paid: false
        });
        return newReceipt;
      })
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
            name="startAt"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de inicio do pagamento</FormLabel>
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
                <FormDescription>Data que começa o pagamento.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endAt"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data do fim do pagamento</FormLabel>
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
                <FormDescription>Data que o evento pagamento.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="money"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Valor do pagamento</FormLabel>
                <FormControl>
                <Input
                type="number"
                {...field}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  field.onChange(value);
                }}
              />
                </FormControl>
                <FormDescription>(valor em reais)</FormDescription>
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
