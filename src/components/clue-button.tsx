import clsx from "clsx";

type ClueButtonProps = {
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  triesUntilClue?: number;
  type?: "Quote" | "Image";
};

const ClueButton = ({
  children,
  disabled,
  onClick,
  triesUntilClue,
  type
}: ClueButtonProps) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        className={clsx(
          "rounded-full p-3 not-disabled:bg-gradient-to-b from-red to-darkest-red border-2 border-white flex items-center justify-center mx-auto mt-4",
          "hover:not-disabled:to-dark-red transition-all duration-200 not-disabled:animate-jump animate-once",
          "disabled:cursor-not-allowed disabled:opacity-75"
        )}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
      <div className="flex flex-col items-center">
        <p className={clsx("-mb-0.5, transition-all duration-200", disabled ? "text-sm" : "text-lg -mt-0.5")}>
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
