import { Avatar, AvatarImage, AvatarFallback } from "../../ui/avatar";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../../ui/tooltip";
import { api } from "../../../utils/api";
import { type Team } from "@prisma/client";
import { TeamDetails } from "~/pages/dashboard";

type ListTeamProps = {
  userId: string;
  handleSelectTeam: (team: TeamDetails) => void;
};

export default function ListTeam({ userId, handleSelectTeam }: ListTeamProps) {
  const user = api.user.getWithDetails.useQuery({
    id: userId,
  });
  const teams = user.data?.teams ?? [];

  return teams?.map((team) => (
    <TooltipProvider key={team.id}>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <button onClick={() => handleSelectTeam(team)}>
            <Avatar className="flex h-10 w-10">
              <AvatarImage
                src={"https://placehold.co/512x512/orange/white.png"}
              />
              <AvatarFallback>Team</AvatarFallback>
            </Avatar>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">{team.name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ));
}
