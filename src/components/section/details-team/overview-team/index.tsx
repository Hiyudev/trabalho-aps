import { type Event, type Team, type Receipt } from "@prisma/client";
import { ArrowRightIcon, Loader2Icon, Plus } from "lucide-react";
import { Button } from "../../../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../ui/card";

type OverviewTeamProps = {
  userId: string;
  role: string;
  team: Team;
  events: Event[];
  receipts: Receipt[];
  handleEnterCreateEvent: () => void;
  handleEnterCreateReceipt: () => void;
};

export default function OverviewTeam({
  userId,
  role,
  team,
  receipts,
  events,
  handleEnterCreateEvent,
  handleEnterCreateReceipt
}: OverviewTeamProps) {
  
  const handleEnterCreationEvent = () => {
    handleEnterCreateEvent();
  };

  const handleEnterCreationReceipt = () => {
    handleEnterCreateReceipt();
  };

  if (!team) {
    return (
      <>
        <Loader2Icon />
      </>
    );
  }

  return (
    <div>
      <section>
        <h1 className="text-4xl font-black">Bem-vindo(a) ao {team.name}!</h1>
        <p className="text-2xl">{team.description}</p>
      </section>

      <hr className="my-4" />

      <section>
        <h2 className="text-3xl font-black">Pagamentos</h2>
        <p className="text-xl">
          Veja todos os pagamentos que estão acontecendo
        </p>
        <Button
          className="flex flex-row items-center justify-center gap-2 p-0"
          variant={"link"}
        >
          {"Veja mais"}
          <ArrowRightIcon className="h-3 w-3" />
        </Button>

        <section>
          <div className="grid auto-rows-auto grid-cols-1 gap-4 md:grid-cols-3">
            { role === "OWNER" && <Button
              className="h-full w-full"
              variant={"outline"}
              onClick={handleEnterCreationReceipt}
            >
              <Plus />
            </Button> }
            {(role == "OWNER" ? receipts : receipts.filter(receipt=>receipt.userId == userId)).map((receipt) => (
              <Card key={receipt.id}>
                <CardHeader>
                  <CardTitle>Pagamento R$ {Number(receipt.money).toFixed(2)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{(receipt as any)?.user?.name}</p>
                  <p>{receipt.paid ? "Pago" : "Não pago"}</p>
                </CardContent>
                <CardFooter>
                  <div>
                    <p>Começa em:</p>
                    <p>{receipt.startAt.toDateString()}</p>
                  </div>
                  <div>
                    <p>Termina em:</p>
                    <p>{receipt.endAt.toDateString()}</p>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </section>

      <hr className="my-4" />

      <section>
        <h2 className="text-3xl font-black">Eventos</h2>
        <p className="text-xl">
          Veja todos os eventos que estão acontecendo, ou que irão acontecer
        </p>
        <Button
          className="flex flex-row items-center justify-center gap-2 p-0"
          variant={"link"}
        >
          {"Veja mais"}
          <ArrowRightIcon className="h-3 w-3" />
        </Button>

        <section>
          <div className="grid auto-rows-auto grid-cols-1 gap-4 md:grid-cols-3">
            { role === "OWNER" && <Button
              className="h-full w-full"
              variant={"outline"}
              onClick={handleEnterCreationEvent}
            >
              <Plus />
            </Button> }
            {events.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{event.description}</p>
                  <p>{event.type}</p>
                </CardContent>
                <CardFooter>
                  <div>
                    <p>Começa em:</p>
                    <p>{event.startAt.toDateString()}</p>
                  </div>
                  <div>
                    <p>Termina em:</p>
                    <p>{event.endAt.toDateString()}</p>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </section>
      <hr className="my-4" />
    </div>
  );
}
