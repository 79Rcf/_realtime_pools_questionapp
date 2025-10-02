import React from "react";
import { Slot } from "@radix-ui/react-slot";
import styles from "./button.module.css";

/**
 * Props:
 * - variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
 * - size: "default" | "sm" | "lg" | "icon"
 * - asChild: boolean
 * - className: additional custom class
 * - ...props: normal button props
 */
const Button = React.forwardRef(
  ({ variant = "default", size = "default", asChild = false, className = "", ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const classes = `${styles.button} ${styles[variant]} ${styles[size]} ${className}`;
    return <Comp ref={ref} className={classes} {...props} />;
  }
);

Button.displayName = "Button";

export default Button;
