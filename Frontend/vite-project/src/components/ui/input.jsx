import React from "react";
import styles from "./input.module.css";

/**
 * Props:
 * - type: input type ("text", "password", etc.)
 * - className: additional custom class
 * - ...props: normal input props
 */
const Input = React.forwardRef(({ type = "text", className = "", ...props }, ref) => {
  const classes = `${styles.input} ${className}`;
  return <input type={type} ref={ref} className={classes} {...props} />;
});

Input.displayName = "Input";

export default Input;
