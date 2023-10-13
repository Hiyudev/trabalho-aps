import { Loader2Icon } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-w-screen flex min-h-screen flex-row items-center justify-center">
        <Loader2Icon className="h-8 w-8" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    if (typeof window !== "undefined") {
      void signIn("auth0");
    }

    return (
      <div className="min-w-screen flex min-h-screen flex-row items-center justify-center">
        <Loader2Icon className="h-8 w-8" />
      </div>
    );
  }

  router.push("/dashboard");
}
