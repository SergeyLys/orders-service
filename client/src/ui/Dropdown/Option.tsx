export interface IOption<T> {
  onSelect?: (s: T) => void;
  value: T;
  default?: boolean;
  children: React.ReactNode;
}

export function Option<T>({ children, onSelect, value }: IOption<T>) {
  const handleClick = () => {
    if (onSelect) {
      onSelect(value);
    }
  };
  return (
    <div className="dropdown-option" onClick={handleClick}>
      {children}
    </div>
  );
}
