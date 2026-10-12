/* AR.js 3.4.7 assumes a 4:3 tracking image in several portrait code paths.
   Fit the actual camera frame into that image without stretching, then map
   its calibrated projection back to the same cover crop as the visible video.
   This changes camera projection, never the dimensions of a solid. */
(function () {
  'use strict';
  function layout(vw, vh, tw, th, sw, sh) {
    const fit = Math.min(tw / vw, th / vh);
    const width = vw * fit, height = vh * fit;
    const cover = Math.max(sw / vw, sh / vh);
    return { width, height, x: (tw - width) / 2, y: (th - height) / 2,
      videoWidth: vw * cover, videoHeight: vh * cover,
      scaleX: tw / width * vw * cover / sw,
      scaleY: th / height * vh * cover / sh };
  }
  window.NetARViewport = { layout, register() {
    if (AFRAME.components['net-ar-viewport']) return;
    AFRAME.registerComponent('net-ar-viewport', {
      init() {
        this.frame = document.createElement('canvas');
        this.ctx = this.frame.getContext('2d', { alpha: false });
        this.adjust = new AFRAME.THREE.Matrix4();
      },
      tick() {
        const scene = this.el.sceneEl;
        const session = scene.systems.arjs?._arSession;
        const controller = session?.arContext?.arController;
        const video = session?.arSource?.domElement;
        if (!controller || !video?.videoWidth || !video.videoHeight) return;
        if (!this.originalUpdate) {
          this.context = session.arContext;
          this.originalUpdate = this.context.update;
          const component = this;
          this.context.update = function (source) {
            const c = this.arController;
            if (!c || !source.videoWidth || !source.videoHeight) return;
            const frame = component.frame;
            if (frame.width !== c.canvas.width) frame.width = c.canvas.width;
            if (frame.height !== c.canvas.height) frame.height = c.canvas.height;
            const size = layout(source.videoWidth, source.videoHeight,
              frame.width, frame.height, innerWidth, innerHeight);
            component.ctx.fillStyle = '#ffffff';
            component.ctx.fillRect(0, 0, frame.width, frame.height);
            component.ctx.drawImage(source, size.x, size.y, size.width, size.height);
            // The supplied frame already has the tracker aspect ratio. Bypass
            // ARToolkit's additional portrait squeeze/letterbox operation.
            c.orientation = 'landscape';
            c.options.orientation = 'landscape';
            return component.originalUpdate.call(this, frame);
          };
        }
        const size = layout(video.videoWidth, video.videoHeight,
          controller.canvas.width, controller.canvas.height, innerWidth, innerHeight);
        const camera = scene.camera;
        this.adjust.makeScale(size.scaleX, size.scaleY, 1);
        camera.projectionMatrix.copy(session.arContext.getProjectionMatrix()).premultiply(this.adjust);
        camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
        if (this.width !== innerWidth || this.height !== innerHeight) {
          this.width = innerWidth; this.height = innerHeight;
          scene.renderer.setSize(this.width, this.height, false);
        }
        // Keep video and WebGL independently centered in the same viewport.
        video.style.width = size.videoWidth + 'px';
        video.style.height = size.videoHeight + 'px';
        video.style.marginLeft = (innerWidth - size.videoWidth) / 2 + 'px';
        video.style.marginTop = (innerHeight - size.videoHeight) / 2 + 'px';
        video.style.left = '0px'; video.style.top = '0px';
      },
      remove() {
        if (this.originalUpdate) this.context.update = this.originalUpdate;
      }
    });
  }};
})();
