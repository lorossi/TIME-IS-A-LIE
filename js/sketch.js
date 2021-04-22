class Sketch extends Engine {
  setup() {
    // parameters
    this._word = "TIME IS A LIE ".split("");
    this._duration = 900;
    this._recording = false;
    this._show_fps = false;
    // sketch setup
    console.clear();
    this._cols = this._word.length + 1;
    this._phase_duration = this._duration / 4;
    this._scl = this._width / this._cols;
    this._invert = false;
    // setup capturer
    if (this._recording) {
      this._capturer = new CCapture({ format: "png" });
      this._capturer_started = false;
    }
  }

  draw() {
    if (!this._capturer_started && this._recording) {
      this._capturer_started = true;
      this._capturer.start();
      console.log("%c Recording started", "color: green; font-size: 2rem");
    }

    // frames since the animation started
    const elapsed = (this._frameCount % (this._phase_duration * 4));
    // current period in the animation
    const period = parseInt(elapsed / this._phase_duration);

    // check if movement has to be inverted
    if (elapsed % (this._phase_duration * 2) == 0) this._invert = !this._invert;
    // position offset
    let dx, dy;
    if (period % 2 == 0) {
      const dir = this._invert ? -1 : 1;
      const percent = easeInOut((elapsed % this._phase_duration) / this._phase_duration);
      // up-down
      dx = 0;
      dy = percent * (this._scl * this._word.length) * dir;
    } else {
      const dir = this._invert ? -1 : 1;
      const percent = easeInOut((elapsed % this._phase_duration) / this._phase_duration);
      // left-right
      dx = percent * (this._scl * this._word.length) * dir;
      dy = 0;
    }
    // pre-loop calculations
    let count = 0;
    const delimiter = this._word.length;
    const dh = parseInt(this._scl * 0.1);

    // sketch init (font styling and translation)
    this._ctx.save();
    this._ctx.translate(this._scl / 2, this._scl / 2);
    this._ctx.textAlign = "center";
    this._ctx.textBaseline = "middle";
    this._ctx.font = `${this._scl}px HACK`;
    for (let y = -delimiter; y < this._cols + delimiter; y++) {
      for (let x = -delimiter; x < this._cols + delimiter; x++) {
        // current movement direction
        let dir;
        if (dx == 0) dir = x % 2 == 0 ? -1 : 1;
        else if (dy == 0) dir = y % 2 == 0 ? -1 : 1;
        // text coordinates
        const tx = parseInt(x * this._scl + dx * dir);
        const ty = parseInt(y * this._scl + dy * dir);
        const out = tx < -this._scl || tx > this._width + this._scl || ty < -this._scl || ty > this._height + this._scl;
        // if the text is inside
        if (!out) {
          // check if text is black or not
          const white_text = (y + delimiter) % 2 == 0;
          // actually draw text
          this._ctx.save();
          this._ctx.translate(tx, ty);
          if (white_text) {
            this._ctx.fillStyle = "#FFFFFF";
            this._ctx.fillRect(-this._scl / 2, -this._scl / 2, this._scl, this._scl);
            this._ctx.fillStyle = "#000000";
            this._ctx.fillText(this._word[count], 0, dh);
          } else {
            this._ctx.fillStyle = "#000000";
            this._ctx.fillRect(-this._scl / 2, -this._scl / 2, this._scl, this._scl);
            this._ctx.fillStyle = "#FFFFFF";
            this._ctx.fillText(this._word[count], 0, dh);
          }
          this._ctx.restore();
        }
        // update letter count
        count = (count + 1) % this._word.length;
      }
    }

    this._ctx.restore();

    // show FPS
    if (this._show_fps) {
      this._ctx.save();
      this._ctx.fillStyle = "red";
      this._ctx.font = "30px Hack";
      this._ctx.fillText(parseInt(this._frameRate), 40, 40);
      this._ctx.restore();
    }
    // handle recording
    if (this._recording) {
      if (this._frameCount < this._duration) {
        this._capturer.capture(this._canvas);
      } else {
        this._recording = false;
        this._capturer.stop();
        this._capturer.save();
        console.log("%c Recording ended", "color: red; font-size: 2rem");
      }
    }

  }
}

const easeInOut = x => {
  return -(Math.cos(Math.PI * x) - 1) / 2;
};