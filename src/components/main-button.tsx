import { clsx } from "clsx";

type Props = {
  onClick?: () => void;
  label: string;
  description?: string;
};

const MainButton = ({ onClick, label, description }: Props) => {
  return (
    <button
      className={clsx(
        "group relative bg-white text-white rounded-md tracking-widest py-4 transition-all duration-500 min-w-2xs w-full max-w-sm",
        "hover:bg-red hover:text-red hover:animate-red-glow",
        "before:absolute before:inset-0.5 before:bg-neutral-800 before:rounded-sm"
      )}
      onClick={onClick}
    >
      <div className="relative">
        <h2 className="uppercase text-lg group-hover:tracking-[0.25em] transition-all duration-500">{label}</h2>
        <p className="text-base">{description}</p>
      </div>
      <i
        className={clsx(
          "before:absolute before:top-0 before:left-4/5 before:w-2.5 before:h-1 before:bg-neutral-800 before:skew-x-[325deg] before:duration-500",
          "after:absolute after:bottom-0 after:left-1/5 after:w-2.5 after:h-1 after:bg-neutral-800 after:skew-x-[325deg] after:duration-500",
          "group-hover:before:left-1/5 group-hover:after:left-4/5"
        )}
      />
    </button>
  );
};

export default MainButton;
