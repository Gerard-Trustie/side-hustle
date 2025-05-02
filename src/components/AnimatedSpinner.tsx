import React from "react";
import styles from "./AnimatedSpinner.module.css";

interface AnimatedSpinnerProps {
  size: number;
  isCircle?: boolean;
}

const AnimatedSpinner: React.FC<AnimatedSpinnerProps> = ({
  size,
  isCircle = false,
}) => {
  const barThickness = size * 0.08;
  const barBorderRadius = barThickness;
  const barLength = size * 0.6;

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: isCircle ? size / 2 : size / 3,
  };

  const barStyleHorizontal = {
    width: barThickness,
    height: barLength,
    borderRadius: barBorderRadius,
  };

  const barStyleVertical = {
    width: barLength,
    height: barThickness,
    borderRadius: barBorderRadius,
  };

  return (
    <div className={styles.container} style={containerStyle}>
      <div
        className={`${styles.bar} ${styles.bar1}`}
        style={{
          ...barStyleVertical,
          top: size * 0.2,
          left: size * 0.15,
        }}
      />
      <div
        className={`${styles.bar} ${styles.bar2}`}
        style={{
          ...barStyleHorizontal,
          bottom: size * 0.2,
          left: size * 0.35,
          transform: "rotate(15deg)",
        }}
      />
      <div
        className={`${styles.bar} ${styles.bar3}`}
        style={{
          ...barStyleVertical,
          width: barLength * 0.7,
          top: size * 0.4,
          left: size * 0.45,
        }}
      />
      <div
        className={`${styles.bar} ${styles.bar4}`}
        style={{
          ...barStyleHorizontal,
          height: barLength * 0.6,
          bottom: size * 0.2,
          left: size * 0.58,
          transform: "rotate(15deg)",
        }}
      />
    </div>
  );
};

export default AnimatedSpinner;
