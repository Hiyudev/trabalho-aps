import { useState, Dispatch, SetStateAction } from "react";
import { api } from "../../../../utils/api";
import { type Event, type Vote } from "@prisma/client";


interface FormValues {
  confirmed: boolean;
  excuse: string;
}

type CreateEventProps = {
  eventId: string;
  userId: string;
  setEvents: Dispatch<SetStateAction<(Event & { votes: Vote[] })[]>>;
};

export default function CreateVote({
  eventId,
  userId,
  setEvents,
}: CreateEventProps) {
  const [isLoading, setIsLoading] = useState(false);
  const mutate = api.vote.create.useMutation();
  const [ excused, setExcused ] = useState("");


const [ stage, setStage] = useState("init");

  const onSubmitCreate = async (values: FormValues) => {
    await mutate.mutateAsync({
      userId: userId,
      eventId: eventId,
      confirmed: values.confirmed,
      excuse: values.excuse
    }).then((vote) => {
      setEvents((events) => {
        const newEvents = [...events].map((event) => {
          if(event.id === eventId) {
            return {
              ...event,
              votes: [...event.votes, vote]
            }
          }
          return event;
        })

        return newEvents;
      })
    })
  };

  const onSubmitConfirm = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    onSubmitCreate({
      confirmed: true,
      excuse: ""
    })
    setIsLoading(false);
  };

  const onSubmitCancel = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    onSubmitCreate({
      confirmed: false,
      excuse: excused
    })
    setIsLoading(false);
  }

  return (
    <>
      { stage === "init" && <>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={onSubmitConfirm}>
          Confirmar presença
        </button>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => setStage("cancel")}>
          Não irei
        </button>
      </> }
      { stage == "cancel" && <div>
        <input className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none text-black" style={{ width: "100%" }} type="text" placeholder="Justificativa" onChange={(e) => setExcused(e.target.value)}></input>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={onSubmitCancel}>
          Enviar
        </button>
      </div>}
    </>
  );
}
