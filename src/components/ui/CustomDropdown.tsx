import { useState, useRef, useEffect } from "react";
import styles from "./CustomDropdown.module.css";

type Option = { value: string; label: string };

type CustomDropdownProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  name?: string;
  error?: string;
};

export default function CustomDropdown({
  options,
  value,
  onChange,
  placeholder = "Select...",
  label,
  name,
  error,
}: CustomDropdownProps) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState<number>(-1);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(option: Option) {
    onChange(option.value);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        setOpen(true);
        setHighlighted(0);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      setHighlighted((h) => Math.min(h + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" && highlighted >= 0) {
      handleSelect(options[highlighted]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const selected = options.find((o) => o.value === value);

  return (
    <div
      className={styles.dropdown}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      ref={ref}
      aria-haspopup="listbox"
      aria-expanded={open}
    >
      {label && <label className={styles.label}>{label}</label>}
      <div
        className={`${styles.control} ${error ? styles.error : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-controls={name}
      >
        <span className={selected ? styles.selected : styles.placeholder}>
          {selected ? selected.label : placeholder}
        </span>
        <span className={styles.arrow} />
      </div>
      {open && (
        <ul className={styles.menu} role="listbox" id={name}>
          {options.map((option, idx) => (
            <li
              key={option.value}
              className={`${styles.option} ${
                value === option.value ? styles.selectedOption : ""
              } ${highlighted === idx ? styles.highlighted : ""}`}
              onClick={() => handleSelect(option)}
              onMouseEnter={() => setHighlighted(idx)}
              role="option"
              aria-selected={value === option.value}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}