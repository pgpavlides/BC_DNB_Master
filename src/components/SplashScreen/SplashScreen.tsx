import { useState, useCallback } from 'react';
import styles from './SplashScreen.module.css';

interface SplashScreenProps {
  onEnter: () => void;
}

export function SplashScreen({ onEnter }: SplashScreenProps) {
  const [hiding, setHiding] = useState(false);

  const handleEnter = useCallback(() => {
    setHiding(true);
    // Let the fade-out transition finish before unmounting
    setTimeout(onEnter, 600);
  }, [onEnter]);

  return (
    <div className={`${styles.overlay} ${hiding ? styles.overlayHidden : ''}`}>
      <div className={styles.logoWrapper}>
        <img
          src="/BCDNB_Sequencer_logo.png"
          alt="BCDNB Drum & Bass Sequencer"
          className={styles.logo}
        />
      </div>
      <h1 className={styles.title}>BCDNB Sequencer</h1>
      <p className={styles.description}>
        A drum &amp; bass step sequencer, finger-drum trainer and practice tool.
      </p>
      <button className={styles.enterBtn} onClick={handleEnter}>
        Enter
      </button>
    </div>
  );
}
