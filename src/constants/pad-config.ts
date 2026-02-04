import type { PadConfig } from '../types/pad';

// 4x4 grid, bottom-to-top (row 0 = bottom), left-to-right
// IDs go 0-15, row 0 first
// PAD number displayed in UI = id + 1
export const PAD_CONFIGS: PadConfig[] = [
  // Row 0 (bottom) — PADs 1-4
  { id: 0,  name: 'Bass Kick 3',   shortName: 'BKICK3',   color: '#e74c3c', sampleFile: 'squid_dnb_samples/squid bass kick 3.wav',  row: 0, col: 0 },
  { id: 1,  name: 'Bass Kick 2',   shortName: 'BKICK2',   color: '#e67e22', sampleFile: 'squid_dnb_samples/squid bass kick 2.wav',  row: 0, col: 1 },
  { id: 2,  name: 'Bass Kick',     shortName: 'BKICK',    color: '#f1c40f', sampleFile: 'squid_dnb_samples/squid bass kick.wav',    row: 0, col: 2 },
  { id: 3,  name: 'Rim',           shortName: 'RIM',      color: '#2ecc71', sampleFile: '',                                         row: 0, col: 3 },
  // Row 1 — PADs 5-8
  { id: 4,  name: 'Tom Low',       shortName: 'TOM-LO',   color: '#1abc9c', sampleFile: '',                                         row: 1, col: 0 },
  { id: 5,  name: 'Tom Mid',       shortName: 'TOM-MID',  color: '#3498db', sampleFile: '',                                         row: 1, col: 1 },
  { id: 6,  name: 'Kick',          shortName: 'KICK',     color: '#9b59b6', sampleFile: 'squid_dnb_samples/squid kick.wav',          row: 1, col: 2 },
  { id: 7,  name: 'Ghost Snare',   shortName: 'GSNARE',   color: '#e91e63', sampleFile: 'squid_dnb_samples/squid ghost snare.wav',   row: 1, col: 3 },
  // Row 2 — PADs 9-12
  { id: 8,  name: 'Snap',          shortName: 'SNAP',     color: '#00bcd4', sampleFile: '',                                         row: 2, col: 0 },
  { id: 9,  name: 'Snare 2',       shortName: 'SNARE2',   color: '#ff5722', sampleFile: 'squid_dnb_samples/squid snare 2.wav',       row: 2, col: 1 },
  { id: 10, name: 'Hat 1',         shortName: 'HAT1',     color: '#8bc34a', sampleFile: 'squid_dnb_samples/squid hat 1.wav',         row: 2, col: 2 },
  { id: 11, name: 'Snare 1',       shortName: 'SNARE1',   color: '#ff9800', sampleFile: 'squid_dnb_samples/squid snare 1.wav',       row: 2, col: 3 },
  // Row 3 (top) — PADs 13-16
  { id: 12, name: 'Cowbell',       shortName: 'COWBELL',  color: '#795548', sampleFile: '',                                         row: 3, col: 0 },
  { id: 13, name: 'Ride',          shortName: 'RIDE',     color: '#607d8b', sampleFile: '',                                         row: 3, col: 1 },
  { id: 14, name: 'Hat 2',         shortName: 'HAT2',     color: '#9c27b0', sampleFile: 'squid_dnb_samples/squid hat 2.wav',         row: 3, col: 2 },
  { id: 15, name: 'Hat 3',         shortName: 'HAT3',     color: '#673ab7', sampleFile: 'squid_dnb_samples/squid hat 3.wav',         row: 3, col: 3 },
];

export const getPadById = (id: number): PadConfig | undefined =>
  PAD_CONFIGS.find(p => p.id === id);
