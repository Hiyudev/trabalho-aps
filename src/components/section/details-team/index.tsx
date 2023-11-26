import { Button } from "../../ui/button";
import { CalendarIcon, CogIcon } from "lucide-react";
import { useEffect, useState } from "react";
import ConfigTeam from "./config-team";
import OverviewTeam from "./overview-team";
import { api } from "../../../utils/api";
import { type Team, type Event, type Receipt, type Vote, type Participates, type User } from "@prisma/client";
import CreateEvent from "./create-event";
import CreateReceipt from "./create-receipt";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
type TeamDetails = {
  description: string;
  id: string;
  invite: string;
  name: string;
  role: string;
  updatedAt: Date;
  createdAt: Date;
};
type DetailsTeamProps = {
  userId: string;
  teamId: string;
  role: string;
  onDeleteTeam: () => void;
};

export default function DetailsTeam({
  userId,
  teamId,
  role,
  onDeleteTeam,
}: DetailsTeamProps) {
  const [team, setTeam] = useState<Team & { members: (Participates & { user: User })[] }>({} as Team & { members: (Participates & { user: User })[] });
  const [receipts, setReceipts] = useState<Receipt[]>([] as Receipt[]);
  const [events, setEvents] = useState<(Event & { votes: Vote[] })[]>([] as (Event & { votes: Vote[] })[]);
  const [phase, setPhase] = useState<"team" | "config-team" | "create-event" | "create-receipt">(
    "team",
  );
  const [showMessageSucess , setShowMessageSucess] = useState(false)
  const [descriptionMessage , setDescriptionMessage] = useState("");
  const { data } = api.team.getById.useQuery({
    id: teamId,
  });

  useEffect(() => {
    if (!data) return;
    setTeam(data as unknown as Team & { members: (Participates & { user: User })[] });
    setEvents(data.events ?? []);
    setReceipts(data.receipts ?? []);
  }, [data]);

  useEffect(() => {
    if (!teamId) return;
    setPhase("team");
  }, [teamId]);

  const handleOnConfigurations = () => {
    setPhase((prev) => (prev === "team" ? "config-team" : "team"));
  };

  const handleCancelConfiguration = () => {

    setPhase("team");
  };
  const handleOnUpdate = () => {
    setPhase("team");
  };

  const handleEnterCreateEvent = () => {
    setPhase("create-event");
  };
  const handleOnCreateEvent = () => {
    setPhase("team");
    setDescriptionMessage("O evento foi criado com sucesso")
    setShowMessageSucess(true);
  };
  const onCloseMessage = (open: boolean) => {
    setShowMessageSucess(open);
  };
  const handleOnCancelCreateEvent = () => {
    setPhase("team");
  };

  const handleEnterCreateReceipt = () => {
    setPhase("create-receipt");
    
  };
  const handleOnCreateReceipt = () => {
    setPhase("team");
    setDescriptionMessage("O pagamento foi criado com sucesso")
    setShowMessageSucess(true);
    
  };
  const handleOnCancelCreateReceipt = () => {
    setPhase("team");
  };

  return (
    <div className="flex flex-col gap-4">
      <nav className="flex w-full flex-row justify-end">
        <div className="flex flex-row justify-center gap-4">
        <Dialog onOpenChange={onCloseMessage} open={showMessageSucess}> 
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sucesso</DialogTitle>
            <DialogDescription>
              {descriptionMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-between">
            <Button onClick={() => setShowMessageSucess(false)}>
              Okay
            </Button>
          </DialogFooter>
        </DialogContent>
        </Dialog>
          <Button
            variant={"secondary"}
            size={"icon"}
          >
            <CalendarIcon className="h-6 w-6" />
          </Button>

          <Button
            onClick={handleOnConfigurations}
            variant={"secondary"}
            size={"icon"}
          >
            <CogIcon className="h-6 w-6" />
          </Button>
        </div>
      </nav>

      <main>
        
        {phase === "team" && (
          <OverviewTeam
            userId={userId}
            role={role}
            team={team}
            receipts={receipts}
            events={events}
            setEvents={setEvents}
            handleEnterCreateReceipt={handleEnterCreateReceipt}
            handleEnterCreateEvent={handleEnterCreateEvent}
          />
        )}

        {phase === "config-team" && (
          <ConfigTeam
            onDeleteTeam={onDeleteTeam}
            onCancel={handleCancelConfiguration}
            onUpdate={handleOnUpdate}
            team={team ?? ({} as Team)}
            setTeam={setTeam}
          />
        )}

        {phase === "create-event" && (
          <CreateEvent
            onCancel={handleOnCancelCreateEvent}
            onCreate={handleOnCreateEvent}
            setEvents={setEvents}
            teamId={team.id}
          />
        )}

        {phase === "create-receipt" && (
          <CreateReceipt
            onCancel={handleOnCancelCreateReceipt}
            onCreate={handleOnCreateReceipt}
            setReceipts={setReceipts}
            teamId={team.id}
          />
        )}
      </main>
    </div>
  );
}
