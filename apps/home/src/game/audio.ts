export class ArcadeAudio {
  enabled = false;
  private context?: AudioContext;
  play(kind: "hit" | "flipper" | "launch", pitch = 0) {
    if (!this.enabled) return;
    this.context ??= new AudioContext();
    const context = this.context;
    void context.resume();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;
    oscillator.type = kind === "hit" ? "sine" : "triangle";
    oscillator.frequency.setValueAtTime(
      kind === "hit" ? 440 + pitch * 100 : kind === "launch" ? 180 : 90,
      now,
    );
    oscillator.frequency.exponentialRampToValueAtTime(
      kind === "hit" ? 280 + pitch * 70 : 45,
      now + 0.11,
    );
    gain.gain.setValueAtTime(0.065, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.15);
  }
  dispose() {
    void this.context?.close();
  }
}
