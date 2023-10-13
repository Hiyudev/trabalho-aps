import { SignOut } from "@phosphor-icons/react";
import { type Team } from "@prisma/client";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../components/ui/avatar";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../../components/ui/tooltip";
import { Plus } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import { Logo } from "../../components/icons/Logo";
import { ThemeToggle } from "../../components/section/themetoggle";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import CreateTeamPage from "../../components/section/create-team";
import DetailsTeam from "../../components/section/details-team";
import ListTeam from "../../components/section/list-team";

export default function Dashboard() {
  const [phase, setPhase] = useState<"select-team" | "team" | "create-team">(
    "select-team",
  );
  const [team, setTeam] = useState<Team>();

  const { data } = useSession();
  const handleSelectTeam = (team: Team) => {
    setTeam(team);
    setPhase("team");
  };

  const handleOnSignOut = async () => {
    await signOut();
  };

  const handleCreateTeam = () => {
    setPhase("create-team");
  };

  const onCancelTeamCreation = () => {
    setPhase("select-team");
  };

  const onCreateTeam = () => {
    setPhase("select-team");
  };

  const handleReset = () => {
    setPhase("select-team");
    setTeam(undefined);
  };

  return (
    <>
      <Head>
        <title>Atletou</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-w-screen flex min-h-screen flex-row">
        {/* Sidebar */}
        <nav className="flex flex-shrink-0 flex-col justify-between border-r p-4">
          <div className="flex flex-col gap-2">
            <Link
              className="mb-8 h-10 w-10"
              href="/dashboard"
              onClick={handleReset}
            >
              <Logo />
            </Link>

            <ListTeam
              key={phase}
              userId={data?.user.id ?? ""}
              handleSelectTeam={handleSelectTeam}
            />

            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger
                  onClick={handleCreateTeam}
                  className="flex h-10 w-10 items-center justify-center"
                >
                  <Plus />
                </TooltipTrigger>
                <TooltipContent side="right">
                  {"Criar um novo time"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex flex-col gap-4">
            <ThemeToggle />

            <Avatar>
              {data?.user.image && <AvatarImage src={data?.user.image} />}
              <AvatarFallback>{data?.user.name}</AvatarFallback>
            </Avatar>

            <Button onClick={() => void handleOnSignOut()} size={"icon"}>
              <SignOut />
            </Button>
          </div>
        </nav>

        {/* Sidebar */}
        <main className="flex flex-grow flex-col p-4">
          {phase === "create-team" && (
            <CreateTeamPage
              onCancel={onCancelTeamCreation}
              onCreate={onCreateTeam}
            />
          )}

          {phase === "team" && team && (
            <DetailsTeam teamId={team.id} onDeleteTeam={handleReset} />
          )}
        </main>
      </div>
    </>
  );
}
