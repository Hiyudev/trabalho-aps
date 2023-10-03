import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import Image from "next/image";
import {
  TooltipTrigger,
  Tooltip,
  TooltipProvider,
  TooltipContent,
} from "../components/ui/tooltip";
import { Button } from "../components/ui/button";
import { SignOut } from "@phosphor-icons/react";
import { useState } from "react";
import { type Team } from "../@types/team";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function Home() {
  const [team, setTeam] = useState<Team>();

  const teams = api.team.getAll.useQuery();
  const events = api.event.getAll.useQuery();

  const handleSelectTeam = (team: Team) => {
    setTeam(team);
  };

  return (
    <>
      <Head>
        <title>Atletou</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-w-screen flex min-h-screen flex-row bg-zinc-900 text-white">
        {/* Sidebar */}
        <nav className="flex flex-shrink-0 flex-col justify-between bg-zinc-900 border-r border-zinc-700 p-4">
          <div className="flex flex-col gap-2">
            <Link className="mb-8" href="/">
              <Image
                width={48}
                height={48}
                alt={"Atletou's logo"}
                src={"./assets/Logo.svg"}
              />
            </Link>

            {teams.data?.map((team) => (
              <TooltipProvider key={team.id}>
                <Tooltip delayDuration={200}>
                  <TooltipTrigger>
                    <button onClick={() => handleSelectTeam(team)}>
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={team.icon} />
                        <AvatarFallback>Team</AvatarFallback>
                      </Avatar>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    className="bg-zinc-900 text-white"
                    side="right"
                  >
                    {team.name}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>

          <Button className="flex-end h-12 w-12">
            <SignOut />
          </Button>
        </nav>

        {/* Sidebar */}
        <main className="flex flex-col p-4 flex-grow">
          {team ? (
            <>
              <section>
                <h1 className="">Bem-vindos ao time {team.name}</h1>
                <p>{team.description}</p>
              </section>

              <section className="flex flex-col space-y-8 w-full">
                <p>Proximos eventos...</p>

                <ul className="flex flex-col gap-4 sm:flex-row">
                  {events.data?.map((event) => {
                    const translatedType = event.type === 'training' ? 'Treino' : 'Jogo';

                    return (
                      <li key={event.id}>
                        <Card className="bg-zinc-900 border-zinc-700 text-white">
                          <CardHeader>
                            <CardTitle>{event.title}</CardTitle>
                            <CardDescription>{translatedType}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p>{event.description}</p>
                          </CardContent>
                          <CardFooter>
                            <p className="text-zinc-500">Starts in: {event.startAt.toDateString()}</p>
                          </CardFooter>
                        </Card>
                      </li>
                    )
                  })}
                </ul>
              </section>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-center text-2xl text-white">
                Select a team to start
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
