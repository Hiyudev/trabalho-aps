import { Button } from "../../ui/button";
import { CalendarIcon, CogIcon } from "lucide-react";
import { useEffect, useState } from "react";
import ConfigTeam from "./config-team";
import OverviewTeam from "./overview-team";
import { api } from "../../../utils/api";
import { type Team, type Event } from "@prisma/client";
import CreateEvent from "./create-event";

type DetailsTeamProps = {
  teamId: string;
  onDeleteTeam: () => void;
};

export default function DetailsTeam({
  teamId,
  onDeleteTeam,
}: DetailsTeamProps) {
  const [team, setTeam] = useState<Team>({} as Team);
  const [events, setEvents] = useState<Event[]>([] as Event[]);
  const [phase, setPhase] = useState<"team" | "config-team" | "create-event">(
    "team",
  );

  const { data } = api.team.getById.useQuery({
    id: teamId,
  });

  useEffect(() => {
    if (!data) return;
    setTeam(data);
    setEvents(data.events ?? []);
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
  };

  const handleOnCancelCreateEvent = () => {
    setPhase("team");
  };

  return (
    <div className="flex flex-col gap-4">
      <nav className="flex w-full flex-row justify-end">
        <div className="flex flex-row justify-center gap-4">
          <Button variant={"secondary"} size={"icon"}>
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
            team={team}
            events={events}
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
      </main>
    </div>
  );
}
