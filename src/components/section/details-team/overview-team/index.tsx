import { type Event, type Team, type Receipt, type Vote, Participates, User } from "@prisma/client";
import { ArrowRightIcon, Loader2Icon, Plus } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Button } from "../../../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../ui/card";
import CreateVote from "../create-vote";

type OverviewTeamProps = {
  userId: string;
  role: string;
  team: Team & { members: (Participates & { user: User })[] };
  events: (Event & { votes: Vote[] })[];
  setEvents: Dispatch<SetStateAction<(Event & { votes: Vote[] })[]>>;
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
  setEvents,
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
        <br/>
        <p className="text-2xl">{team.description}</p>
        <p> link de convite : <a target="_blank" href={window.location.href+team.invite}>{window.location.href+team.invite}</a></p>
      </section>

      <hr className="my-4" />

      <section>
        <h2 className="text-3xl font-black">Membros</h2>
        <p className="text-xl">
          Veja todos os membros que estão no time
        </p>

        <Button
          className="flex flex-row items-center justify-center gap-2 p-0"
          variant={"link"}
        >
          {"Gerenciar"}
          <ArrowRightIcon className="h-3 w-3" />
        </Button>

        <div className="grid auto-rows-auto grid-cols-1 gap-4 md:grid-cols-3">
          {team?.members?.map((member, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{member.user.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{member.user.email}</p>
                <p>{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
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
          {"Gerenciar"}
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
                  { receipt.paid && <p className="text-green-500">Pago</p> }
                  { !receipt.paid && <p className="text-red-500">Não pago</p> }
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
          {"Gerenciar"}
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
                  <br/>
                  { role == "OWNER" && <div>
                    <p>Confirmados: <strong>{event.votes.filter(vote => vote.confirmed).length}</strong></p>
                    <p>Não confirmados: <strong>{event.votes.filter(vote => !vote.confirmed).length}</strong></p>
                  </div>}

                  { !event.votes.find(vote => vote.userId == userId) && <div>
                    <br/>
                    <CreateVote eventId={event.id} userId={userId} setEvents={setEvents} />
                  </div> }

                  { event.votes.find(vote => vote.userId == userId) && <div>
                    <br/>
                    {event.votes.find(vote => vote.userId == userId)?.confirmed && <p className="text-green-500">Presença confirmada</p>}
                    {!event.votes.find(vote => vote.userId == userId)?.confirmed && <p className="text-red-500">Presença não confirmada</p>}
                  </div>}

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
