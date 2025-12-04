import clsx from "clsx";
import { ClueType } from "@/constants/enums";

type ClueButtonProps = {
  children?: React.ReactNode;
  disabled?: boolean;
  isActive?: boolean;
  onClick?: () => void;
  triesUntilClue?: number;
  type?: ClueType;
};

const ClueButton = ({
  children,
  disabled,
  isActive = false,
  onClick,
  triesUntilClue,
  type
}: ClueButtonProps) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        className={clsx(
          "rounded-full p-3 border-2 flex items-center justify-center mx-auto mt-4",
          "transition-all duration-200",
          isActive && !disabled
            ? "bg-gradient-to-b from-red to-darkest-red border-red shadow-lg shadow-red-600/50"
            : "not-disabled:bg-gradient-to-b from-red to-darkest-red border-white hover:not-disabled:to-dark-red not-disabled:animate-jump animate-once",
          "disabled:cursor-not-allowed disabled:opacity-75"
        )}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
      <div className="flex flex-col items-center">
        <p
          className={clsx(
            "-mb-0.5 transition-all duration-200",
            disabled ? "text-sm" : "text-lg -mt-0.5",
            isActive && !disabled ? "text-red-600 font-bold" : ""
          )}
        >
          {type} {disabled && "Clue"}
        </p>
        {disabled && (
          <p className="text-sm -mt-0.5">in {triesUntilClue} tries</p>
        )}
      </div>
    </div>
  );
};

export default ClueButton;
