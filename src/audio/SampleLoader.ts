import * as Tone from 'tone';
import { PAD_CONFIGS } from '../constants/pad-config';

export class SampleLoader {
  private players: Map<number, Tone.Player> = new Map();
  private loaded = false;

  async load(): Promise<void> {
    if (this.loaded) return;

    // Only load pads that have a sample file assigned
    const padsWithSamples = PAD_CONFIGS.filter((pad) => pad.sampleFile);

    const loadPromises = padsWithSamples.map((pad) => {
      return new Promise<void>((resolve) => {
        // Encode spaces in filenames
        const url = `/samples/${pad.sampleFile.split('/').map(encodeURIComponent).join('/')}`;
        const player = new Tone.Player({
          url,
          onload: () => {
            this.players.set(pad.id, player);
            resolve();
          },
          onerror: () => {
            console.warn(`Failed to load sample: ${pad.sampleFile}`);
            resolve();
          },
        }).toDestination();
      });
    });

    await Promise.all(loadPromises);
    this.loaded = true;
  }

  getPlayer(padId: number): Tone.Player | undefined {
    return this.players.get(padId);
  }

  getAllPlayers(): Map<number, Tone.Player> {
    return this.players;
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
