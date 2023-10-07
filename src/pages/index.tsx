import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
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
import { ThemeToggle } from "../components/section/themetoggle";
import { Logo } from "../components/icons/Logo";
import { useRouter } from "next/router";
import { Loader2Icon } from "lucide-react";

export default function Home() {
  const { status } = useSession();
  const [team, setTeam] = useState<Team>();
  const router = useRouter();

  const teams = api.team.getAll.useQuery();
  const events = api.event.getAll.useQuery();

  const handleSelectTeam = (team: Team) => {
    setTeam(team);
  };

  const handleOnSignOut = async () => {
    await signOut();
  };

  if (status === "loading") {
    return (
      <div className="min-w-screen flex min-h-screen flex-row items-center justify-center">
        <Loader2Icon className="h-8 w-8" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    if (typeof window !== "undefined") {
      void signIn();
    }

    return (
      <div className="min-w-screen flex min-h-screen flex-row items-center justify-center">
        <Loader2Icon className="h-8 w-8" />
      </div>
    );
  }

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
            <Link className="mb-8 h-12 w-12" href="/">
              <Logo />
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
                  <TooltipContent side="right">{team.name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <ThemeToggle />

            <Button
              onClick={() => void handleOnSignOut()}
              className="flex-end h-12 w-12"
            >
              <SignOut />
            </Button>
          </div>
        </nav>

        {/* Sidebar */}
        <main className="flex flex-grow flex-col p-4">
          {team ? (
            <>
              <section>
                <h1 className="">Bem-vindos ao time {team.name}</h1>
                <p>{team.description}</p>
              </section>

              <section className="flex w-full flex-col space-y-8">
                <p>Proximos eventos...</p>

                <ul className="flex flex-col gap-4 sm:flex-row">
                  {events.data?.map((event) => {
                    const translatedType =
                      event.type === "training" ? "Treino" : "Jogo";

                    return (
                      <li key={event.id}>
                        <Card>
                          <CardHeader>
                            <CardTitle>{event.title}</CardTitle>
                            <CardDescription>{translatedType}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p>{event.description}</p>
                          </CardContent>
                          <CardFooter>
                            <CardDescription>
                              Starts in: {event.startAt.toDateString()}
                            </CardDescription>
                          </CardFooter>
                        </Card>
                      </li>
                    );
                  })}
                </ul>
              </section>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-center text-2xl">Select a team to start</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
