import * as Tone from 'tone';
import { PAD_CONFIGS } from '../constants/pad-config';

export class SampleLoader {
  private players: Map<number, Tone.Player> = new Map();
  private loaded = false;

  async load(): Promise<void> {
    if (this.loaded) return;

    // Only load pads that have a sample file assigned
    const loadPromises = PAD_CONFIGS
      .filter((pad) => pad.sampleFile)
      .map(async (pad) => {
        try {
          const url = `/samples/${pad.sampleFile}`;
          const response = await fetch(url, { method: 'HEAD' });
          if (response.ok) {
            const player = new Tone.Player({
              url,
            }).toDestination();
            this.players.set(pad.id, player);
          }
        } catch {
          // File not available — pad stays unloaded
        }
      });

    await Promise.all(loadPromises);

    try {
      await Tone.loaded();
    } catch {
      // Some players may have failed
    }

    this.loaded = true;
  }

  getPlayer(padId: number): Tone.Player | undefined {
    return this.players.get(padId);
  }

  isLoaded(): boolean {
    return this.loaded;
  }

  dispose(): void {
    this.players.forEach((player) => player.dispose());
    this.players.clear();
    this.loaded = false;
  }
}
