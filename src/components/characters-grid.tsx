"use client";

import { kdamThmorPro } from "@/fonts";
import { capitalize } from "@/lib/stringUtils";
import { Character } from "@/types/prisma";
import clsx from "clsx";
import { useCallback, useRef, useLayoutEffect, useState, memo } from "react";

type CharactersGridProps = {
  attempts: Character[];
  character: Character;
  newAttemptId?: string; // ID of the most recent attempt to animate
};

const CharactersGrid = memo(
  ({ attempts, character, newAttemptId }: CharactersGridProps) => {
    const [overflowStates, setOverflowStates] = useState<{
      [key: string]: boolean;
    }>({});
    const elementRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    const checkTeamStatus = useCallback(
      (attempt: Character) => {
        const attemptTeamIds = (attempt.teams || []).map((t) => t.id).sort();
        const characterTeamIds = (character.teams || [])
          .map((t) => t.id)
          .sort();
        let teamStatus: "correct" | "partial" | "incorrect" = "incorrect";

        if (attemptTeamIds.length === 0 && characterTeamIds.length === 0) {
          teamStatus =
            attemptTeamIds.length === characterTeamIds.length
              ? "correct"
              : "incorrect";
        } else if (
          attemptTeamIds.length === characterTeamIds.length &&
          attemptTeamIds.every((id, idx) => id === characterTeamIds[idx])
        ) {
          teamStatus = "correct";
        } else if (attemptTeamIds.some((id) => characterTeamIds.includes(id))) {
          teamStatus = "partial";
        }

        return teamStatus;
      },
      [character]
    );

    useLayoutEffect(() => {
      attempts.forEach((attempt) => {
        const element = elementRefs.current[attempt.id];
        if (element) {
          const hasOverflow = element.scrollHeight > element.clientHeight;

          setOverflowStates((prev) => {
            if (prev[attempt.id] !== hasOverflow) {
              return { ...prev, [attempt.id]: hasOverflow };
            }
            return prev;
          });
        }
      });
    }, [attempts]);

    return (
      <div className="w-full my-8 max-w-[620px] flex flex-col gap-2">
        <div className="grid grid-cols-6 gap-2 text-xl text-center uppercase">
          <p className="border-b-2 border-white flex items-center justify-center">
            Character
          </p>
          <p className="border-b-2 border-white flex items-center justify-center">
            Gender
          </p>
          <p className="border-b-2 border-white flex items-center justify-center">
            Species
          </p>
          <p className="border-b-2 border-white flex items-center justify-center">
            Affiliations
          </p>
          <p className="border-b-2 border-white flex items-center justify-center">
            Status
          </p>
          <p className="border-b-2 border-white flex items-center justify-center">
            First Appearance
          </p>
        </div>
        <div className={`${kdamThmorPro.className} flex flex-col gap-2`}>
          {attempts.map((attempt) => {
            const teamStatus = checkTeamStatus(attempt);
            const hasOverflow = overflowStates[attempt.id] || false;
            const isNewAttempt = attempt.id === newAttemptId;

            return (
              <div
                key={attempt.id}
                className="grid grid-cols-6 gap-2 text-center h-20 justify-center text-sm"
              >
                <div
                  className={clsx(
                    "rounded border-2 bg-dark-red w-20 aspect-square mx-auto flex flex-col justify-center items-center",
                    attempt.id !== character.id &&
                      isNewAttempt &&
                      "animate-shake animate-duration-200 animate-delay-[1800ms] animate-ease-in-out",
                    attempt.id === character.id && "bg-correct",
                    attempt.id !== character.id && "bg-incorrect"
                  )}
                >
                  <img
                    src={attempt.imageUrl}
                    alt={attempt.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div
                  className={clsx(
                    "rounded border-2 w-20 mx-auto flex flex-col justify-center items-center",
                    isNewAttempt &&
                      "animate-flip-up animate-duration-300 animate-delay-100 animate-ease-in-out",
                    attempt.gender === character.gender
                      ? "bg-correct"
                      : "bg-incorrect"
                  )}
                >
                  {capitalize(attempt.gender)}
                </div>
                <div
                  className={clsx(
                    "rounded border-2 w-20 mx-auto flex flex-col justify-center items-center",
                    isNewAttempt &&
                      "animate-flip-up animate-duration-300 animate-delay-[400ms] animate-ease-in-out",
                    attempt.species === character.species
                      ? "bg-correct"
                      : "bg-incorrect"
                  )}
                >
                  {capitalize(attempt.species)}
                </div>
                <div
                  ref={(el) => {
                    elementRefs.current[attempt.id] = el;
                  }}
                  className={clsx(
                    "rounded border-2 w-20 mx-auto flex flex-col items-center",
                    isNewAttempt &&
                      "animate-flip-up animate-duration-300 animate-delay-[800ms] animate-ease-in-out",
                    "overflow-scroll",
                    hasOverflow ? "justify-start" : "justify-center",
                    {
                      "bg-correct": teamStatus === "correct",
                      "bg-partial": teamStatus === "partial",
                      "bg-incorrect": teamStatus === "incorrect"
                    }
                  )}
                >
                  {attempt.teams?.length
                    ? attempt.teams.map((team) => (
                        <p key={team.id}>{capitalize(team.name)}</p>
                      ))
                    : "None"}
                </div>
                <div
                  className={clsx(
                    "rounded border-2 w-20 mx-auto flex flex-col justify-center items-center",
                    isNewAttempt &&
                      "animate-flip-up animate-duration-300 animate-delay-[1200ms] animate-ease-in-out",
                    attempt.status === character.status
                      ? "bg-correct"
                      : "bg-incorrect"
                  )}
                >
                  {capitalize(attempt.status)}
                </div>
                <div
                  className={clsx(
                    "rounded border-2 w-20 mx-auto flex flex-col justify-center items-center relative",
                    isNewAttempt &&
                      "animate-flip-up animate-duration-300 animate-delay-[1600ms] animate-ease-in-out",
                    attempt.firstAppearance === character.firstAppearance
                      ? "bg-correct"
                      : "bg-incorrect"
                  )}
                >
                  {attempt.firstAppearance !== character.firstAppearance && (
                    <img
                      src="/images/ui/arrow_up.svg"
                      alt=""
                      role="presentation"
                      aria-hidden="true"
                      className={clsx("invert absolute opacity-30 p-2", {
                        "rotate-180":
                          attempt.firstAppearance > character.firstAppearance
                      })}
                    />
                  )}
                  {attempt.firstAppearance}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
  (prevProps: CharactersGridProps, nextProps: CharactersGridProps) => {
    // Returns true if props are equal (no re-render needed)
    // Returns false if props are different (re-render needed)

    // Compare character ID
    if (prevProps.character.id !== nextProps.character.id) return false;

    // Compare attempts length
    if (prevProps.attempts.length !== nextProps.attempts.length) return false;

    // Compare each attempt ID
    for (let i = 0; i < prevProps.attempts.length; i++) {
      if (prevProps.attempts[i].id !== nextProps.attempts[i].id) return false;
    }

    // Compare newAttemptId
    if (prevProps.newAttemptId !== nextProps.newAttemptId) return false;

    // Props are equal, skip re-render
    return true;
  }
);

export default CharactersGrid;
